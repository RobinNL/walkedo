'use client'

import Styles from './global-footer.module.scss';
import Image from 'next/image';
import Link from "next/link";

export interface GlobalFooterProps {

}

export const GlobalFooter = (props: GlobalFooterProps) => {

    return (
        <footer className={Styles.footer}>

            <Image src={'images/dog-silhouette/dog-silhouette-group.svg'} className={Styles.footerDogImage} width={1920 / 3} height={787 / 3}
                   alt={'silhouette van honden'}/>


            <div className={Styles.footerMainSection}>

                <h3>Neem vrijblijvend contact op</h3>

                <Image src={'/images/whatsapp-walkedo.png'} width={200} height={200} alt={'whatsapp QR code'}/>

            </div>

            <div className={Styles.footerWrapper}>


                <div className={Styles.footerSection}>

                    <h3>Gegevens</h3>

                    <ul className={Styles.footerList}>
                        <li>
                            <p className={Styles.footerLabel}>Adres</p>
                            <p className={Styles.footerValue}>Karmelitessenlaan 26, 6816PK Arnhem</p>
                        </li>
                        <li>
                            <p className={Styles.footerLabel}>KVK</p>
                            <p className={Styles.footerValue}>91522765</p>
                        </li>
                        <li>
                            <p className={Styles.footerLabel}>Email</p>
                            <p className={Styles.footerValue}>woof@walkedo.com</p>
                        </li>
                    </ul>

                </div>

                <div className={Styles.footerSection}>

                    <h3>Links</h3>

                    <ul className={Styles.linksList}>
                        <li>
                            <Link href={''}>
                                Voorwaarden
                            </Link>
                        </li>
                        <li>
                            <Link href={'/uitlaatservice'}>
                                Honden Uitlaatservice
                            </Link>
                        </li>
                        <li>
                            <Link href={'/opvang'}>
                                Opvang
                            </Link>
                        </li>
                        <li>
                            <Link href={'/documenten'}>
                                Documenten
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className={Styles.footerSection}>

                    <h3>Volg ons</h3>

                    <ul className={Styles.socialMediaList}>
                        <li>
                            <Image src={'/images/socials/instagram.svg'} width={60} height={60}
                                   alt={'instagram afbeelding'}/>
                        </li>
                        <li>
                            <Image src={'/images/socials/facebook.svg'} width={60} height={60}
                                   alt={'facebook afbeelding'}/>
                        </li>
                    </ul>

                </div>

                <div className={Styles.footerSection}>

                    <h3>Privacy</h3>
                    <p>Walkedo bewaard geen online gegevens. Wij gaan met uiterste zorg om met uw persoonlijke gegevens
                        en bezittingen. Deze website maakt geen gebruik van cookies met uitzondering van Google
                        Analytics voor het beheren van statistieken.</p>
                </div>

            </div>

        </footer>
    )

}

export default GlobalFooter