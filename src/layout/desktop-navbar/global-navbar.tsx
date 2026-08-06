'use client'

import Styles from './global-navbar.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React, { useRef, useState } from "react";
import { WalkedoButton } from "../../../components/button/button";
import Link from "next/link";
import { NavbarItems } from "../../../lib/navbar-items";

export interface GlobalNavbarProps {
    className: any;
}

export const GlobalNavbar = (props: GlobalNavbarProps) => {

    const router = useRouter();
    const [activeItem, setActiveItem] = useState('');

    const brandingPressed = () => {
        setActiveItem('');
        router.push('/');
    }

    const signup = () => {
        setActiveItem('');
        router.push('/aanmelden?service=uitlaten');
    }

    const walkedoBrandingDivider = 15;
    const spiritbornBrandingDivider = 14;
    const walkedoLogoDivider = 20;

    return (
        <>
            <nav className={`${Styles.navbar} ${props.className}`}>

                <div className={Styles.navbarContainer}>

                    <div className={`${Styles.navbarListSection} ${Styles.navbarLogoSection}`}>
                        <ul className={Styles.navbarList}>
                            <li>
                                <a href={'/'}>
                                    <div>
                                        <Image src={'/images/brand/walkedo-logo.svg'} width={1592 / walkedoLogoDivider} height={1677 / walkedoLogoDivider} alt={'Walkedo logo'}/>
                                    </div>
                                </a>
                            </li>
                            <li className={Styles.navbarNoMargin}>
                                <div className={Styles.brandingWrapper} onClick={() => brandingPressed()}>
                                    {
                                        activeItem !== '/northern-Inuit-dog' ?
                                            <Image src={'/images/brand/walkedo-text.svg'} className={Styles.navbarBrandingText}  width={2572 / walkedoBrandingDivider} height={272 / walkedoBrandingDivider} alt={'Walkedo logo'}/> :
                                            <Image src={'/images/brand/spiritborn-text.svg'} className={Styles.navbarBrandingText}  width={2695 / spiritbornBrandingDivider} height={245 / spiritbornBrandingDivider} alt={'Spiritborn logo'}/>
                                    }
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className={Styles.navbarListSection}>
                        <ul className={Styles.navbarList}>
                            {
                                NavbarItems.map(item => (
                                    <li key={item.label} className={`${activeItem === item.uri ? Styles.navbarItemActive : Styles.navbarItem}`}
                                        onClick={() => setActiveItem(item.uri)}>
                                        <Link href={item.uri}>{item.label}</Link>
                                    </li>
                                ))
                            }
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