'use client'

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";
import Styles from './global-footer.module.scss';

const LABEL_KEY: Record<Locale, 'languageNl' | 'languageEn'> = {
    nl: 'languageNl',
    en: 'languageEn',
};

const HREFLANG: Record<Locale, string> = {
    nl: 'nl-NL',
    en: 'en',
};

/**
 * Real anchors rather than a JS toggle, so both language versions are
 * crawlable from every page. The NEXT_LOCALE cookie is not written here —
 * the middleware sets it from the prefix of whichever URL you land on, so
 * following one of these links is enough to make the choice stick.
 */
export const LanguageSwitcher = () => {
    const t = useTranslations('footer');
    const active = useLocale() as Locale;
    // Unprefixed path, so it can be re-prefixed with any locale.
    const pathname = usePathname();

    return (
        <div className={Styles.footerSection}>
            <h3>{t('language')}</h3>
            <ul className={Styles.linksList}>
                {locales.map((locale) => {
                    const isActive = locale === active;
                    return (
                        <li key={locale}>
                            <a href={`/${locale}${pathname === '/' ? '' : pathname}`}
                               hrefLang={HREFLANG[locale]}
                               lang={locale}
                               aria-current={isActive ? 'true' : undefined}
                               className={isActive ? Styles.languageActive : undefined}>
                                {t(LABEL_KEY[locale])}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default LanguageSwitcher;
