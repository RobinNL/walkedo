'use client'

import Image from "next/image";
import Styles from "./page.module.scss";
import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Home() {
    const t = useTranslations('home');

    return (
        <div>
            <div className={Styles.heroImage}>
                {/*
                  * The poster is referenced through the `poster` attribute, which
                  * never passes through the Next image optimizer — so it points at
                  * a pre-sized file rather than the 2.3 MB original.
                  *
                  * preload="metadata" rather than "auto": the browser fetches
                  * enough to size the element and then streams on play, instead of
                  * pulling the whole file before first paint.
                  */}
                <video playsInline={true}
                       poster={'/images/walking-dogs-hero-poster.jpg'}
                       className={Styles.heroVideo} controls={false} controlsList={"nodownload"} loop={true}
                       muted={true} preload="metadata" autoPlay={true}>
                    <source src="/videos/walkedo-intro.mp4" type="video/mp4"/>
                </video>
            </div>
            <div className={Styles.heroSignupBtn}>
                <div className={Styles.heroSignupInner}>
                    <h2 className={Styles.heroSignupTitle}>{t('heroTitle')}</h2>
                    <p className={Styles.heroSignupDescription}>{t('heroDescription')}</p>
                    <div className={Styles.heroSignupIconWrapper}>
                        <Image className={Styles.heroSignupIconIcon} alt={t('scrollAlt')}
                               src={'/fonts/icons/chevron-down.svg'} width={30} height={30}/>
                        <Image className={`${Styles.heroSignupIconIcon} ${Styles.heroSignupIconIconBottom}`}
                               alt={t('scrollAlt')}
                               src={'/fonts/icons/chevron-down.svg'} width={30} height={30}/>
                    </div>
                </div>
            </div>
            <div className={Styles.pageContainer}>
                <div className={Styles.container}>

                    <h1 className={Styles.indexHeader}>{t('title')}</h1>

                    <h3 className={Styles.indexDescriptionWrapper}>{t('intro')}</h3>

                </div>

                <div className={Styles.container}>
                    <div className={Styles.serviceSection}>
                        <div className={Styles.serviceTextSection}>
                            <div className={Styles.indexServiceDescription}>
                                <h2 className={Styles.serviceHeader}>{t('uitlaatservice.heading')}</h2>
                                <h3>{t('uitlaatservice.subheading')}</h3>

                                <p>{t('uitlaatservice.body')}</p>
                                <Link className={Styles.learnMoreLink} href={'/uitlaatservice'}>
                                    <span className={Styles.learnMoreLinkText}>
                                        {t('uitlaatservice.cta')}
                                    </span>
                                    <Image alt={t('arrowAlt')} className={Styles.learnMoreLinkIcon}
                                           src={'/fonts/icons/arrow-right.svg'} height={20} width={20}/>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={Styles.serviceSectionImageRow}>
                    <div className={Styles.serviceSectionImage}>
                        <Image objectFit={'cover'} fill={true}
                               src={'/images/uitlaatservice/uitlaatservice-arnhem.jpeg'}
                               alt={t('uitlaatservice.imageAlt')}/>
                    </div>
                    <div className={Styles.serviceSectionImage}>
                        <Image objectFit={'cover'} fill={true}
                               src={'/images/uitlaatservice/uitlaatservice-arnhem-2.jpeg'}
                               alt={t('uitlaatservice.imageAlt')} className={Styles.serviceSectionImage}/>
                    </div>
                    <div className={Styles.serviceSectionImage}>
                        <Image objectFit={'cover'} fill={true}
                               src={'/images/uitlaatservice/uitlaatservice-arnhem-3.jpeg'}
                               alt={t('uitlaatservice.imageAlt')} className={Styles.serviceSectionImage}/>
                    </div>
                </div>

                <div className={Styles.container}>
                    <div className={Styles.serviceSection}>
                        <div className={Styles.serviceTextSection}>
                            <div className={Styles.indexServiceDescription}>
                                <h2 className={Styles.serviceHeader}>{t('opvang.heading')}</h2>
                                <h3>{t('opvang.subheading')}</h3>

                                <p className={Styles.serviceTextBlock}>{t('opvang.body')}</p>
                                <Link className={Styles.learnMoreLink} href={'/opvang'}>
                                     <span className={Styles.learnMoreLinkText}>
                                        {t('opvang.cta')}
                                    </span>
                                    <Image className={Styles.learnMoreLinkIcon} src={'/fonts/icons/arrow-right.svg'}
                                           alt={t('arrowAlt')} height={20} width={20}/>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={Styles.serviceSectionImageRow}>
                    <div className={Styles.serviceSectionImage}>
                        <Image objectFit={'cover'} fill={true}
                               src={'/images/opvang/opvang-1.jpeg'}
                               alt={t('opvang.imageAlt')}/>
                    </div>
                    <div className={Styles.serviceSectionImage}>
                        <Image objectFit={'cover'} fill={true}
                               src={'/images/opvang/opvang-2.jpeg'}
                               alt={t('opvang.imageAlt')} className={Styles.serviceSectionImage}/>
                    </div>
                    <div className={Styles.serviceSectionImage}>
                        <Image objectFit={'cover'} fill={true}
                               src={'/images/opvang/opvang-3.jpeg'}
                               alt={t('opvang.imageAlt')} className={Styles.serviceSectionImage}/>
                    </div>
                </div>

                <div className={Styles.container}>
                    <div className={Styles.serviceSection}>
                        <div className={Styles.serviceTextSection}>
                            <div className={Styles.indexServiceDescription}>
                                <h2 className={Styles.serviceHeader}>{t('northernInuit.heading')}</h2>
                                <h3>{t('northernInuit.subheading')}</h3>

                                <p className={Styles.serviceTextBlock}>{t('northernInuit.body')}</p>
                                <Link className={Styles.learnMoreLink} href={'/northern-Inuit-dog'}>
                                     <span className={Styles.learnMoreLinkText}>
                                        {t('northernInuit.cta')}
                                    </span>
                                    <Image className={Styles.learnMoreLinkIcon} src={'/fonts/icons/arrow-right.svg'}
                                           alt={t('arrowAlt')} height={20} width={20}/>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>


                <div className={Styles.container}>
                    <div className={Styles.serviceSection}>
                        <div className={Styles.serviceTextSection}>
                            <div className={Styles.indexServiceDescription}>
                                <h2 className={Styles.serviceHeader}>{t('casting.heading')}</h2>
                                <h3>{t('casting.subheading')}</h3>

                                <p className={Styles.serviceTextBlock}>{t('casting.body')}</p>
                                <Link className={Styles.learnMoreLink} href={'/casting'}>
                                    <span className={Styles.learnMoreLinkText}>
                                        {t('casting.cta')}
                                    </span>
                                    <Image className={Styles.learnMoreLinkIcon} src={'/fonts/icons/arrow-right.svg'}
                                           alt={t('arrowAlt')} height={20} width={20}/>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={Styles.castingImageBackdrop}>
                <div className={Styles.northernInuitDogImage}>
                    <Image objectFit={'fit'} fill={true}
                           src={'/images/casting/koda-casting-highfive.jpg'}
                           alt={t('castingImageAlt')}/>
                </div>
            </div>
            <p className={Styles.expoLink}>
                {t.rich('expo', {
                    link: (chunks) => <Link href={'/casting'}>{chunks}</Link>,
                })}
            </p>

        </div>
    );
}
