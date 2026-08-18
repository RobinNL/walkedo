import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ogImage, pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { JsonLd } from "@/app/shared/json-ld";
import { service } from "@/app/shared/structured-data";

export async function generateMetadata(
    { params }: { params: { locale: string } },
): Promise<Metadata> {
    return pageMetadata({
        locale: params.locale as Locale,
        key: 'opvang',
        path: '/opvang',
        image: ogImage('opvang'),
    });
}

export default async function Layout(
    { children, params }: { children: React.ReactNode; params: { locale: string } },
) {
    const locale = params.locale as Locale;
    const t = await getTranslations({ locale, namespace: 'metadata' });

    // The rate table on the page: €20 a day off-season from day seven, up to
    // €30 a day in high season and for a single day of daycare.
    const schema = service({
        locale,
        name: t('opvang.title'),
        description: t('opvang.description'),
        path: '/opvang',
        image: '/images/og/opvang.jpg',
        lowPrice: 20,
        highPrice: 30,
        offerCount: 3,
        unitCode: 'DAY',
    });

    return (
        <>
            <JsonLd data={schema} />
            {children}
        </>
    );
}
