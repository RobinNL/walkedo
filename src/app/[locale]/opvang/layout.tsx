import type { Metadata } from "next";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata(
    { params }: { params: { locale: string } },
): Promise<Metadata> {
    return pageMetadata({
        locale: params.locale as Locale,
        key: 'opvang',
        path: '/opvang',
    });
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
