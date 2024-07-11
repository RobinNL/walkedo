'use client'

import Image from "next/image";
import Styles from "./page.module.scss";
import { useRouter } from "next/navigation";

export default function Home() {

    const router = useRouter();

    return (
        <div>
            <div className={Styles.heroImage}>
                <Image sizes='max-width: 100vw' className={Styles.heroImageInner} fill={true} src={'/images/walking-dogs-hero.jpg'} />
            </div>
            <div className={Styles.pageContainer}>
                <div className={Styles.container}>
                    <h2>Jouw hond komt op de eerste plek</h2>
                    <p>Walkedo is een hondenuitlaatservice, kennel en meer op een adres. Een contactpunt met
                        persoonlijke aandacht voor je hond. Zo loopt je hond in kleine groepen,
                        en is er regelmatig plek voor (langdurige) opvang van je hond als je zelf op vakantie gaat.
                        Ontdek onze services en neem vrijblijvend contact op voor een kennismakingsgesprek.
                    </p>
                </div>

                <div className={Styles.container}>
                    <h2>Honden uitlaatservice</h2>
                    <div>
                        <div className={Styles.halfImage}>
                            <Image src={'/images/dogs-in-group'} fill={true} />
                        </div>
                        <p>
                            Boek een of meerdere slots per week zodat je hond lekker kan wandelen met de groep. Ik loop
                            maximaal 6 honden per groep en heb speciale groepen zoals de puppy groep.
                            Elke groep is zorgvuldig samengesteld zodat je hond minder lang in de bus zit en in een
                            groep komt met honden waar hij of zij goed mee kan spelen.
                        </p>
                    </div>

                </div>

            </div>
        </div>
    );
}
