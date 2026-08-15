import { defineRouting } from "next-intl/routing";

export const locales = ["nl", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "nl";

export const routing = defineRouting({
    locales,
    defaultLocale,
    // Both locales are prefixed: /nl/... and /en/...
    localePrefix: "always",
    // Detection is handled in src/middleware.ts, which uses the Vercel geo
    // header rather than Accept-Language.
    localeDetection: false,
});
