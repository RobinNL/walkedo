import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../styles/globals.scss";
import Styles from './page.module.scss';
import { useMediaQuery } from '@chakra-ui/react'
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
        <body className={inter.className}>
        <GlobalNavbar className={Styles.desktopNav}/> : null
        <MobileNavbar className={Styles.mobileNav}/>
        <main className={Styles.main}>
            {children}
        </main>
        <GlobalFooter/>
        </body>
        </html>
    );
}
