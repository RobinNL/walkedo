'use client'

import Image from "next/image";
import Styles from "./page.module.scss";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Home() {

    const width = useRef(typeof window !== 'undefined' ? window.innerWidth : { current: 600 });

    const [videoHeight, setVideoHeight] = useState(width.current as number * 0.5625);
    const [videoWidth, setVideoWidth]: [number, any] = useState(0);

    useEffect(() => {
        setVideoHeight(width.current as number > 768 ? width.current as number * 0.5625 : width.current as number * 0.7625);
        setVideoWidth(width.current);
    }, [width])

    return (
        <div>
            <div className={Styles.heroImage}
                 style={{height: videoHeight + 'px', width: videoWidth + 'px'}}>
                <video width={videoWidth + 'px'}
                       height={videoHeight + 'px'}
                       playsInline={true}
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
                    <p className={Styles.heroSignupDescription}>Laat je viervoeter de mooiste plekjes van Arnhem ontdekken met een groep waar hij zich helemaal thuis voelt. En ga met een gerust hart op vakantie met de opvangservice.</p>
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
                        Ontdek waar je interesse in hebt en meld je aan voor een vrijblijvend kennismakingsgesprek.
                        Jouw hond is mijn klant en laten we er samen een mooie ervaring van maken.
                    </h3>

                </div>

                <div className={Styles.container}>

                    <div className={Styles.serviceSection}>

                        <div className={Styles.serviceTextSection}>
                            <div className={Styles.indexServiceDescription}>
                                <h2 className={Styles.serviceHeader}>Uitlaatservice</h2>
                                <h3>Lekker de energie kwijt en socialiseren met andere honden.</h3>

                                <p>Laat je hond èèn of meerdere malen per week  door mij ophalen. Honden lopen minimaal een uur en zitten maximaal een uur in de bus. Per groep zijn er zes vaste slots beschikbaar. En zijn er twee slots beschikbaar voor honden die in de opvang zitten of voor klanten die niet uitkomen met het reguliere uitlaten van de hond. De honden groepen worden zorgvuldig samengesteld. Zo is een puppygroep op vrijdag en zelfs een volledige doodle groep. Om die reistijd klein te houden is mijn werkgebied beperkt tot Arnhem Noord, Schaarsbergen en omstreken.
                                </p>
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

                                <p className={Styles.serviceTextBlock}>Iedereen gaat er wel eens op uit en hoe leuk het ook is om op vakantie te gaan met je hond, toch wil je wel eens even wat anders. Klanten van Walkedo kunnen gebruik per januari 2025 gebruik maken van de opvangservice. Laat je honden lekker razen en spelen in een kennel van 25 vierkante meter terwijl jij en je gezin van een vakantie geniet. De honden van de opvang gaan automatisch mee met de uitlaatservice.</p>
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
                               src={'/images/opvang/opvang-2.jpeg'}
                               alt={'hond in het gras'} className={Styles.serviceSectionImage}/>
                    </div>
                    <div className={Styles.serviceSectionImage}>
                        <Image objectFit={'cover'} fill={true}
                               src={'/images/opvang/opvang-3.jpeg'}
                               alt={'hond in het gras'} className={Styles.serviceSectionImage}/>
                    </div>
                </div>

                <div className={Styles.container}>

                    <div className={Styles.serviceSection}>

                        <div className={Styles.serviceTextSection}>
                            <div className={Styles.indexServiceDescription}>
                                <h2 className={Styles.serviceHeader}>Northern Inuit Dog</h2>
                                <h3>Een uniek ras bekend uit Game of Thrones en nu in Nederland.</h3>

                                <p className={Styles.serviceTextBlock}>Dit unieke ras is bij de Walkedo kennel als eerste in Nederland. Leer dit prachtige ras kennen. We verwachten een roedel pups in de toekomst, schrijf je vrijblijvend in voor de wachtlijst. Zodra het concreet wordt heb je als eerste de kans om een plekje te reserveren en eigenaar te worden van een beste vriend uit dit unieke prachtige ras.</p>
                                <Link className={Styles.learnMoreLink} href={'/northern-Inuit-dog'}>
                                     <span className={Styles.learnMoreLinkText}>
                                        Meld je aan voor een pup
                                    </span>
                                    <Image className={Styles.learnMoreLinkIcon} src={'/fonts/icons/arrow-right.svg'}
                                           alt={'pijl naar rechts'}
                                           height={20} width={20}/>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>


                <div className={Styles.container}>

                    <div className={Styles.serviceSection}>

                        <div className={Styles.serviceTextSection}>
                            <div className={Styles.indexServiceDescription}>
                                <h2 className={Styles.serviceHeader}>Casting</h2>
                                <h3>Een wolf look-alike voor op de foto of video</h3>

                                <p className={Styles.serviceTextBlock}>Northern Inuit dogs lijken erg op een wolf en zijn erg geduldig en pakken instructies erg snel op. Dit maakt ze een ideale match voor film of fotoproducties klein en groot.</p>
                                <Link className={Styles.learnMoreLink} href={'/casting'}>
<span className={Styles.learnMoreLinkText}>
                                        Casting
                                    </span>
                                    <Image className={Styles.learnMoreLinkIcon} src={'/fonts/icons/arrow-right.svg'}
                                           alt={'pijl naar rechts'}
                                           height={20} width={20}/>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={Styles.castingImageBackdrop}>
                <div className={Styles.northernInuitDogImage}>
                    <Image objectFit={'cover'} fill={true}
                           objectPosition={'65%'}
                           src={'/images/casting/koda-casting-highfive.jpg'}
                           alt={'Northern Inuit dog die poseert naast roodkapje in een fotoproductie'}/>
                </div>
            </div>
            <p className={Styles.expoLink}>Expo: Roodkapje 2025. <a href={'/casting'}>Ontdek de artiesten</a></p>

        </div>
    );
}
