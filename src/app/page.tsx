'use client'

import Image from "next/image";
import Styles from "./page.module.scss";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import Link from "next/link";
import { WalkedoButton } from "../../components/button/button";

export default function Home() {

    const width = useRef(window.innerWidth);

    console.log(width);

    const router = useRouter();

    return (
        <div>
            <div className={Styles.heroImage} style={{height: width.current > 1920 ? 1080 : width.current * 0.5625 + 'px'}}>
                <video width={width.current > 1920 ? '1920px' : width.current + 'px'} height={(width.current > 1920 ? '1080px' : width.current * 0.5625) + 'px'}
                       className={Styles.heroVideo} controls={false} controlsList={"nodownload"} loop={true}
                       muted={true} preload="auto" autoPlay={true}>
                    <source src="/videos/walkedo-introduction.mp4" type="video/mp4"/>
                    <Image sizes='max-width: 100vw' className={Styles.heroImageInner} fill={true}
                           src={'/images/walking-dogs-hero.jpg'}/>
                </video>
            </div>
            <div className={Styles.heroSignupBtn}>
                <div className={Styles.heroSignupInner}>
                    <h2 className={Styles.heroSignupTitle}>Met hart voor je hond</h2>
                    <p className={Styles.heroSignupDescription}>Laat je viervoeter de mooiste plekjes van Arnhem ontdekken met een groep waar je hond zich helemaal thuis
                        voelt. En ga met een gerusthart op vakantie met de opvangservice.</p>
                    <div className={Styles.heroSignupInnerBtn}>
                        <WalkedoButton label={'Aanmelden'} disabled={false}/>
                    </div>
                </div>
            </div>
            <div className={Styles.pageContainer}>
                <div className={Styles.container}>

                    <h1 className={Styles.indexHeader}>Hondenservices in Arnhem noord</h1>

                    <p className={Styles.indexTextWrap}>Walkedo is een hondenuitlaatservice, kennel en meer op een
                        adres. Een contactpunt met
                        persoonlijke aandacht voor je hond. Zo loopt je hond in kleine groepen,
                        en is er regelmatig plek voor (langdurige) opvang van je hond als je op vakantie
                        gaat. Ontdek onze services en neem vrijblijvend contact op voor een kennismakingsgesprek.
                        Ik leer je hond graag beter kennen.
                    </p>

                </div>

                <div className={Styles.container}>

                    <div className={Styles.serviceSection}>

                        <div className={Styles.serviceTextSection}>
                            <h3>Uitlaten</h3>

                            <p className={Styles.serviceTextBlock}>Laat je hond een of meerdere malen per week door
                                mij ophalen. We lopen een uur met een
                                groep
                                van maximaal 6 andere honden die goed bij je eigen hond past.
                                Na de wandeling breng ik je hond weer terug. Een uitlaatservice geeft je hond kans
                                om
                                lekker
                                te spelen.</p>
                            <Link className={Styles.learnMoreLink} href={'/uitlaatservice'}>Ontdek de
                                Uitlaatservice</Link>
                        </div>
                    </div>

                    <div className={Styles.serviceSection}>

                        <div className={Styles.serviceTextSection}>
                            <h3>Northern Inuit Dog</h3>

                            <p className={Styles.serviceTextBlock}>Dit unieke ras is bij Walkedo als eerste in
                                Nederland. Ik verwacht een groep pups te
                                hebben in de toekomst. Leer dit unieke ras kennen en schrijf je vrijblijvend in voor
                                de
                                wachtlijst. Zodra het concreet wordt heb je dan als eerste de kans om een plekje te
                                reserveren en eigenaar te worden van een beste vriend uit dit unieke ras!</p>
                            <Link className={Styles.learnMoreLink} href={'/northern-Inuit-dog'}>Ontdek de Northern
                                Inuit Dog</Link>
                        </div>
                    </div>

                    <div className={Styles.serviceSection}>

                        <div className={Styles.serviceTextSection}>
                            <h3>Opvang</h3>

                            <p className={Styles.serviceTextBlock}>Iedereen gaat wel eens op vakantie of is een hele
                                dag weg voor het werk. Klanten van Walkedo kunnen gebruik maken van de dagopvang en
                                hun honden lekker laten spelen en rasen in een kennel van 25 vierkantemeters. De
                                honden van de dagopvang gaan automatisch mee met de uitlaatservice. Meld je vandaag
                                nog aan voor een gezellige kennismaking!</p>
                            <Link className={Styles.learnMoreLink} href={'/opvang'}>Ontdek opvang</Link>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
