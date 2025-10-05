'use client';
import Image from "next/image";
import Styles from "./casting.module.scss";
import { WalkedoButton } from "../../../components/button/button";
import Link from "next/link";
import { Gallery } from "react-grid-gallery";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import React from "react";

export default function Page() {

    const imagePadding = 40;

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
            slidesToSlide: 3 // optional, default to 1.
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
            slidesToSlide: 2 // optional, default to 1.
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1 // optional, default to 1.
        }
    };

    const redRidingHoodCredits  = () => {
        return (
            <div className={Styles.expoWrapper}>
                <h4 className={Styles.expoTitle}>Roodkapje, 2025</h4>
                <div className={Styles.expoArtistRow}>
                    <p className={Styles.expoArtist}>Artiest: <a target={'_blank'} href={''}>José ter Haar</a></p>
                    <p className={Styles.expoArtist}>Fotograaf: <a target={'_blank'} href={''}>Camera Gijs</a></p>
                    <p className={Styles.expoArtist}>Model: <a target={'_blank'} href={'https://www.instagram.com/suzevantende'}>Suze van ‘t Ende</a> & <a href={'/northern-Inuit-dog'}>Koda</a></p>
                </div>
            </div>
        )
    }

    return (
        <main>
            <div className={Styles.heroImage}>
                <Image sizes='max-width: 100vw' className={Styles.heroImageInner} fill={true}
                       objectPosition={'50% 50%'}
                       alt={'De set van een film productie'}
                       src={'/images/casting/film-productie.jpg'}/>
            </div>

            <div className={'container'}>

                <div className={Styles.heroIntroBlock}>
                    <h1 className={Styles.header}>Casting</h1>
                    <h2 className={Styles.subHeader}>Licht, Camera, Walkedo!</h2>
                    <p>
                        Heb je een hond nodig met het uiterlijk van een wolf voor je productie, film, muziekvideo, foto of marketing campagne? Walkedo kan je helpen met de Northern Inuit Dog.
                        Deze honden hebben een hele aantrekkelijke look omdat ze op een wolf lijken. Zo zijn ze ook gebruikt bij de productie van de TV Series Game Of Thrones.
                    </p>
                    <p>
                        De Northern Inuit Dog is goed getraind en zijn ideaal voor
                        producties waarbij je een fantasy of middeleeuwse richting op wilt. Ze hebben een lief karakter en kunnen dit ook uitstralen, maar indien nodig kunnen ze ook vijandig en scherp uit de ogen kijken.
                        De honden zijn ongeveer 60cm schofthoogte en heel snel en dynamisch voor actie gedreven scenes.
                    </p>
                    <Link href={'/aanmelden?service=casting'} className={Styles.signupBtn}>
                        <WalkedoButton fullWidth={true} label={'Contact opnemen'} />
                    </Link>
                </div>
            </div>
            <div className={Styles.carouselBanner}>
                    {redRidingHoodCredits()}
                <Carousel
                    swipeable={true}
                    draggable={true}
                    showDots={false}
                    responsive={responsive}
                    ssr={true} // means to render carousel on server-side.
                    infinite={true}
                    autoPlay={true}
                    autoPlaySpeed={7000}
                    keyBoardControl={true}
                    pauseOnHover={true}
                    customTransition="all 3s"
                    transitionDuration={3000}
                    containerClass="carousel-container"
                    removeArrowOnDeviceType={["tablet", "mobile"]}
                    dotListClass="custom-dot-list-style"
                    itemClass="carousel-item-padding-40-px"
                >
                    {/*<div className={Styles.carouselImage}>*/}
                    {/*    <Image src={'/images/casting/roodkapje-koda-portret.jpg'} height={(2040 / 2) - imagePadding} width={(1457 / 2) - imagePadding} alt={'Roodkapje met koda als wolf'} />*/}
                    {/*</div>*/}
                    <div className={Styles.carouselImage}>
                        <Image src={'/images/casting/koda-wolf-casting-walk.jpg'} height={(2040 / 2) - imagePadding} width={(1360 / 2) - imagePadding} alt={'Wolf uiterlijk voor casting, lopend door het bos'} />
                    </div>
                    <div className={Styles.carouselImage}>
                        <div className={Styles.carouselImage}>
                            <Image src={'/images/casting/koda-northerninuit-highfive hond-3.jpg'} height={(2040 / 2) - imagePadding} width={(1578 / 2) - imagePadding} alt={'Wolf achteraanzicht weglopend samen met roodkapje'} />
                        </div>
                    </div>
                    <div className={Styles.carouselImage}>
                        <Image src={'/images/casting/koda-portret-wegkijkend.jpg'} height={(2040 / 2) - imagePadding} width={(1360 / 2) - imagePadding} alt={'Wolf uiterlijk voor casting, wegkijkend van de camera'} />
                    </div>
                    <div className={Styles.carouselImage}>
                        <Image src={'/images/casting/roodkapje-koda-samensmelting.jpg'} height={(2040 / 2) - imagePadding} width={(1359 / 2) - imagePadding} alt={'Wolf uiterlijk samen met roodkapje'} />
                    </div>

                    {/*<div className={Styles.carouselImage}>*/}
                    {/*    <Image src={'/images/casting/wolf-roodkapje-weglopend-casting.jpg'} height={(2040 / 2) - imagePadding} width={(1457 / 2) - imagePadding} alt={'Wolf achteraanzicht weglopend samen met roodkapje'} />*/}
                    {/*</div>*/}
                    <div className={Styles.carouselImage}>
                        <Image src={'/images/casting/northern-inuit-wolf-casting-solo-portret.jpg'} height={(2040 / 2) - imagePadding} width={(1360 / 2) - imagePadding} alt={'Northern Inuit dog die als wolf poseert in het bos'} />
                    </div>
                </Carousel>;
            </div>
            {/*<Gallery enableImageSelection={false} images={images}/>*/}
        </main>
    );
}
