import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { type Locale } from "./routing";

export const SITE_URL = "https://walkedo.com";

const OG_LOCALE: Record<Locale, string> = {
    nl: "nl_NL",
    en: "en_GB",
};

/**
 * Share cards, pre-cropped to the 1200x630 that Facebook, WhatsApp, LinkedIn
 * and X all render at. Generated from each page's own hero photo; see
 * public/images/og.
 */
export const ogImage = (name: string) => `/images/og/${name}.jpg`;

/** Declaring the dimensions saves scrapers a round trip to measure the file. */
export function ogImages(image: string) {
    return [{ url: image, width: 1200, height: 630, alt: "Walkedo" }];
}

/**
 * Canonical + hreflang for a path, where `path` is the route *without* the
 * locale prefix (e.g. "/opvang" or "" for the home page).
 *
 * `languages` may be narrowed for content that only exists in one locale —
 * articles pass the locales they actually have.
 */
export function alternates(locale: Locale, path = "", available?: readonly Locale[]) {
    const suffix = path === "/" ? "" : path;
    const languages: Record<string, string> = {};

    const present = available ?? (["nl", "en"] as const);
    if (present.includes("nl")) languages["nl-NL"] = `${SITE_URL}/nl${suffix}`;
    if (present.includes("en")) languages["en"] = `${SITE_URL}/en${suffix}`;
    languages["x-default"] = `${SITE_URL}/${present.includes("nl") ? "nl" : present[0]}${suffix}`;

    return {
        canonical: `${SITE_URL}/${locale}${suffix}`,
        languages,
    };
}

/** Builds page metadata from the `metadata` namespace in the message catalogue. */
export async function pageMetadata({
    locale,
    key,
    path = "",
    image,
}: {
    locale: Locale;
    key: string;
    path?: string;
    image?: string;
}): Promise<Metadata> {
    const t = await getTranslations({ locale, namespace: "metadata" });
    const title = t(`${key}.title`);
    const description = t(`${key}.description`);
    const url = `${SITE_URL}/${locale}${path === "/" ? "" : path}`;
    // Every page gets a card. Falling back to the home one is still better
    // than declaring summary_large_image with nothing to fill it.
    const card = image ?? ogImage("home");

    return {
        title,
        description,
        alternates: alternates(locale, path),
        openGraph: {
            title: `${title} | Walkedo`,
            description,
            url,
            siteName: "Walkedo",
            locale: OG_LOCALE[locale],
            type: "website",
            images: ogImages(card),
        },
        twitter: {
            card: "summary_large_image",
            title: `${title} | Walkedo`,
            description,
            images: [card],
        },
    };
}
