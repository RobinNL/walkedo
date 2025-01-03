import Image from "next/image";
import Styles from "./opvang.module.scss";
import { WalkedoList } from "../../../components/list/list";

export default function Page() {

    return (
        <main>
            <div className={Styles.heroImage}>
                <Image sizes='max-width: 100vw' className={Styles.heroImageInner} fill={true}
                       alt={'honden in arnhem'}
                       objectPosition={'80% 90%'}
                       src={'/images/opvang/hond-op-bank.png'}/>
            </div>

            <div className={'container'}>

                <div className={Styles.heroIntroBlock}>
                    <h1 className={Styles.header}>Honden Opvang</h1>

                    <p>
                        Een hond is een vriend voor het leven. Maar soms moet of wil je ook even ver weg van huis en dan is het niet altijd mogelijk om je hond mee te nemen. Speciaal voor klanten van de Walkedo uitlaatservice,
                        kan je je hond door mij thuis laten opvangen. Je hond krijgt de beschikking over een ruimte groene tuin en een eigen plekje gedurende het verblijf zodat hij of zij zich kan terugtrekken. Maar als de hond het leuk vind zijn er zijn genoeg momenten met lekker veel gezelschap van mijn eigen honden en soms andere logés.
                    </p>
                </div>

                <div className={Styles.contentRow}>

                    <div className={Styles.contentBlock}>
                        <h3>Alle voordelen op een rijtje</h3>
                        <p>Laat je hond voor een korte of langere tijdsduur logeren. Je hond gaat dan automatisch ook mee met de groep, en kan zowel buiten als binnen verblijven tijdens het verblijf.</p>
                        <WalkedoList items={
                            [
                                'Een weekend of je gehele vakantie',
                                'Voor een vast bedrag per dag',
                                'Je hond heeft voldoende gezelschap',
                                'Je hond gaat automatisch elke werkdag mee met de uitlaatgroep',
                                'Je hond kan zowel buiten als binnen verblijven'

                            ]
                        } />
                    </div>

                    <div className={Styles.opvangHondImage}>
                        <Image sizes='max-width: 100vw'
                               objectPosition={'50% 50%'}
                               fill={true}
                               className={Styles.opvangHondImageInner}
                               src={'/images/opvang/koda-christmas-northern-inuit-dog.jpeg'}
                               alt={'Hond op de bank'}/>
                    </div>

                </div>

                <div className={Styles.opvangDisclaimer}>
                    <h3>Let op</h3>
                    <p>De honden opvang service is slechts beperkt beschikbaar. Voor een kwalitatief goede service dient elke hond een eigen plekje te hebben om zich terug te trekken. Ik ben hard bezig om meer van dit
                    soort plekjes, zowel binnen als buiten te realiseren, zodat er meer honden kunnen logeren. Neem contact op voor de actuele beschikbaarheid.</p>
                </div>


            </div>

        </main>
    );
}
