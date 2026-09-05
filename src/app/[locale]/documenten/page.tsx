import Styles from "./documenten.module.scss";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
    setRequestLocale((await params).locale as Locale);
    const t = await getTranslations('documenten');

    return (
        <main>
            <div className={Styles.docWrapper}>
                <h1>{t('title')}</h1>
                <div className={Styles.docSectionExplain}>
                    <p>{t('intro')}</p>
                </div>
                <ul className={Styles.docList}>
                    <li>
                        <a className={Styles.docDownloadBtn} href={'/files/intakeformulier.pdf'}
                           target={'_blank'} rel={'noopener noreferrer'}>{t('intake')}</a>
                    </li>
                    <li>
                        <a className={Styles.docDownloadBtn} href={'/files/leveringsvoorwaarden.pdf'}
                           target={'_blank'} rel={'noopener noreferrer'}>{t('terms')}</a>
                    </li>
                    <li>
                        <a className={Styles.docDownloadBtn} href={'/files/sleutelcontract.pdf'}
                           target={'_blank'} rel={'noopener noreferrer'}>{t('keyContract')}</a>
                    </li>
                </ul>
            </div>
        </main>
    );
}
