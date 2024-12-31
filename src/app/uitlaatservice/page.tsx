'use client';

import Image from "next/image";
import Styles from "./uitlaatservice.module.scss";
import Link from "next/link";
import { Gallery } from "react-grid-gallery";
import React from "react";
import Head from "next/head";
import { formatHTMLTitle } from "@/app/shared/page-seo-title";
import { WalkedoList } from "../../../components/list/list";

export default function Page() {

    const images = [
        {
            src: 'images/uitlaatservice/honden-1.png',
            width: 1826,
            alt: 'honden rennen en spelen op een veld in arnhem',
            height: 1645
        },
        {
            src: 'images/uitlaatservice/honden-2.png',
            width: 1452,
            alt: 'honden rennen en spelen op een veld in arnhem',
            height: 1816
        },
        {
            src: 'images/uitlaatservice/honden-3.png',
            width: 1454,
            alt: 'honden rennen en spelen op een veld in arnhem',
            height: 1822
        },
        {
            src: 'images/uitlaatservice/honden-4.png',
            width: 1820,
            alt: 'honden rennen en spelen op een veld in arnhem',
            height: 1360
        },
        {
            src: 'images/uitlaatservice/honden-5.png',
            width: 1457,
            alt: 'honden rennen en spelen op een veld in arnhem',
            height: 1820
        },
        {
            src: '/images/uitlaatservice/honden-6.png',
            width: 1817,
            alt: 'honden rennen en spelen op een veld in arnhem',
            height: 1025
        },
        {
            src: '/images/uitlaatservice/honden-7.png',
            width: 1455,
            alt: 'honden rennen en spelen op een veld in arnhem',
            height: 1817
        },
        {
            src: '/images/uitlaatservice/honden-8.png',
            width: 1456,
            alt: 'honden rennen en spelen op een veld in arnhem',
            height: 1817
        },
        {
            src: '/images/uitlaatservice/honden-9.png',
            width: 1811,
            alt: 'honden rennen en spelen op een veld in arnhem',
            height: 1024
        },
        {
            src: '/images/uitlaatservice/honden-10.png',
            width: 1818,
            alt: 'honden rennen en spelen op een veld in arnhem',
            height: 1366
        }
    ]

    return (
        <main>
            <Head>
                <title>{formatHTMLTitle({ title: 'Uitlaatservice Arnhem Noord' })}</title>
            </Head>
            <div className={Styles.heroImage}>
                <Image sizes='max-width: 100vw' className={Styles.heroImageInner} fill={true}
                       alt={'honden in arnhem'}
                       src={'/images/uitlaatservice/walkedo-uitlaatservice.jpg'}/>
            </div>

            <div className={'container'}>

                <div className={Styles.heroIntroBlock}>
                    <h1 className={Styles.header}>Honden uitlaatservice</h1>

                    <p>Al vanaf 13,50 per week loop ik èèn of meerdere keren met je hond in een van
                        de leuke Walkedo groepen. We reserveren van tevoren vaste tijdslots zodat je zeker weet wanneer
                        je hond wordt opgehaald. Minder zorgen voor jou en een blije hond die thuis op je wacht of je
                        thuis weer begroet. Ontdek alle voordelen van de uitlaatservice.
                    </p>
                </div>

                <div className={Styles.contentRow}>

                    <div className={Styles.contentBlock}>
                        <h3>Alle voordelen op een rijtje</h3>
                        <p>Walkedo is een exclusieve hondenuitlaatservice. Wij hanteren kleinere groepen dan de meeste
                            partijen zodat je hond minder lang in de auto zit en meer persoonlijke aandacht krijgt
                            tijdens de wandeling. Ontdek alle voordelen van de Walkedo hondenuitlaatservice.</p>
                        <WalkedoList items={[
                            'Kleine groepen van 6 tot 8 honden',
                            'Korte reistijden',
                            'Speciale puppygroepen',
                            'Zorgvuldig samengestelde groepen waaronder de walkedoodle',
                            'Extra services zoals opvang als je op vakantie gaat'
                        ]}/>
                    </div>

                    <div className={Styles.arnhemMapBlock}>
                        <h3>Arnhem, de natuurgebieden waar ik graag kom</h3>
                        <p>Samen met de groep van Walkedo heb ik de mooiste plekken van Arnhem ontdekt!</p>
                        <Image width={624 / 2} height={516 / 2} src={'/images/arnhem-map.svg'}
                               alt={'kaart van Arnhem'}/>
                    </div>

                </div>

                <div className={Styles.contentHero}>

                    <div className={Styles.contentBlock}>
                        <h3>Eenvoudig en betrouwbaar</h3>
                        <p>Walkedo werkt met overzichtelijke abonnementen op basis van het aantal wandelingen. Zo hoef je niet te letten op spradische facturen of strippenkaarten die wel of niet zijn verlopen.
                            De maandbedragen zijn berekend met een voordeel van zes weken. Hoe dit werkt lees je hier: <a href={'/berichten/introductie-abonnementen'}>uitleg abonnementen</a> </p>
                    </div>
                        <div className={Styles.subscriptionRow}>
                            <div className={Styles.subscriptionBlock}>
                                <h3>€51,75</h3>
                                <p>1x p/w</p>
                            </div>
                            <div className={Styles.subscriptionBlock}>
                                <h3>€103,50</h3>
                                <p>2x p/w</p>
                            </div>
                            <div className={Styles.subscriptionBlock}>
                                <h3>€155,25</h3>
                                <p>3x p/w</p>
                            </div>
                            <div className={Styles.subscriptionBlock}>
                                <h3>€207,00</h3>
                                <p>4x p/w</p>
                            </div>
                            <div className={Styles.subscriptionBlock}>
                                <h3>€257,75</h3>
                                <p>5x p/w</p>
                            </div>
                    </div>
                    <div className={Styles.calendarLink}>
                        <Image src={'/images/calendar.svg'} className={Styles.calendarIcon}
                               alt={'kalender'} width={20} height={20}/>
                        <a href={'/berichten/vrije-dagen-2025'} className={Styles.calendarLink}>Overzicht vrije dagen van 2025</a>
                    </div>
                </div>

                <div className={Styles.contentHero}>
                    <h3>Kom je lekker met ons wandelen?</h3>

                    <Gallery enableImageSelection={false} images={images}/>
                </div>


                <div className={Styles.contentHero}>
                    <h3>De eerste stappen</h3>
                    <p>
                        Je hond kan al eerder mee dan je misschien denkt. Binnen vier kleine stappen ben je al lid.
                    </p>

                    <div className={Styles.stepsContent}>
                        <div className={Styles.stepsCard}>

                            <h3 className={Styles.stepHeader}>
                                <div className={Styles.stepCircle}>
                                    <p>1</p>
                                </div>
                                Aanmelden
                            </h3>

                            <p>Neem contact met mij op via het <Link href={'/aanmelden'}>aanmeldformulier</Link>.
                                Schrijf
                                een kort bericht over je honden zodat ik
                                een indruk krijg van het type hond en in welke groepen hij of zij goed zou passen.
                            </p>

                        </div>

                        <div className={Styles.stepsCard}>

                            <h3 className={Styles.stepHeader}>
                                <div className={Styles.stepCircle}>
                                    <p>2</p>
                                </div>
                                Kennis maken
                            </h3>
                            <p>Ik zal je bellen of mailen naar aanleiding van je aanmelding om een gratis vrijblijvende
                                kennismaking met je in te plannen.
                                Dit gebeurd bij jouw thuis. Ik leer graag je hond een beetje beter kennen en tijdens dit
                                gesprek kunnen we samen kijken
                                wanneer en hoe vaak de hond mee kan met de groep.
                            </p>

                        </div>

                        <div className={Styles.stepsCard}>

                            <h3 className={Styles.stepHeader}>
                                <div className={Styles.stepCircle}>
                                    <p>3</p>
                                </div>
                                Proef wandeling
                            </h3>

                            <p>De eerste wandeling is voor de hond misschien een beetje spannend. Ik neem je hond mee
                                voor
                                een proefwandeling zodat we samen alvast
                                een band kunnen opbouwen. Deze wandeling kost een klein eenmalig bedrag. Als het na de
                                wandeling aan beide kanten goed klikt dan kan je lid worden en kunnen we een
                                sleutelcontract opstellen.
                            </p>

                        </div>

                        <div className={Styles.stepsCard}>

                            <h3 className={Styles.stepHeader}>
                                <div className={Styles.stepCircle}>
                                    <p>4</p>
                                </div>
                                Abonnement
                            </h3>

                            <p>Vanaf dit moment is je hond een vast onderdeel van de groep! Aan het begin van de maand
                                zal er een vast bedrag afgeschreven worden afhankelijk
                                van het aantal wandelingen per maand.
                            </p>

                        </div>
                    </div>

                </div>

            </div>

        </main>
    );
}
