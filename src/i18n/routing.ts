import { defineRouting } from "next-intl/routing";

export const locales = ["nl", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "nl";

export const routing = defineRouting({
    locales,
    defaultLocale,
    // Both locales are prefixed: /nl/... and /en/...
    localePrefix: "always",
    // Detection is handled in src/middleware.ts.
    localeDetection: false,

    // next-intl writes a NEXT_LOCALE cookie from its middleware by default.
    // That put a Set-Cookie on nearly every page response, and DigitalOcean's
    // Cloudflare will not cache a response carrying one -- measured as
    // `cf-cache-status: BYPASS`, so every first-time visitor fell through to an
    // origin render. The cookie is still used for locale detection; it is now
    // written client-side by the footer language switcher, which is the only
    // place a visitor actually chooses a language.
    localeCookie: false,
});
