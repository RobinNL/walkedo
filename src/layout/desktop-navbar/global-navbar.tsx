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

    return (
        <>
            <nav className={`${Styles.navbar} ${props.className}`}>

                <div className={Styles.navbarContainer}>

                    <div className={Styles.navbarListSection}>
                        <ul className={Styles.navbarList}>
                            <li>
                                <a href={'/'}>
                                    <div>
                                        <Image src={'/images/logo.svg'} width={48} height={70} alt={'Walkedo logo'}/>
                                    </div>
                                </a>
                            </li>
                            <li className={Styles.navbarNoMargin}>
                                <div className={Styles.brandingWrapper} onClick={() => brandingPressed()}>
                                    <span className={Styles.brandingText}>Walkedo</span>
                                    <span className={Styles.subBrandingText}>Hondenservice</span>
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