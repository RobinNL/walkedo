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
        key: 'dagopvang',
        path: '/dagopvang',
        image: ogImage('dagopvang'),
    });
}

export default async function Layout(
    { children, params }: { children: React.ReactNode; params: { locale: string } },
) {
    const locale = params.locale as Locale;
    const t = await getTranslations({ locale, namespace: 'metadata' });

    // The subscription prices the page shows: five monthly tiers, from one day
    // a week at €71,10 up to five days a week at €335,50.
    const schema = service({
        locale,
        name: t('dagopvang.title'),
        description: t('dagopvang.description'),
        path: '/dagopvang',
        image: '/images/og/dagopvang.jpg',
        lowPrice: 71.10,
        highPrice: 335.50,
        offerCount: 5,
        unitCode: 'MON',
    });

    return (
        <>
            <JsonLd data={schema} />
            {children}
        </>
    );
}
