import type { Locale } from "@/i18n/routing";

const LOCALE_TAG: Record<Locale, string> = {
    nl: "nl-NL",
    en: "en-GB",
};

/**
 * `date` is an ISO yyyy-mm-dd string. `short` gives a numeric date, otherwise
 * the month is spelled out in the active locale.
 */
export const RenderDate = ({ date, short, locale }: {
    date: string;
    short: boolean;
    locale: Locale;
}) => {
    const [year, month, day] = date.split('-').map(Number);
    const value = new Date(Date.UTC(year, month - 1, day));

    return new Intl.DateTimeFormat(LOCALE_TAG[locale], {
        day: 'numeric',
        month: short ? 'numeric' : 'long',
        year: 'numeric',
        timeZone: 'UTC',
    }).format(value);
}
