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

    return (
        <>

            <nav className={`${Styles.navbar} ${props.className}`}>

                <div className={Styles.navbarListSection}>

                    <a href={'/'}>
                        <div className={Styles.brandingWrapperOuter}>
                            <Image src={'/images/logo.svg'} width={69 / 1.3} height={100 / 1.3} alt={'Walkedo logo'}/>
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
