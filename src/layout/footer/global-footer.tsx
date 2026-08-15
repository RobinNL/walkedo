import Styles from './global-footer.module.scss';
import Image from 'next/image';
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "./language-switcher";

export interface GlobalFooterProps {}

export const GlobalFooter = (props: GlobalFooterProps) => {
    const t = useTranslations('footer');

    return (
        <footer className={Styles.footer}>
            <Image src={'/images/dog-silhouette/dog-silhouette-group.svg'} className={Styles.footerDogImage}
                   width={1920 / 3} height={787 / 3} alt={t('dogSilhouetteAlt')}/>

            <div className={Styles.footerMainSection}>
                <h3>{t('contactHeading')}</h3>
                <Image src={'/images/whatsapp-walkedo.png'} width={200} height={200} alt={t('whatsappAlt')}/>
            </div>

            <div className={Styles.footerWrapper}>

                <div className={Styles.footerSection}>
                    <h3>{t('certificates')}</h3>
                    <div className={Styles.footerCertificateArea}>
                        <div>
                            <a href={'https://groenenorm.nl'} target={'_blank'} rel={'noopener noreferrer'}>
                                <Image src={'/images/keurmerken/groene-norm-logo.png'} width={200} height={114}
                                       alt={t('certificateAlt.groeneNorm')}/>
                            </a>
                        </div>
                        <div>
                            <Image src={'/images/keurmerken/puppy-culture.png'} width={200} height={156}
                                   alt={t('certificateAlt.puppyCulture')}/>
                        </div>
                        <div>
                            <Image src={'/images/keurmerken/aeres.png'} width={200} height={60}
                                   alt={t('certificateAlt.aeres')}/>
                        </div>
                    </div>
                </div>

                <div className={Styles.footerSection}>
                    <h3>{t('details')}</h3>
                    <ul className={Styles.footerList}>
                        <li>
                            <p className={Styles.footerLabel}>{t('address')}</p>
                            <a target={'_blank'} rel={'noopener noreferrer'}
                               href={'https://www.google.nl/maps/place/Walkedo/@52.0084452,5.8862349,17z'}
                               className={Styles.footerValue}>Karmelitessenlaan 26, 6816PK Arnhem</a>
                        </li>
                        <li>
                            <p className={Styles.footerLabel}>{t('kvk')}</p>
                            <a href={"https://www.kvk.nl/bestellen/#/91522765000057195412"} target={'_blank'}
                               rel={'noopener noreferrer'}
                               className={Styles.footerValue}>91522765</a>
                        </li>
                        <li>
                            <p className={Styles.footerLabel}>{t('bank')}</p>
                            <p className={Styles.footerValue}>NL04 KNAB 0617 6989 37</p>
                        </li>
                        <li>
                            <p className={Styles.footerLabel}>{t('email')}</p>
                            <a href={"mailto:woof@walkedo.com"}
                               className={Styles.footerValue}>woof@walkedo.com</a>
                        </li>
                    </ul>
                </div>

                <div className={Styles.footerSection}>
                    <h3>{t('links')}</h3>
                    <ul className={Styles.linksList}>
                        <li><Link href={'/uitlaatservice'}>{t('linkUitlaatservice')}</Link></li>
                        <li><Link href={'/opvang'}>{t('linkOpvang')}</Link></li>
                        <li><Link href={'/documenten'}>{t('linkDocumenten')}</Link></li>
                    </ul>
                </div>

                <div className={Styles.footerSection}>
                    <h3>{t('follow')}</h3>
                    <ul className={Styles.socialMediaList}>
                        <li>
                            <a href={"https://www.instagram.com/walkedohus"} target={"_blank"}
                               rel={'noopener noreferrer'}>
                                <Image src={'/images/socials/instagram.svg'} width={60} height={60}
                                       alt={t('instagramAlt')}/>
                            </a>
                        </li>
                        <li>
                            <a href={"https://www.facebook.com/walkedo"} target={"_blank"}
                               rel={'noopener noreferrer'}>
                                <Image src={'/images/socials/facebook.svg'} width={60} height={60}
                                       alt={t('facebookAlt')}/>
                            </a>
                        </li>
                    </ul>
                </div>

                <LanguageSwitcher/>

                <div className={Styles.footerSection}>
                    <h3>{t('privacy')}</h3>
                    <p>{t('privacyText')}</p>
                </div>

            </div>
        </footer>
    )
}

export default GlobalFooter
