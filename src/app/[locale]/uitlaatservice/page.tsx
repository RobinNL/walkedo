'use client';

import Image from "next/image";
import Styles from "./uitlaatservice.module.scss";
import { Gallery } from "react-grid-gallery";
import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { WalkedoList } from "../../../../components/list/list";

const GALLERY_IMAGES = [
    { src: '/images/uitlaatservice/honden-1.png', width: 1826, height: 1645 },
    { src: '/images/uitlaatservice/honden-2.png', width: 1452, height: 1816 },
    { src: '/images/uitlaatservice/honden-3.png', width: 1454, height: 1822 },
    { src: '/images/uitlaatservice/honden-4.png', width: 1820, height: 1360 },
    { src: '/images/uitlaatservice/honden-5.png', width: 1457, height: 1820 },
    { src: '/images/uitlaatservice/honden-6.png', width: 1817, height: 1025 },
    { src: '/images/uitlaatservice/honden-7.png', width: 1455, height: 1817 },
    { src: '/images/uitlaatservice/honden-8.png', width: 1456, height: 1817 },
    { src: '/images/uitlaatservice/honden-9.png', width: 1811, height: 1024 },
    { src: '/images/uitlaatservice/honden-10.png', width: 1818, height: 1366 },
];

const PRICES = ['€51,75', '€103,50', '€155,25', '€207,00', '€257,75'];

const STEPS = ['signup', 'meet', 'trial', 'subscription'] as const;

export default function Page() {
    const t = useTranslations('uitlaatservice');

    const images = GALLERY_IMAGES.map((image, index) => ({
        ...image,
        alt: t(`galleryAlt.${index + 1}`),
    }));

    return (
        <main>
            <div className={Styles.heroImage}>
                <Image sizes='max-width: 100vw' className={Styles.heroImageInner} fill={true}
                       alt={t('heroAlt')}
                       src={'/images/uitlaatservice/walkedo-uitlaatservice.jpg'}/>
            </div>

            <div className={'container'}>

                <div className={Styles.heroIntroBlock}>
                    <h1 className={Styles.header}>{t('title')}</h1>
                    <p>{t('intro')}</p>
                </div>

                <div className={Styles.contentRow}>

                    <div className={Styles.contentBlock}>
                        <h3>{t('benefitsHeading')}</h3>
                        <p>{t('benefitsIntro')}</p>
                        <WalkedoList items={[
                            t('benefits.smallGroups'),
                            t('benefits.shortTravel'),
                            t('benefits.puppyGroups'),
                            t('benefits.curatedGroups'),
                            t('benefits.extraServices'),
                        ]}/>
                    </div>

                    <div className={Styles.arnhemMapBlock}>
                        <h3>{t('mapHeading')}</h3>
                        <p>{t('mapBody')}</p>
                        <Image width={624 / 2} height={516 / 2} src={'/images/arnhem-map.svg'}
                               alt={t('mapAlt')}/>
                    </div>

                </div>

                <div className={Styles.contentHero}>

                    <div className={Styles.contentBlock}>
                        <h3>{t('subscriptionHeading')}</h3>
                        <p>
                            {t.rich('subscriptionBody', {
                                link: (chunks) => (
                                    <Link href={'/berichten/introductie-abonnementen'}>{chunks}</Link>
                                ),
                            })}
                        </p>
                    </div>
                    <div className={Styles.subscriptionRow}>
                        {PRICES.map((price, index) => (
                            <div className={Styles.subscriptionBlock} key={price}>
                                <h3>{price}</h3>
                                <p>{t('perWeek', { count: index + 1 })}</p>
                            </div>
                        ))}
                    </div>
                    <div className={Styles.calendarLink}>
                        <Image src={'/images/calendar.svg'} className={Styles.calendarIcon}
                               alt={t('calendarAlt')} width={20} height={20}/>
                        <Link href={'/berichten/vrije-dagen-2026'} className={Styles.calendarLink}>
                            {t('calendarLink')}
                        </Link>
                    </div>
                </div>

                <div className={Styles.contentHero}>
                    <h3>{t('galleryHeading')}</h3>

                    <Gallery enableImageSelection={false} images={images}/>
                </div>


                <div className={Styles.contentHero}>
                    <h3>{t('stepsHeading')}</h3>
                    <p>{t('stepsIntro')}</p>

                    <div className={Styles.stepsContent}>
                        {STEPS.map((step, index) => (
                            <div className={Styles.stepsCard} key={step}>
                                <h3 className={Styles.stepHeader}>
                                    <div className={Styles.stepCircle}>
                                        <p>{index + 1}</p>
                                    </div>
                                    {t(`steps.${step}.title`)}
                                </h3>
                                <p>
                                    {step === 'signup'
                                        ? t.rich('steps.signup.body', {
                                            link: (chunks) => <Link href={'/aanmelden'}>{chunks}</Link>,
                                        })
                                        : t(`steps.${step}.body`)}
                                </p>
                            </div>
                        ))}
                    </div>

                </div>

            </div>

        </main>
    );
}
