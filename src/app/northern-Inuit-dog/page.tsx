import getPostMetadata from "../../../utils/getPostMetaData";
import Styles from "@/app/northern-Inuit-dog/norhern-inuit.module.scss";
import Image from "next/image";
import React from "react";
import { ArticlePreview } from "../../../components/article-preview/article-preview";
import { WalkedoList } from "../../../components/list/list";
import Link from "next/link";
import { WalkedoButton } from "../../../components/button/button";

export default async function Page() {

    const benefitRace: string[] = [
        'Toegewijd aan de familie',
        'Gezelschapshonden die wel alleen kunnen zijn',
        'Geen waakhond',
        'Intelligente honden',
        'Genieten van lange wandelingen',
        'passen makkelijk in een roedel'
    ]

    return (
        <main>
            <div className={Styles.heroImage}>
                <Image sizes='max-width: 100vw' className={Styles.heroImageInner} fill={true}
                       alt={'honden in arnhem'}
                       src={'/images/inuit-dog/northern-inuit.jpeg'}/>
            </div>
            <div className={'container'}>

                <h1 className={Styles.header}>Northern Inuit Dog</h1>

                <p className={Styles.mainHeroContentWrap}>
                    Dit prachtige ras is nog heel onbekend wereldwijd en al helemaal in Nederland. De honden zijn heel
                    sociaal, gaan goed in groepen en andere honden. Het ras is bekend van de TV serie Game of
                    Thrones. De Northern Inuit Dog bestaat uit een kruising van een Siberische Huskey, Duitse Herder en Alaskan Malamute.
                    Er zit geen wolf DNA in de Northern Inuit Dog waardoor ze makkelijk de rol van een familie huisdier kunnen vervullen.
                </p>

                <div className={Styles.contentRow}>

                    <div className={Styles.contentBlock}>
                        <h3>Eigenschappen ras</h3>
                        <WalkedoList items={benefitRace}/>
                    </div>

                    <div className={Styles.asideBlock}>
                        <Image fill={true} className={Styles.asideBlockImage}  src={'/images/inuit-dog/pups-northern-inuit-dog.jpeg'}
                               alt={'kaart van Arnhem'}/>
                    </div>

                </div>

                <div className={Styles.puppyContainer}>
                    <h3>Interesse in een puppy?</h3>
                    <p>Wij verwachten binnen een aantal jaar een nestje te krijgen van Northern Inuits. Heb je interesse in een Northern Inuit schrijf je dan alvast vrijblijvend in (de definitieve lijst volgt nog).
                    Ook als je het ras wilt ervaren kan je contact met mij opnemen.</p>
                    <Link className={Styles.puppyContainerCta} href={'/aanmelden?service=puppy'}>
                        <WalkedoButton fullWidth={true} label={'Aanmelden voor een Northern Inuit puppy'} />
                    </Link>
                </div>

            </div>
        </main>
    );
}


