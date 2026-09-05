'use client';
import Image from "next/image";
import Styles from "./casting.module.scss";
import { WalkedoButton } from "../../../../components/button/button";
import { Carousel } from "../../../../components/carousel/carousel";
import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const CAROUSEL_IMAGES = [
    { src: '/images/casting/koda-wolf-casting-walk.jpg', key: 'walk' },
    { src: '/images/casting/koda-northerninuit-highfive hond-3.jpg', key: 'highfive' },
    { src: '/images/casting/koda-portret-wegkijkend.jpg', key: 'portrait' },
    { src: '/images/casting/roodkapje-koda-samensmelting.jpg', key: 'together' },
    { src: '/images/casting/northern-inuit-wolf-casting-solo-portret.jpg', key: 'solo' },
];

export default function Page() {
    const t = useTranslations('casting');


    return (
        <main>
            <div className={Styles.heroImage}>
                <Image priority sizes='100vw' className={Styles.heroImageInner} fill={true}
                       objectPosition={'50% 50%'}
                       alt={t('heroAlt')}
                       src={'/images/casting/film-productie.jpg'}/>
            </div>

            <div className={'container'}>

                <div className={Styles.heroIntroBlock}>
                    <h1 className={Styles.header}>{t('title')}</h1>
                    <h2 className={Styles.subHeader}>{t('subtitle')}</h2>
                    <p>{t('body1')}</p>
                    <p>{t('body2')}</p>
                    <Link href={'/aanmelden?service=casting'} className={Styles.signupBtn}>
                        <WalkedoButton fullWidth={true} label={t('cta')}/>
                    </Link>
                </div>
            </div>
            <div className={Styles.carouselBanner}>
                <div className={Styles.expoWrapper}>
                    <h4 className={Styles.expoTitle}>{t('expoTitle')}</h4>
                    <div className={Styles.expoArtistRow}>
                        <p className={Styles.expoArtist}>{t('artist')}: <a target={'_blank'}
                                                                           rel={'noopener noreferrer'}
                                                                           href={'https://www.instagram.com/jose_ter_haar'}>José
                            ter Haar</a></p>
                        <p className={Styles.expoArtist}>{t('photographer')}: <a target={'_blank'}
                                                                                 rel={'noopener noreferrer'}
                                                                                 href={'https://www.instagram.com/cameragijs'}>Camera
                            Gijs</a></p>
                        <p className={Styles.expoArtist}>{t('model')}: <a target={'_blank'}
                                                                          rel={'noopener noreferrer'}
                                                                          href={'https://www.instagram.com/suzevantende'}>Suze
                            van ‘t Ende</a> & <Link href={'/northern-Inuit-dog'}>Koda</Link></p>
                    </div>
                </div>
                <Carousel
                    autoPlaySpeed={7000}
                    label={t('carouselLabel')}
                    previousLabel={t('carouselPrevious')}
                    nextLabel={t('carouselNext')}
                    slides={CAROUSEL_IMAGES.map((image) => ({
                        key: image.key,
                        node: (
                            <div className={Styles.carouselImage}>
                                <Image src={image.src} fill={true}
                                       sizes={'(min-width: 1024px) 33vw, (min-width: 600px) 50vw, 100vw'}
                                       alt={t(`carouselAlt.${image.key}`)}/>
                            </div>
                        ),
                    }))}
                />
            </div>
        </main>
    );
}
