'use client'

import Image from "next/image";
import Styles from "./page.module.scss";
import { useRouter } from "next/navigation";
import React from "react";
import Link from "next/link";

export default function Home() {

    const router = useRouter();

    return (
        <div>
            <div className={Styles.heroImage}>
                <Image sizes='max-width: 100vw' className={Styles.heroImageInner} fill={true} src={'/images/walking-dogs-hero.jpg'} />
            </div>
            <div className={Styles.pageContainer}>
                <div className={Styles.container}>

                    <h1 className={Styles.indexHeader}>Hondenservices in Arnhem noord</h1>

                    <p className={Styles.indexTextWrap}>Walkedo is een hondenuitlaatservice, kennel en meer op een
                        adres. Een contactpunt met
                        persoonlijke aandacht voor je hond. Zo loopt je hond in kleine groepen,
                        en is er regelmatig plek voor (langdurige) opvang van je hond als je zelf op vakantie
                        gaat.
                        Ontdek onze services en neem vrijblijvend contact op voor een kennismakingsgesprek.
                    </p>

                </div>

                <div className={Styles.container}>

                    <div className={Styles.serviceSection}>

                        <div className={Styles.serviceTextSection}>
                            <h3>Uitlaten</h3>

                            <p className={Styles.serviceTextBlock}>Laat je hond een of meerdere malen per week door mij ophalen. We lopen een uur met een
                                groep
                                van maximaal 6 andere honden die goed bij je eigen hond past.
                                Na de wandeling breng ik je hond weer terug. Een uitlaatservice geeft je hond kans om
                                lekker
                                te spelen.</p>
                            <Link className={Styles.learnMoreLink} href={'/uitlaatservice'}>Ontdek de Uitlaatservice</Link>
                        </div>
                    </div>

                    <div className={Styles.serviceSection}>

                        <div className={Styles.serviceTextSection}>
                            <h3>Northern Inuit Dog</h3>

                            <p className={Styles.serviceTextBlock}>Dit unieke ras is bij Walkedo als eerste in Nederland. Ik verwacht een groep pups te
                                hebben in de toekomst. Leer dit unieke ras kennen en schrijf je vrijblijvend in voor de
                                wachtlijst. Zodra het concreet wordt heb je dan als eerste de kans om een plekje te
                                reserveren en eigenaar te worden van een beste vriend uit dit unieke ras!</p>
                            <Link className={Styles.learnMoreLink} href={'/northern-inuit-dog'}>Ontdek de Northern Inuit Dog</Link>
                        </div>
                    </div>

                    <div className={Styles.serviceSection}>

                        <div className={Styles.serviceTextSection}>
                            <h3>Opvang</h3>

                            <p className={Styles.serviceTextBlock}>Iedereen gaat wel eens op vakantie of is een hele dag weg voor het werk. Klanten van Walkedo kunnen gebruik maken van de dagopvang en
                            hun honden lekker laten spelen en rasen in een kennel van 25 vierkantemeters. De honden van de dagopvang gaan automatisch mee met de uitlaatservice. Meld je vandaag nog aan voor een gezellige kennismaking!</p>
                            <Link className={Styles.learnMoreLink} href={'/opvang'}>Ontdek opvang</Link>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
