'use client'

import Styles from './mobile-navbar.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React, { useState } from "react";
import { WalkedoButton } from "../../../components/button/button";
import { NavbarItems } from "../../../lib/navbar-items";
import Link from "next/link";

export interface GlobalNavbarProps {
    className: any;
}

export const MobileNavbar = (props: GlobalNavbarProps) => {

    const router = useRouter();
    const [activeItem, setActiveItem] = useState('');

    const [mobileMenuActive, setMobileMenuActive] = useState(false);

    const brandingPressed = () => {
        setActiveItem('');
        router.push('/');
    }

    const toggleMobileMenu = () => {
        setMobileMenuActive(!mobileMenuActive);
        document.body.classList.toggle('no-scroll', !mobileMenuActive);
    }

    const navigated = (uri: string) => {
        setActiveItem(uri);
        toggleMobileMenu()
        router.push(uri);
    }

    const walkedoBrandingDivider = 15;
    const spiritbornBrandingDivider = 14;
    const walkedoLogoDivider = 20;

    return (
        <>

            <nav className={`${Styles.navbar} ${props.className}`}>

                <div className={Styles.navbarListSection}>

                    <a href={'/'}>
                        <div className={Styles.brandingWrapperOuter}>
                            <Image src={'/images/brand/walkedo-logo.svg'} width={1592 / walkedoLogoDivider} height={1677 / walkedoLogoDivider} alt={'Walkedo logo'}/>
                            <div className={Styles.brandingWrapper} onClick={() => brandingPressed()}>
                                {
                                    activeItem !== '/northern-Inuit-dog' ?
                                        <Image src={'/images/brand/walkedo-text.svg'} className={Styles.navbarBrandingText}  width={2572 / walkedoBrandingDivider} height={272 / walkedoBrandingDivider} alt={'Walkedo logo'}/> :
                                        <Image src={'/images/brand/spiritborn-text.svg'} className={Styles.navbarBrandingText}  width={2695 / spiritbornBrandingDivider} height={245 / spiritbornBrandingDivider} alt={'Spiritborn logo'}/>
                                }
                            </div>
                        </div>
                    </a>

                    <div onClick={() => toggleMobileMenu()} className={Styles.navbarHamburger}>
                                    <span
                                        className={`${mobileMenuActive ? Styles.navbarHamburgerLineTop : ''} ${Styles.navbarHamburgerLine}`}></span>
                        <span
                            className={`${mobileMenuActive ? Styles.navbarHamburgerLineMiddle : ''} ${Styles.navbarHamburgerLine}`}></span>
                        <span
                            className={`${mobileMenuActive ? Styles.navbarHamburgerLineBottom : ''} ${Styles.navbarHamburgerLine}`}></span>
                    </div>
                </div>
            </nav>

            <div
                className={`${Styles.mobileFoldoutMenu} ${props.className} ${mobileMenuActive ? Styles.mobileFoldoutMenuOpen : null}`}>
                <div
                    className={`${Styles.navbarSignupSection} ${Styles.appearElement} ${mobileMenuActive ? Styles.appearFirst : ''}`}>
                    <p className={Styles.navbarSignupSectionDescription}>Meld je aan voor een kennismaking waarin we
                        samen kunnen kijken wat het beste past bij je hond.</p>
                    <div onClick={() => navigated('/aanmelden?service=uitlaten')}>
                        <WalkedoButton fullWidth={true} label={'Aanmelden'}/>
                    </div>
                </div>
                <div className={`${Styles.appearElement} ${mobileMenuActive ? Styles.appearSecond : ''}`}>
                    <h3 className={Styles.navbarMobileMenuHeader}>Menu</h3>
                    <ul className={Styles.navbarList}>
                        {
                            NavbarItems.map(item => (
                                <li key={item.label} className={`${activeItem === item.uri ? Styles.mobileNavbarLinkActive : Styles.mobileNavbarLink}`}
                                    onClick={() => navigated(item.uri)}>
                                    <Link href={item.uri}>{item.label}</Link>
                                </li>
                            ))
                        }
                    </ul>
                </div>

            </div>
            <div className={Styles.navbarShadow}>

            </div>
        </>
    )

}

export default MobileNavbar
