import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { locales, routing, type Locale } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const LOCALE_COOKIE = "NEXT_LOCALE";

function isLocale(value: string | undefined): value is Locale {
    return !!value && (locales as readonly string[]).includes(value);
}

function localeFromPath(pathname: string): Locale | undefined {
    const segment = pathname.split("/")[1];
    return isLocale(segment) ? segment : undefined;
}

/**
 * Geo headers, in order of preference.
 *
 * This used to read only `x-vercel-ip-country`. That header does not exist on
 * DigitalOcean App Platform, so `country` was always "" and the NL check below
 * could never be true -- every unprefixed visitor was sent to /en, including
 * Dutch ones, on a site whose primary market is Arnhem. Confirmed against
 * production: Accept-Language nl-NL, en-US and de-DE all redirected to /en.
 *
 * The list is kept rather than replaced so the detection follows the app if it
 * moves host: `cf-ipcountry` appears when a Cloudflare zone has IP geolocation
 * enabled (DigitalOcean's bundled CDN does not expose it), `x-vercel-ip-country`
 * on Vercel. When neither is present we fall back to Accept-Language, which is
 * always available.
 */
const COUNTRY_HEADERS = ["cf-ipcountry", "x-vercel-ip-country"] as const;

/** Cloudflare's placeholders for "unknown" / Tor -- not real countries. */
const UNKNOWN_COUNTRIES = new Set(["XX", "T1"]);

function countryOf(request: NextRequest): string | undefined {
    for (const header of COUNTRY_HEADERS) {
        const value = request.headers.get(header)?.toUpperCase();
        if (value && !UNKNOWN_COUNTRIES.has(value)) return value;
    }
    return undefined;
}

/** First supported language in the visitor's Accept-Language, by q-value. */
function fromAcceptLanguage(request: NextRequest): Locale | undefined {
    const header = request.headers.get("accept-language");
    if (!header) return undefined;

    const ranked = header
        .split(",")
        .map((part) => {
            const [tag, ...params] = part.trim().split(";");
            const q = params
                .map((p) => p.trim())
                .find((p) => p.startsWith("q="))
                ?.slice(2);
            return { tag: tag.trim().toLowerCase(), q: q === undefined ? 1 : Number(q) };
        })
        .filter((entry) => entry.tag !== "" && !Number.isNaN(entry.q) && entry.q > 0)
        .sort((a, b) => b.q - a.q);

    for (const { tag } of ranked) {
        // "*" means "anything", which tells us nothing -- let the default decide.
        if (tag === "*") return undefined;
        const base = tag.split("-")[0];
        if (isLocale(base)) return base;
    }
    return undefined;
}

/**
 * Netherlands gets Dutch, everyone else gets English. An explicit choice made
 * via the footer switcher is stored in a cookie and always wins.
 */
function detectLocale(request: NextRequest): Locale {
    const fromCookie = request.cookies.get(LOCALE_COOKIE)?.value;
    if (isLocale(fromCookie)) return fromCookie;

    const country = countryOf(request);
    if (country) return country === "NL" ? "nl" : "en";

    return fromAcceptLanguage(request) ?? "en";
}

export default function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    const current = localeFromPath(pathname);

    // Already inside a locale: let next-intl handle it.
    //
    // This deliberately does NOT write the NEXT_LOCALE cookie any more. Setting
    // it here put a Set-Cookie on the response of every request from a visitor
    // who did not already have one, and DigitalOcean's Cloudflare will not cache
    // a response carrying Set-Cookie -- measured as `cf-cache-status: BYPASS`,
    // meaning every first-time visitor got an uncached origin render. The cookie
    // is now written client-side by the footer language switcher, which is the
    // only place a visitor actually expresses a choice.
    if (current) {
        return intlMiddleware(request);
    }

    // Unprefixed path: decide a locale and send the visitor there. 307 rather
    // than 301 so the negotiated result is never cached as permanent.
    const locale = detectLocale(request);
    const url = new URL(`/${locale}${pathname === "/" ? "" : pathname}${search}`, request.url);
    const response = NextResponse.redirect(url, 307);

    // This redirect is now content-negotiated per visitor (cookie, then geo,
    // then Accept-Language), so it must never be held by a shared cache -- one
    // cached copy would pin every later visitor to one language.
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Vary", "Accept-Language, Cookie");
    return response;
}

export const config = {
    // Skip API routes, Next internals, Vercel internals, and anything with a
    // file extension (images, PDFs, fonts, videos, favicons).
    matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
