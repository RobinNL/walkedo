'use client'

import Image from "next/image";
import Styles from "./page.module.scss";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import Link from "next/link";
import { WalkedoButton } from "../../components/button/button";

export default function Home() {

    const width = useRef(typeof window !== 'undefined' ? window.innerWidth : { current: 1200 });

    const router = useRouter();

    return (
        <div>
            <div className={Styles.heroImage}
                 style={{height: width.current as number < 768 ? width.current as number * 0.5625 + 100 + 'px' : width.current as number * 0.5625 + 'px'}}>
                <video width={width.current + 'px'}
                       height={(width.current as number * 0.5625) + 'px'}
                       className={Styles.heroVideo} controls={false} controlsList={"nodownload"} loop={true}
                       muted={true} preload="auto" autoPlay={true}>
                    <source src="/videos/walkedo-intro.mp4" type="video/mp4"/>
                    <Image alt={'honden op een veld'} sizes='max-width: 100vw' className={Styles.heroImageInner} fill={true}
                           src={'/images/walking-dogs-hero.jpg'}/>
                </video>
            </div>
            <div className={Styles.heroSignupBtn}>
                <div className={Styles.heroSignupInner}>
                    <h2 className={Styles.heroSignupTitle}>Met hart voor je hond</h2>
                    <p className={Styles.heroSignupDescription}>Laat je viervoeter de mooiste plekjes van Arnhem
                        ontdekken met een groep waar je hond zich helemaal thuis
                        voelt. En ga met een gerusthart op vakantie met de opvangservice.</p>
                    <div className={Styles.heroSignupIconWrapper}>
                        <Image className={Styles.heroSignupIconIcon} alt={'pijl naar beneden'} src={'fonts/icons/chevron-down.svg'} width={30}
                               height={30}/>
                        <Image className={`${Styles.heroSignupIconIcon} ${Styles.heroSignupIconIconBottom}`}
                               alt={'pijl naar beneden'}
                               src={'fonts/icons/chevron-down.svg'} width={30} height={30}/>
                    </div>
                </div>
            </div>
            <div className={Styles.pageContainer}>
                <div className={Styles.container}>

                    <h1 className={Styles.indexHeader}>Hondenservice Arnhem Noord</h1>

                    <h3 className={Styles.indexDescriptionWrapper}>
                        Ontdek waar je interesse in hebt en meld je aan voor een vrijblijvende kennismaking. Jouw hond
                        is mijn klant en ik kan niet wachten op onze eerste kennismaking.
                    </h3>

                </div>

                <div className={Styles.container}>

                    <div className={Styles.serviceSection}>

                        <div className={Styles.serviceTextSection}>
                            <div className={Styles.indexServiceDescription}>
                                <h2 className={Styles.serviceHeader}>Uitlaatservice</h2>
                                <h3>Lekker de energie kwijt en socialiseren met andere honden.</h3>

                                <p>Laat je hond een of meerdere malen per week
                                    door
                                    mij ophalen. We lopen een uur met een groep van maximaal 6 andere honden die
                                    goed bij je eigen hond passen. Zo heb ik een speciale Labradoodle groep, &quotde
                                    walkadoodles&quot, en een puppy groep op vrijdag.
                                    Na de wandeling breng ik je hond weer terug. Een uitlaatservice geeft je hond
                                    kans om lekker te spelen en te socialiseren. De uitlaatservice rijdt in Arnhem Noord, Schaarsbergen en omstreken.</p>
                                <Link className={Styles.learnMoreLink} href={'/uitlaatservice'}>
                                    <span className={Styles.learnMoreLinkText}>
                                        Uitlaatservice Arnhem Noord
                                    </span>
                                    <Image alt={'pijl naar rechts'} className={Styles.learnMoreLinkIcon} src={'/fonts/icons/arrow-right.svg'}
                                           height={20} width={20}/>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={Styles.serviceSectionImageRow}>
                    <div className={Styles.serviceSectionImage}>
                        <Image objectFit={'cover'} fill={true}
                               src={'/images/uitlaatservice/uitlaatservice-arnhem.jpeg'}
                               alt={'hond in het gras'}/>
                    </div>
                    <div className={Styles.serviceSectionImage}>
                        <Image objectFit={'cover'} fill={true}
                               src={'/images/uitlaatservice/uitlaatservice-arnhem-2.jpeg'}
                               alt={'hond in het gras'} className={Styles.serviceSectionImage}/>
                    </div>
                    <div className={Styles.serviceSectionImage}>
                        <Image objectFit={'cover'} fill={true}
                               src={'/images/uitlaatservice/uitlaatservice-arnhem-3.jpeg'}
                               alt={'hond in het gras'} className={Styles.serviceSectionImage}/>
                    </div>
                </div>

                <div className={Styles.container}>

                    <div className={Styles.serviceSection}>

                        <div className={Styles.serviceTextSection}>
                            <div className={Styles.indexServiceDescription}>
                                <h2 className={Styles.serviceHeader}>Opvangservice</h2>
                                <h3>Voor een dag, een week of een vakantieperiode.</h3>

                                <p className={Styles.serviceTextBlock}>Iedereen gaat wel eens op vakantie of is een hele
                                    dag weg voor het werk. Klanten van Walkedo kunnen gebruik maken van de opvangservice. Laat je honden lekker lekker laten spelen en rasen in een kennel van 25 vierkantemeters terwijl je gezin van een vakantie geniet. De honden van de opvang gaan automatisch mee met de uitlaatservice.</p>
                                <Link className={Styles.learnMoreLink} href={'/opvang'}>
                                     <span className={Styles.learnMoreLinkText}>
                                        Opvangservice
                                    </span>
                                    <Image className={Styles.learnMoreLinkIcon} src={'/fonts/icons/arrow-right.svg'}
                                           alt={'pijl naar rechts'}
                                           height={20} width={20}/>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={Styles.serviceSectionImageRow}>
                    <div className={Styles.serviceSectionImage}>
                        <Image objectFit={'cover'} fill={true}
                               src={'/images/opvang/opvang-1.jpeg'}
                               alt={'hond in het gras'}/>
                    </div>
                    <div className={Styles.serviceSectionImage}>
                        <Image objectFit={'cover'} fill={true}
                               src={'/images/opvang/opvang-4.jpeg'}
                               alt={'hond in het gras'} className={Styles.serviceSectionImage}/>
                    </div>
                    <div className={Styles.serviceSectionImage}>
                        <Image objectFit={'cover'} fill={true}
                               src={'/images/opvang/opvang-2.jpeg'}
                               alt={'hond in het gras'} className={Styles.serviceSectionImage}/>
                    </div>
                </div>

                <div className={Styles.container}>

                    <div className={Styles.serviceSection}>

                        <div className={Styles.serviceTextSection}>
                            <div className={Styles.indexServiceDescription}>
                                <h2 className={Styles.serviceHeader}>Northern Inuit Dog</h2>
                                <h3>Een uniek ras bekend uit Game of Thrones en nu in Nederland.</h3>

                                <p className={Styles.serviceTextBlock}>Dit unieke ras is bij Walkedo als eerste in
                                    Nederland. Ik verwacht een groep pups te
                                    hebben in de toekomst. Leer dit unieke ras kennen en schrijf je vrijblijvend in voor
                                    de
                                    wachtlijst. Zodra het concreet wordt heb je dan als eerste de kans om een plekje te
                                    reserveren en eigenaar te worden van een beste vriend uit dit unieke ras!</p>
                                <Link className={Styles.learnMoreLink} href={'/northern-Inuit-dog'}>
                                     <span className={Styles.learnMoreLinkText}>
                                        Northern Inuit Dog
                                    </span>
                                    <Image className={Styles.learnMoreLinkIcon} src={'/fonts/icons/arrow-right.svg'}
                                           alt={'pijl naar rechts'}
                                           height={20} width={20}/>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={Styles.northernInuitDogImage}>
                    <Image objectFit={'cover'} fill={true}
                           src={'/images/inuit-dog/northern-inuit-dog-beach.jpeg'}
                           alt={'Northern Inuit dog strand'}/>
                </div>

            </div>

        </div>
    );
}
