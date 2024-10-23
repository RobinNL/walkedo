import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.scss";
import Styles from './page.module.scss';
import GlobalNavbar from "@/layout/desktop-navbar/global-navbar";
import GlobalFooter from "@/layout/footer/global-footer";
import MobileNavbar from "@/layout/mobile-navbar/mobile-navbar";
import { GoogleTagManager } from '@next/third-parties/google'


const tagManagerArgs = {
    gtmId: 'GTM-N4V9NTB9'
}

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Walkedo | Hondenservice",
    description: "Walkedo is een alles omvattende hondenservice in Arnhem Noord. Laat je hond uitlaten, vind opvang voor je hond, of cast een wolf lookalike hond voor op de foto of video.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <html lang="nl">
        <head>
            <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png"/>
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"/>
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"/>
            <link rel="manifest" href="/favicon/site.webmanifest"/>
            <meta name="msapplication-TileColor" content="#da532c"/>
            <meta name="theme-color" content="#ffffff"/>
        </head>
        <GoogleTagManager gtmId={tagManagerArgs.gtmId} />
        <body className={inter.className}>
        <noscript>
            <iframe src={`https://www.googletagmanager.com/ns.html?id=${tagManagerArgs.gtmId}`}
                    height="0" width="0" style={{display: "none", visibility: "hidden"}}></iframe>
        </noscript>
        <GlobalNavbar className={Styles.desktopNav}/>
        <MobileNavbar className={Styles.mobileNav}/>
        <main className={Styles.main}>
            {children}
        </main>
        <GlobalFooter/>
        </body>
        </html>
    );
}
