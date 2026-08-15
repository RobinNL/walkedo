import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { locales, routing, type Locale } from "@/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const LOCALE_COOKIE = "NEXT_LOCALE";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function isLocale(value: string | undefined): value is Locale {
    return !!value && (locales as readonly string[]).includes(value);
}

function localeFromPath(pathname: string): Locale | undefined {
    const segment = pathname.split("/")[1];
    return isLocale(segment) ? segment : undefined;
}

/**
 * Netherlands gets Dutch, everyone else gets English. An explicit choice made
 * via the footer switcher is stored in a cookie and always wins over geo.
 */
function detectLocale(request: NextRequest): Locale {
    const fromCookie = request.cookies.get(LOCALE_COOKIE)?.value;
    if (isLocale(fromCookie)) return fromCookie;

    const country =
        request.headers.get("x-vercel-ip-country")?.toUpperCase() ?? "";
    return country === "NL" ? "nl" : "en";
}

export default function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;
    const current = localeFromPath(pathname);

    // Already inside a locale: let next-intl handle it, and keep the cookie in
    // sync so a later visit to the bare domain lands in the same language.
    if (current) {
        const response = intlMiddleware(request);
        if (request.cookies.get(LOCALE_COOKIE)?.value !== current) {
            response.cookies.set(LOCALE_COOKIE, current, {
                path: "/",
                maxAge: COOKIE_MAX_AGE,
                sameSite: "lax",
            });
        }
        return response;
    }

    // Unprefixed path: decide a locale and send the visitor there. 307 rather
    // than 301 so the geo decision is never cached as permanent.
    const locale = detectLocale(request);
    const url = new URL(`/${locale}${pathname === "/" ? "" : pathname}${search}`, request.url);
    return NextResponse.redirect(url, 307);
}

export const config = {
    // Skip API routes, Next internals, Vercel internals, and anything with a
    // file extension (images, PDFs, fonts, videos, favicons).
    matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
