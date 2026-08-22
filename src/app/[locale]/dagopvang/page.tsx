import Image from "next/image";
import Styles from "./dagopvang.module.scss";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { WalkedoList } from "../../../../components/list/list";
import { WalkedoPricing } from "../../../../components/pricing/pricing";
import { WalkedoButton } from "../../../../components/button/button";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import React from "react";

export default async function Page({ params }: { params: { locale: string } }) {
    setRequestLocale(params.locale as Locale);
    const t = await getTranslations('dagopvang');

    return (
        <main>
            <div className={Styles.heroImage}>
                <Image priority sizes='100vw' className={Styles.heroImageInner} fill={true}
                       alt={t('heroAlt')}
                       objectPosition={'50% 50%'}
                       src={'/images/opvang/dagopvang.jpg'}/>
            </div>

            <div className={'container'}>

                <div className={Styles.heroIntroBlock}>
                    <h1 className={Styles.header}>{t('title')}</h1>
                    <h2 className={Styles.subheader}>{t('subtitle')}</h2>
                    <p>{t('intro')}</p>
                    <p className={Styles.crossLink}>
                        {t.rich('crossLinkText', {
                            link: (chunks) => (
                                <Link className={Styles.rulesLink} href={'/opvang'}>{chunks}</Link>
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

                    <div className={Styles.dagopvangHondImage}>
                        <Image sizes='max-width: 100vw'
                               objectPosition={'80% 50%'}
                               fill={true}
                               className={Styles.dagopvangHondImageInner}
                               src={'/images/opvang/dagopvang-walkedo-arnhem.png'}
                               alt={t('dogImageAlt')}/>
                    </div>

                </div>

                <div>
                    <h3>{t('pricingHeading')}</h3>

                    <WalkedoPricing defaultService={'dagopvang'}/>

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
