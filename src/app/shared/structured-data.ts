import { SITE_URL } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import type { Post } from "../../../lib/blog-posts";

/**
 * Builders for the JSON-LD blocks the site emits. Every value here is already
 * published somewhere on the site (the footer, the pricing tables, the article
 * frontmatter) — these functions only restate it in a form search engines can
 * read.
 *
 * Ids are stable URLs with a fragment, so blocks on different pages refer to
 * the same business entity rather than describing a new one each time.
 */

export const BUSINESS_ID = `${SITE_URL}/#business`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/** Matches the details published in the site footer. */
export function localBusiness(locale: Locale) {
    return {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": BUSINESS_ID,
        name: "Walkedo",
        url: `${SITE_URL}/${locale}`,
        image: `${SITE_URL}/images/og/home.jpg`,
        logo: `${SITE_URL}/images/brand/walkedo-logo.svg`,
        email: "woof@walkedo.com",
        address: {
            "@type": "PostalAddress",
            streetAddress: "Karmelitessenlaan 26",
            postalCode: "6816 PK",
            addressLocality: "Arnhem",
            addressRegion: "Gelderland",
            addressCountry: "NL",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: 52.0084452,
            longitude: 5.8862349,
        },
        areaServed: [
            { "@type": "City", name: "Arnhem" },
            { "@type": "Place", name: "Arnhem Noord" },
            { "@type": "Place", name: "Oosterbeek" },
        ],
        // Chamber of Commerce registration, as shown in the footer.
        identifier: {
            "@type": "PropertyValue",
            propertyID: "KvK",
            value: "91522765",
        },
        sameAs: [
            "https://www.instagram.com/walkedohus",
            "https://www.facebook.com/walkedo",
        ],
        knowsLanguage: ["nl-NL", "en"],
    };
}

export function website(locale: Locale) {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: `${SITE_URL}/${locale}`,
        name: "Walkedo",
        inLanguage: locale === "nl" ? "nl-NL" : "en",
        publisher: { "@id": BUSINESS_ID },
    };
}

/**
 * A service with a price range. `lowPrice`/`highPrice` rather than a list of
 * individual offers, because the tiers on the page differ by frequency and
 * season rather than being separate purchasable products.
 */
export function service({
    locale,
    name,
    description,
    path,
    image,
    lowPrice,
    highPrice,
    offerCount,
    unitCode,
}: {
    locale: Locale;
    name: string;
    description: string;
    path: string;
    image: string;
    lowPrice: number;
    highPrice: number;
    offerCount: number;
    /** UN/CEFACT code — MON for a monthly rate, DAY for a daily one. */
    unitCode: "MON" | "DAY";
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        name,
        description,
        url: `${SITE_URL}/${locale}${path}`,
        image: `${SITE_URL}${image}`,
        serviceType: name,
        provider: { "@id": BUSINESS_ID },
        areaServed: [
            { "@type": "City", name: "Arnhem" },
            { "@type": "Place", name: "Oosterbeek" },
        ],
        offers: {
            "@type": "AggregateOffer",
            priceCurrency: "EUR",
            lowPrice,
            highPrice,
            offerCount,
            availability: "https://schema.org/InStock",
            // Carries the billing unit, which AggregateOffer alone cannot express.
            priceSpecification: {
                "@type": "UnitPriceSpecification",
                priceCurrency: "EUR",
                minPrice: lowPrice,
                maxPrice: highPrice,
                unitCode,
            },
        },
    };
}

/** Built entirely from the article's own frontmatter. */
export function article(post: Post, locale: Locale) {
    const url = `${SITE_URL}/${locale}/posts/${post.slug}`;

    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: post.title,
        description: post.description,
        image: `${SITE_URL}${post.image}`,
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: locale === "nl" ? "nl-NL" : "en",
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        author: { "@id": BUSINESS_ID },
        publisher: { "@id": BUSINESS_ID },
    };
}

/**
 * `trail` is ordered root-last-excluded: pass the intermediate and final
 * crumbs only, the home entry is prepended here.
 */
export function breadcrumbs(
    locale: Locale,
    home: string,
    trail: { name: string; path: string }[],
) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: home,
                item: `${SITE_URL}/${locale}`,
            },
            ...trail.map((crumb, index) => ({
                "@type": "ListItem",
                position: index + 2,
                name: crumb.name,
                item: `${SITE_URL}/${locale}${crumb.path}`,
            })),
        ],
    };
}
