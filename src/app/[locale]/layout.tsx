import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { GoogleTagManager } from "@next/third-parties/google";

import "../globals.scss";
import Styles from "./page.module.scss";
import GlobalNavbar from "@/layout/desktop-navbar/global-navbar";
import GlobalFooter from "@/layout/footer/global-footer";
import MobileNavbar from "@/layout/mobile-navbar/mobile-navbar";
import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL, alternates, ogImage, ogImages } from "@/i18n/metadata";
import { JsonLd } from "@/app/shared/json-ld";
import { localBusiness, website } from "@/app/shared/structured-data";

const GTM_ID = "GTM-N4V9NTB9";

const inter = Inter({ subsets: ["latin"] });

/**
 * Caps how long the CDN may hold a page. Emits `s-maxage=3600`, and paired with
 * `expireTime: 7200` in next.config.mjs the full header is
 * `s-maxage=3600, stale-while-revalidate=3600`.
 *
 * Without this, formatRevalidate() falls through to its default and emits a
 * one-year s-maxage. That is what turned a transient mis-cache into a year-long
 * outage on four pages -- see the RSC history note in next.config.mjs. The RSC
 * bug behind it is fixed in Next 16, but this stays as defence-in-depth: it
 * bounds the damage of ANY future mis-cached variant to an hour.
 *
 * On Next 14 this was the only lever, because `headers()` could not set
 * Cache-Control on HTML. That is no longer true on 16 -- `headers()` now wins
 * outright, which means a careless rule there can override this. See the note
 * on the headers() hook in next.config.mjs.
 *
 * The content here changes on deploy, not on a timer, so a short value costs
 * nothing but a revalidation; it is a safety bound, not a freshness setting.
 */
export const revalidate = 3600;

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const locale = (await params).locale as Locale;
    const t = await getTranslations({ locale, namespace: "metadata" });
    const title = `Walkedo | ${t("home.title")}`;
    const description = t("home.description");

    return {
        metadataBase: new URL(SITE_URL),
        title: {
            default: title,
            template: "%s | Walkedo",
        },
        description,
        alternates: alternates(locale, ""),
        // The home page has no layout beneath it to call pageMetadata(), so it
        // needs its own Open Graph block or it ships without one entirely.
        // Next fills the Twitter tags from these.
        openGraph: {
            title,
            description,
            url: `${SITE_URL}/${locale}`,
            siteName: "Walkedo",
            locale: locale === "nl" ? "nl_NL" : "en_GB",
            type: "website",
            images: ogImages(ogImage("home")),
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage("home")],
        },
        manifest: "/favicon/site.webmanifest",
        icons: {
            icon: [
                { url: "/favicon/favicon-96x96.png", type: "image/png", sizes: "96x96" },
                { url: "/favicon/favicon.svg", type: "image/svg+xml" },
            ],
            shortcut: "/favicon/favicon.ico",
            apple: "/favicon/apple-touch-icon.png",
        },
        other: {
            "msapplication-TileColor": "#da532c",
        },
        verification: process.env.NEXT_PUBLIC_GSC_VERIFICATION
            ? { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION }
            : undefined,
    };
}

export const viewport = {
    themeColor: "#ffffff",
};

export default async function LocaleLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    // Required for static rendering of the pages inside this layout.
    setRequestLocale(locale);

    return (
        <html lang={locale}>
        <body className={inter.className}>
        <JsonLd data={localBusiness(locale)} />
        <JsonLd data={website(locale)} />
        <GoogleTagManager gtmId={GTM_ID} />
        <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                    height="0" width="0" style={{ display: "none", visibility: "hidden" }}></iframe>
        </noscript>
        <NextIntlClientProvider>
            <GlobalNavbar className={Styles.desktopNav} />
            <MobileNavbar className={Styles.mobileNav} />
            <main className={Styles.main}>
                {children}
            </main>
            <GlobalFooter />
        </NextIntlClientProvider>
        </body>
        </html>
    );
}
