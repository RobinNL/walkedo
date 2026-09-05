import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ogImage, pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";
import { JsonLd } from "@/app/shared/json-ld";
import { service } from "@/app/shared/structured-data";

export async function generateMetadata(
    { params }: { params: Promise<{ locale: string }> },
): Promise<Metadata> {
    return pageMetadata({
        locale: (await params).locale as Locale,
        key: 'uitlaatservice',
        path: '/uitlaatservice',
        image: ogImage('uitlaatservice'),
    });
}

export default async function Layout(
    { children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> },
) {
    const locale = (await params).locale as Locale;
    const t = await getTranslations({ locale, namespace: 'metadata' });

    // The five subscription tiers priced on the page, €51,75 to €257,75 a month.
    const schema = service({
        locale,
        name: t('uitlaatservice.title'),
        description: t('uitlaatservice.description'),
        path: '/uitlaatservice',
        image: '/images/og/uitlaatservice.jpg',
        lowPrice: 51.75,
        highPrice: 257.75,
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
