import Styles from "@/app/[locale]/northern-Inuit-dog/norhern-inuit.module.scss";
import Image from "next/image";
import React from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { WalkedoList } from "../../../../components/list/list";
import { Link } from "@/i18n/navigation";
import { WalkedoButton } from "../../../../components/button/button";
import type { Locale } from "@/i18n/routing";

export default async function Page({ params }: { params: { locale: string } }) {
    setRequestLocale(params.locale as Locale);
    const t = await getTranslations('northernInuit');

    const benefitRace: string[] = [
        t('traits.family'),
        t('traits.alone'),
        t('traits.guard'),
        t('traits.intelligent'),
        t('traits.walks'),
        t('traits.pack'),
    ];

    return (
        <main>
            <div className={Styles.heroImage}>
                <Image sizes='max-width: 100vw' className={Styles.heroImageInner} fill={true}
                       alt={t('heroAlt')}
                       objectPosition={'50% 50%'}
                       src={'/images/inuit-dog/northern-inuit-sand.jpg'}/>
            </div>
            <div className={'container'}>

                <h1 className={Styles.header}>{t('title')}</h1>

                <p className={Styles.mainHeroContentWrap}>{t('intro')}</p>

                <div className={Styles.contentRow}>

                    <div className={Styles.contentBlock}>
                        <h3>{t('traitsHeading')}</h3>
                        <WalkedoList items={benefitRace}/>
                    </div>

                    <div className={Styles.asideBlock}>
                        <Image fill={true} className={Styles.asideBlockImage}
                               src={'/images/inuit-dog/pups-northern-inuit-dog.jpeg'}
                               alt={t('pupsAlt')}/>
                    </div>

                </div>

                <div className={Styles.puppyContainer}>
                    <h3>{t('puppyHeading')}</h3>
                    <p>{t('puppyBody')}</p>
                    <Link className={Styles.puppyContainerCta} href={'/aanmelden?service=puppy'}>
                        <WalkedoButton fullWidth={true} label={t('puppyCta')}/>
                    </Link>
                </div>

            </div>
        </main>
    );
}
