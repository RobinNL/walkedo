import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../styles/globals.scss";
import Styles from './page.module.scss';
import GlobalNavbar from "@/layout/navbar/global-navbar";
import GlobalFooter from "@/layout/footer/global-footer";

const inter = Inter({ subsets: ["latin"] });

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
        <GlobalNavbar />
        <main className={Styles.main}>
          {children}
        </main>
        <GlobalFooter />
      </body>
    </html>
  );
}
