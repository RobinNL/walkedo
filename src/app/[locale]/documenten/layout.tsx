import type { Metadata } from "next";
import { ogImage, pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata(
    { params }: { params: { locale: string } },
): Promise<Metadata> {
    return pageMetadata({
        locale: params.locale as Locale,
        key: 'documenten',
        path: '/documenten',
        image: ogImage('documenten'),
    });
}

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
