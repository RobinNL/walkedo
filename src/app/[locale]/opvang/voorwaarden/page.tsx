import Styles from './voorwaarden.module.scss';
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata(
    { params }: { params: { locale: string } },
): Promise<Metadata> {
    return pageMetadata({
        locale: params.locale as Locale,
        key: 'voorwaarden',
        path: '/opvang/voorwaarden',
    });
}

const PARAGRAPHS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10', 'p11'] as const;

export default async function Page({ params }: { params: { locale: string } }) {
    const locale = params.locale as Locale;
    setRequestLocale(locale);
    const t = await getTranslations('voorwaarden');

    return (
        <main>
            <div className={Styles.docWrapper}>

                <h1 className={Styles.docTitle}>{t('title')}</h1>
                <p>{t('published')}</p>

                <a className={Styles.downloadLink}
                   href={'/files/voorwaarden-hondenopvang-walkedo-arnhem.pdf'}
                   target={'_blank'} rel={'noopener noreferrer'}>{t('download')}</a>

                {/* The Dutch text is the binding version; the English page says so. */}
                {locale !== 'nl' ? <p><em>{t('note')}</em></p> : null}

                {PARAGRAPHS.map((key) => (
                    <p key={key}>{t(key)}</p>
                ))}

            </div>

        </main>
    );
}
