import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../styles/globals.scss";
import Styles from './page.module.scss';
import GlobalNavbar from "@/layout/desktop-navbar/global-navbar";
import GlobalFooter from "@/layout/footer/global-footer";
import MobileNavbar from "@/layout/mobile-navbar/mobile-navbar";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "Walkedo | Hondenservice",
    description: "Het beste adres voor je hond",
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
        <body className={inter.className}>
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
