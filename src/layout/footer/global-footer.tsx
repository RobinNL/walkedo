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
                            <a target={'_blank'} href={'https://www.google.nl/maps/place/Walkedo/@52.0084452,5.8730795,17z/data=!3m1!4b1!4m6!3m5!1s0x47c7a5a334f48edf:0xee9a916b22e0d222!8m2!3d52.0084452!4d5.8756598!16s%2Fg%2F11c1tbzw9c?entry=ttu&g_ep=EgoyMDI0MDgyNy4wIKXMDSoASAFQAw%3D%3D'} className={Styles.footerValue}>Karmelitessenlaan 26, 6816PK Arnhem</a>
                        </li>
                        <li>
                            <p className={Styles.footerLabel}>KVK</p>
                            <a href={"https://www.kvk.nl/bestellen/#/91522765000057195412"} target={'_blank'} className={Styles.footerValue}>91522765</a>
                        </li>
                        <li>
                            <p className={Styles.footerLabel}>Email</p>
                            <a href={"mailto:woof@walkedo.com"} target={'_blank'} className={Styles.footerValue}>woof@walkedo.com</a>
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
                            <a href={"https://www.instagram.com/walkedohus"} target={"_blank"}>
                                <Image src={'/images/socials/instagram.svg'} width={60} height={60}
                                       alt={'instagram afbeelding'}/>
                            </a>
                        </li>
                        <li>
                            <a href={"https://www.facebook.com/walkedo"} target={"_blank"}>
                                <Image src={'/images/socials/facebook.svg'} width={60} height={60}
                                       alt={'facebook afbeelding'}/>
                            </a>
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