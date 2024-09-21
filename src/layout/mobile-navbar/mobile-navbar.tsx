'use client'

import Styles from './mobile-navbar.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React, { useState } from "react";
import { WalkedoButton } from "../../../components/button/button";

export interface GlobalNavbarProps {
    className: any;
}

export const MobileNavbar = (props: GlobalNavbarProps) => {

    const router = useRouter();
    const [activeItem, setActiveItem] = useState('');

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
        document.body.classList.toggle('no-scroll', !mobileMenuActive);
    }

    const navigated = (uri: string) => {
        toggleMobileMenu()
        router.push(uri);
    }

    return (
        <>

            <nav className={`${Styles.navbar} ${props.className}`}>

                <div className={Styles.navbarListSection}>

                    <a href={'/'}>
                        <div className={Styles.brandingWrapperOuter}>
                            <Image src={'/images/logo.png'} width={69 / 1.3} height={100 / 1.3} alt={'Walkedo logo'}/>
                            <div className={Styles.brandingWrapper} onClick={() => brandingPressed()}>
                                <span className={Styles.brandingText}>Walkedo</span>
                                <span className={Styles.subBrandingText}>Hondenservice</span>
                            </div>
                        </div>
                    </a>

                    <div onClick={() => toggleMobileMenu()} className={Styles.navbarHamburger}>
                                    <span
                                        className={`${mobileMenuActive ? Styles.navbarHamburgerLineTop : ''} ${Styles.navbarHamburgerLine}`}></span>
                        <span
                            className={`${mobileMenuActive ? Styles.navbarHamburgerLineMiddle : ''} ${Styles.navbarHamburgerLine}`}></span>
                        <span
                            className={`${mobileMenuActive ? Styles.navbarHamburgerLineBottom: ''} ${Styles.navbarHamburgerLine}`}></span>
                    </div>
                </div>
            </nav>

            <div className={`${Styles.mobileFoldoutMenu} ${props.className} ${mobileMenuActive ? Styles.mobileFoldoutMenuOpen : null}`}>
                <div className={`${Styles.navbarSignupSection} ${Styles.appearElement} ${mobileMenuActive ? Styles.appearFirst : ''}`}>
                    <p className={Styles.navbarSignupSectionDescription}>Meld je aan voor een kennismaking waarin we samen kunnen kijken wat het beste past bij je hond.</p>
                    <div onClick={() => navigated('/aanmelden')}>
                        <WalkedoButton fullWidth={true} label={'Aanmelden'}/>
                    </div>
                </div>
                <div className={`${Styles.appearElement} ${mobileMenuActive ? Styles.appearSecond : ''}`}>
                    <h3 className={Styles.navbarMobileMenuHeader}>Menu</h3>
                    <ul className={Styles.navbarList}>
                        <li className={`${activeItem === '/' ? Styles.navbarItemActive : Styles.mobileNavbarLink}`}>
                            <a onClick={() => navigated('/uitlaatservice')}>Uitlaatservice</a>
                        </li>
                        <li className={`${activeItem.indexOf('/opvang') !== -1 ? Styles.navbarItemActive : Styles.mobileNavbarLink}`}>
                            <a onClick={() => navigated('/opvang')}>Opvang</a>
                        </li>
                        <li className={`${activeItem.indexOf('/northern-inuit-dog') !== -1 ? Styles.navbarItemActive : Styles.mobileNavbarLink}`}>
                            <a onClick={() => navigated('/northern-inuit-dog')}>Northern Inuit Dog</a>
                        </li>
                        <li className={`${activeItem.indexOf('/nieuws') !== -1 ? Styles.navbarItemActive : Styles.mobileNavbarLink}`}>
                            <a onClick={() => navigated('/nieuws')}>Nieuws</a>
                        </li>
                    </ul>
                </div>

            </div>

        </>
    )

}

export default MobileNavbar
