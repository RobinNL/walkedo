'use client';

import Image from "next/image";
import Styles from "./uitlaatservice.module.scss";
import { useRouter } from "next/navigation";
import { WalkedoButton } from "../../../components/button/button";
import Link from "next/link";
import { Gallery } from "react-grid-gallery";

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
            <div className={Styles.heroImage}>
                <Image sizes='max-width: 100vw' className={Styles.heroImageInner} fill={true}
                       alt={'honden in arnhem'}
                       src={'/images/honden-uitgelaten-in-arnhem-noord.jpg'}/>
            </div>

            <div className={'container'}>

                <div className={Styles.heroIntroBlock}>
                    <h1 className={Styles.header}>Honden uitlaatservice</h1>

                    <p>Voor een vast bedrag per wandeling loop ik een of meerdere keren met je hond in een van de leuke
                        Walkedo groepen. We reserveren van tevoren
                        vaste tijdslots zodat je zeker weet wanneer je hond wordt opgehaald. Minder zorgen voor jou en
                        een blije hond die thuis op je wacht of je weer
                        thuis begroet. Ontdek alle voordelen van onze uitlaatservice.</p>
                </div>

                <div className={Styles.contentRow}>

                    <div className={Styles.contentBlock}>
                        <h3>Alle voordelen op een rijtje</h3>
                        <p>Walkedo is een exclusieve hondenuitlaatservice. Wij hanteren kleinere groepen dan de meeste
                            partijen zodat je hond minder lang in de auto zit en meer persoonlijke aandacht krijgt
                            tijdens de wandeling. Ontdek alle voordelen van de Walkedo hondenuitlaatservice.</p>
                        <ul className={Styles.benefitList}>
                            <li>
                                <Image src={'/images/dog-paw.svg'} className={Styles.benefitListIcon}
                                       alt={'honden poot'} width={20} height={20}/>
                                Kleine groepen van 6 tot 8 honden
                            </li>
                            <li>
                                <Image src={'/images/dog-paw.svg'} className={Styles.benefitListIcon}
                                       alt={'honden poot'} width={20} height={20}/>
                                Korte reistijden omdat ik enkel loop in Arnhem en zorgvuldig de groepen samenstel
                            </li>
                            <li>
                                <Image src={'/images/dog-paw.svg'} className={Styles.benefitListIcon}
                                       alt={'honden poot'} width={20} height={20}/>
                                Speciale puppy groep
                            </li>
                            <li>
                                <Image src={'/images/dog-paw.svg'} className={Styles.benefitListIcon}
                                       alt={'honden poot'} width={20} height={20}/>
                                Vaste tijdslots en groepen
                            </li>
                            <li>
                                <Image src={'/images/dog-paw.svg'} className={Styles.benefitListIcon}
                                       alt={'honden poot'} width={20} height={20}/>
                                Extra services zoals opvang als je op vakantie gaat
                            </li>
                        </ul>
                    </div>

                    <div className={Styles.arnhemMapBlock}>
                        <h3>Arnhem, de natuurgebieden waar ik graag kom</h3>
                        <p>Samen met de groep van Walkedo heb ik de mooiste plekken van Arnhem ontdekt!</p>
                        <Image width={624 / 2} height={516 / 2} src={'/images/arnhem-map.svg'}
                               alt={'kaart van Arnhem'}/>
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
                                wandeling aan beide kanten goed klikt dan kan je
                                een strippenkaart aanschaffen en kunnen we een sleutelcontract opstellen.
                            </p>

                        </div>

                        <div className={Styles.stepsCard}>

                            <h3 className={Styles.stepHeader}>
                                <div className={Styles.stepCircle}>
                                    <p>4</p>
                                </div>
                                Strippenkaart
                            </h3>

                            <p>Vanaf dit moment is je hond een vast onderdeel van de groep! Welkom :)
                                Bij elke wandeling streep ik een wandeling af van de strippenkaart (kosten: 15,- per
                                wandeling). Je hoeft niet thuis te zijn om mij of de hond weer in ontvangst te nemen.
                                Zodra de strippenkaart is verlopen ontvang je een factuur voor de volgende
                                strippenkaart.
                            </p>

                        </div>
                    </div>

                </div>

            </div>

        </main>
    );
}
