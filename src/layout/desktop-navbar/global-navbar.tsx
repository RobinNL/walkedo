'use client'

import Styles from './global-navbar.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React, { useRef, useState } from "react";
import { WalkedoButton } from "../../../components/button/button";
import Link from "next/link";

export interface GlobalNavbarProps {
    className: any;
}

export const GlobalNavbar = (props: GlobalNavbarProps) => {

    const router = useRouter();
    const [activeItem, setActiveItem] = useState('');

    const [mobileMenuActivated, setMobileMenuActivated] = useState(false);

    const [mobileMenuActive, setMobileMenuActive] = useState(false);

    const brandingPressed = () => {
        router.push('/');
    }

    // const socialIcons = () => {
    //     return (
    //         <li>
    //             <a href={'https://www.twitter.com/theluciapp'} className={Styles.socialIcon} target={'_blank'}
    //                rel={'noreferrer'}>
    //                 <Icon name={'x'} width={'26px'} className={Styles.navbarSocialIcon} height={'26px'}/>
    //             </a>
    //             <a href={'https://www.threads.net/@theluciapp'} target={'_blank'} rel={'noreferrer'}
    //                className={`${Styles.navbarSocialSpacingLeft} ${Styles.socialIcon}`}>
    //                 <Icon name={'threads'} width={'26px'} className={Styles.navbarSocialIcon} height={'26px'}/>
    //             </a>
    //             <a href={'https://www.facebook.com/profile.php?id=100090560054765'} target={'_blank'} rel={'noreferrer'}
    //                className={`${Styles.navbarSocialSpacingLeft} ${Styles.socialIcon}`}>
    //                 <Icon name={'facebook'} width={'26px'} className={Styles.navbarSocialIcon} height={'26px'}/>
    //             </a>
    //             <a href={'https://www.youtube.com/channel/UCp44gSnuRfK7xupMKxCOT4Q'} target={'_blank'}
    //                rel={'noreferrer'}
    //                className={`${Styles.navbarSocialSpacingLeft} ${Styles.socialIcon}`}>
    //                 <Icon name={'youtube'} width={'26px'} className={Styles.navbarSocialIcon} height={'26px'}/>
    //             </a>
    //             <a href={'https://www.tiktok.com/@theluciapp'} target={'_blank'} rel={'noreferrer'}
    //                className={`${Styles.navbarSocialSpacingLeft} ${Styles.socialIcon}`}>
    //                 <Icon name={'tiktok'} width={'26px'} className={Styles.navbarSocialIcon} height={'26px'}/>
    //             </a>
    //         </li>
    //     )
    // }

    const toggleMobileMenu = () => {
        setMobileMenuActive(!mobileMenuActive);
        setMobileMenuActivated(true);
        document.body.classList.toggle('no-scroll', !mobileMenuActive);
    }

    const signup = () => {
        router.push('/aanmelden');
    }

    return (
        <>
            <nav className={`${Styles.navbar} ${props.className}`}>

                <div className={Styles.navbarContainer}>

                    <div className={Styles.navbarListSection}>
                        <ul className={Styles.navbarList}>
                            <li>
                                <a href={'/'}>
                                    <div>
                                        <Image src={'/images/logo.png'} width={48} height={70} alt={'Walkedo logo'}/>
                                    </div>
                                </a>
                            </li>
                            <li>
                                <div className={Styles.brandingWrapper} onClick={() => brandingPressed()}>
                                    <span className={Styles.brandingText}>Walkedo</span>
                                    <span className={Styles.subBrandingText}>Hondenservice</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className={Styles.navbarListSection}>
                        <ul className={Styles.navbarList}>
                            <li className={`${activeItem === '/' ? Styles.navbarItemActive : Styles.navbarItem}`}>
                                <Link href='/uitlaatservice'>Uitlaatservice</Link>
                            </li>
                            <li className={`${activeItem.indexOf('/opvang') !== -1 ? Styles.navbarItemActive : Styles.navbarItem}`}>
                                <Link href='/opvang'>Opvang</Link>
                            </li>
                            <li className={`${activeItem.indexOf('/northern-inuit-dog') !== -1 ? Styles.navbarItemActive : Styles.navbarItem}`}>
                                <Link href='/northern-Inuit-dog'>Northern Inuit Dog</Link>
                            </li>
                            <li className={`${activeItem.indexOf('/nieuws') !== -1 ? Styles.navbarItemActive : Styles.navbarItem}`}>
                                <Link href='/nieuws'>Nieuws</Link>
                            </li>
                        </ul>
                    </div>

                    <div className={Styles.navbarSignupSection} onClick={() => signup()}>
                        <WalkedoButton label={'Aanmelden'}/>
                    </div>

                </div>

                {/**/}
            </nav>

            <div className={Styles.navbarShadow}>

            </div>
        </>
    )

}

export default GlobalNavbar