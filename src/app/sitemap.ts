import type { MetadataRoute } from "next";
import { getAllPosts, localesForPost } from "../../lib/blog-posts";
import { SITE_URL } from "@/i18n/metadata";
import { defaultLocale, locales, type Locale } from "@/i18n/routing";

/**
 * Routes that exist in both locales. Paths are locale-agnostic; the locale
 * prefix is added per entry. Keep in sync with src/app/[locale].
 */
const STATIC_PATHS = [
    "",
    "/uitlaatservice",
    "/opvang",
    "/opvang/voorwaarden",
    "/dagopvang",
    "/northern-Inuit-dog",
    "/casting",
    "/news",
    "/aanmelden",
    "/documenten",
];

const HREFLANG: Record<Locale, string> = {
    nl: "nl-NL",
    en: "en",
};

const url = (locale: Locale, path: string) => `${SITE_URL}/${locale}${path}`;

/**
 * Google wants every language version listed as its own <url>, each carrying
 * the full set of alternates including a self-reference and x-default.
 */
function languagesFor(path: string, available: readonly Locale[]) {
    const languages: Record<string, string> = {};
    for (const locale of available) {
        languages[HREFLANG[locale]] = url(locale, path);
    }
    languages["x-default"] = url(
        available.includes(defaultLocale) ? defaultLocale : available[0],
        path,
    );
    return languages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const entries: MetadataRoute.Sitemap = [];

    for (const path of STATIC_PATHS) {
        const languages = languagesFor(path, locales);
        for (const locale of locales) {
            entries.push({
                url: url(locale, path),
                alternates: { languages },
            });
        }
    }

    // Articles only claim the locales they were actually written in, so an
    // untranslated post never advertises a URL that renders a fallback.
    for (const locale of locales) {
        for (const post of await getAllPosts(locale)) {
            const path = `/posts/${post.slug}`;
            entries.push({
                url: url(locale, path),
                lastModified: post.date,
                alternates: { languages: languagesFor(path, localesForPost(post.slug)) },
            });
        }
    }

    return entries;
}
