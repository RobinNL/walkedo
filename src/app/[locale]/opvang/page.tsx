import Image from "next/image";
import Styles from "./opvang.module.scss";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { WalkedoList } from "../../../../components/list/list";
import { WalkedoButton } from "../../../../components/button/button";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export default async function Page({ params }: { params: { locale: string } }) {
    setRequestLocale(params.locale as Locale);
    const t = await getTranslations('opvang');

    return (
        <main>
            <div className={Styles.heroImage}>
                <Image priority sizes='100vw' className={Styles.heroImageInner} fill={true}
                       alt={t('heroAlt')}
                       objectPosition={'80% 90%'}
                       src={'/images/opvang/hond-op-bank.png'}/>
            </div>

            <div className={'container'}>

                <div className={Styles.heroIntroBlock}>
                    <h1 className={Styles.header}>{t('title')}</h1>
                    <h2 className={Styles.subheader}>{t('subtitle')}</h2>
                    <p>{t('intro')}</p>
                    <p className={Styles.crossLink}>
                        {t.rich('crossLinkText', {
                            link: (chunks) => (
                                <Link className={Styles.rulesLink} href={'/dagopvang'}>{chunks}</Link>
                            ),
                        })}
                    </p>
                </div>

                <div className={Styles.contentRow}>

                    <div className={Styles.contentBlock}>
                        <h3>{t('benefitsHeading')}</h3>
                        <p>{t('benefitsIntro')}</p>
                        <WalkedoList items={[
                            t('benefits.weekendOrHoliday'),
                            t('benefits.fixedRate'),
                            t('benefits.company'),
                            t('benefits.joinsWalks'),
                            t('benefits.insideOutside'),
                        ]}/>
                    </div>

                    <div className={Styles.opvangHondImage}>
                        <Image sizes='max-width: 100vw'
                               objectPosition={'50% 50%'}
                               fill={true}
                               className={Styles.opvangHondImageInner}
                               src={'/images/opvang/koda-christmas-northern-inuit-dog.jpeg'}
                               alt={t('dogImageAlt')}/>
                    </div>

                </div>

                <div>
                    <h3>{t('pricingHeading')}</h3>
                    <div className={Styles.tablePricingRow}>
                        <table>
                            <thead>
                            <tr>
                                <th>{t('table.rates')}</th>
                                <th>{t('table.highSeason')}</th>
                                <th>{t('table.lowSeason')}</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{t('table.daysOneToSix')}</td>
                                <td>€30,-</td>
                                <td>€25,-</td>
                            </tr>
                            <tr>
                                <td>{t('table.daysSevenPlus')}</td>
                                <td>€25,-</td>
                                <td>€20,-</td>
                            </tr>
                            </tbody>
                        </table>

                    </div>
                    <p className={Styles.priceNote}>
                        {t.rich('dayCarePricingText', {
                            link: (chunks) => (
                                <Link className={Styles.rulesLink} href={'/dagopvang'}>{chunks}</Link>
                            ),
                        })}
                    </p>
                    <p>
                        {t.rich('rulesText', {
                            link: (chunks) => (
                                <Link className={Styles.rulesLink} href={'/opvang/voorwaarden'}>{chunks}</Link>
                            ),
                        })}
                    </p>

                    <Link className={Styles.signupCta} href={'/aanmelden?service=opvang'}>
                        <WalkedoButton fullWidth={true} label={t('cta')}/>
                    </Link>

                </div>

            </div>

        </main>
    );
}
