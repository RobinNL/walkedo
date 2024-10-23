'use client';
import Image from "next/image";
import Styles from "./casting.module.scss";
import { WalkedoButton } from "../../../components/button/button";
import Link from "next/link";
import { Gallery } from "react-grid-gallery";
import React from "react";

export default function Page() {

    const images = [
        {
            src: 'images/casting/koda-1.jpeg',
            width: 1024,
            alt: 'Northern Inuit dog die rond kijkt in het bos',
            height: 768
        },
        {
            src: 'images/casting/koda-2.jpeg',
            width: 1080,
            alt: 'Wolf achtige hond in de sneeuw',
            height: 1440
        },
        {
            src: 'images/casting/koda-3.jpeg',
            width: 1080,
            alt: 'Northern inuit dog die zit en naar de camera kijkt in het bos',
            height: 1363
        },
        {
            src: 'images/casting/koda-4.jpeg',
            width: 1980,
            alt: 'Northern Inuit dog in het gras liggend',
            height: 1492
        },
        {
            src: 'images/casting/koda-5.jpeg',
            width: 1080,
            alt: 'Lieve uitstraling van een hond op de bank',
            height: 810
        },
        {
            src: 'images/casting/koda-6.jpeg',
            width: 1080,
            alt: 'Hond in de laag hangende zon bij het strand',
            height: 810
        },
        {
            src: 'images/casting/koda-7.jpeg',
            width: 1080,
            alt: 'Hond in het gras',
            height: 1440
        },
        {
            src: 'images/casting/koda-8.jpeg',
            width: 1080,
            alt: 'Glimlachende hond die in de camera kijkt',
            height: 1440
        },
        {
            src: 'images/casting/koda-9.jpeg',
            width: 1080,
            alt: 'Hond die knijpt met de ogen door de zon',
            height: 1440
        },
        {
            src: 'images/casting/koda-10.jpeg',
            width: 1080,
            alt: 'Rennende hond met hoge poten',
            height: 810
        },
        {
            src: 'images/casting/koda-11.jpeg',
            width: 1920,
            alt: 'Puppy Northern Inuit Dog',
            height: 2560
        },
        {
            src: 'images/casting/koda-12.jpeg',
            width: 1920,
            alt: 'honden rennen en spelen op een veld in arnhem',
            height: 1436
        },
        {
            src: 'images/casting/koda-13.jpeg',
            width: 1920,
            alt: 'Wolf hond die omlaag kijkt',
            height: 1440
        },
        {
            src: 'images/casting/koda-14.jpeg',
            width: 1920,
            alt: 'Hond die in de camera kijkt',
            height: 1440
        },
        {
            src: 'images/casting/koda-15.jpeg',
            width: 1440,
            alt: 'Honden die met elkaar spelen',
            height: 1080
        },
        {
            src: 'images/casting/koda-16.jpeg',
            width: 836,
            alt: 'Hond die omhoog kijkt met bal',
            height: 1080
        },
        {
            src: 'images/casting/koda-17.jpeg',
            width: 810,
            alt: 'Hond in de schaduw met laag hangende zon',
            height: 1080
        }
    ]

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
                        Deze honden hebben een hele aantrekkelijke look omdat ze op een wolf lijken. Zo zijn ze ook gebruikt bij de productie Game Of Thrones.
                    </p>
                    <p>
                        De Northern Inuit Dog is goed getraind en zijn ideal voor
                        producties waarbij je een fantasy richting op wilt. Ze hebben een lief karakter en kunnen dit ook uitstralen, maar indien nodig kunnen ze ook vijandig en scherp uit de ogen kijken.
                        De honden zijn ongeveer 60cm schofthoogte en heel snel en dynamisch voor actie gedreven scenes.
                    </p>
                    <Link href={'/aanmelden?service=casting'} className={Styles.signupBtn}>
                        <WalkedoButton fullWidth={true} label={'Contact opnemen'} />
                    </Link>
                </div>
                {/*<div className={Styles.heroIntroBlock}>*/}
                {/*    <h3>Northern Inuit Dog</h3>*/}
                {/*    <p>Koda is een Northern Inuit Dog die heel geschikt is voor allerlei soorten producties. Ze is heel*/}
                {/*        fotogeniek. Neem voor*/}
                {/*        referentiemateriaal van andere honden contact met mij op.</p>*/}
                {/*</div>*/}
            </div>
            <Gallery enableImageSelection={false} images={images}/>
        </main>
    );
}
