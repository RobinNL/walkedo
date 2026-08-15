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
import { SITE_URL, alternates } from "@/i18n/metadata";

const GTM_ID = "GTM-N4V9NTB9";

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
    params,
}: {
    params: { locale: string };
}): Promise<Metadata> {
    const locale = params.locale as Locale;
    const t = await getTranslations({ locale, namespace: "metadata" });

    return {
        metadataBase: new URL(SITE_URL),
        title: {
            default: `Walkedo | ${t("home.title")}`,
            template: "%s | Walkedo",
        },
        description: t("home.description"),
        alternates: alternates(locale, ""),
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
    params: { locale: string };
}>) {
    const { locale } = params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    // Required for static rendering of the pages inside this layout.
    setRequestLocale(locale);

    return (
        <html lang={locale}>
        <body className={inter.className}>
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
