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

/** A year, matching how long the choice is meant to stick. */
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Real anchors rather than a JS toggle, so both language versions are
 * crawlable from every page.
 *
 * The NEXT_LOCALE cookie is written here, on click. It used to be written by
 * the middleware, from the prefix of whichever URL you landed on -- but that
 * put a Set-Cookie on almost every response, and DigitalOcean's Cloudflare
 * refuses to cache a response carrying one (measured: `cf-cache-status:
 * BYPASS`), so every first-time visitor fell through to an origin render.
 * Writing it only where a visitor actually expresses a choice keeps page
 * responses cacheable.
 *
 * Deliberately an onClick on a real href rather than a handler that navigates:
 * with JavaScript disabled the link still works, the choice just does not
 * persist. That is the same trade-off the crawlable-anchor decision already
 * made.
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
                               onClick={() => {
                                   document.cookie =
                                       `NEXT_LOCALE=${locale}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
                               }}
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
