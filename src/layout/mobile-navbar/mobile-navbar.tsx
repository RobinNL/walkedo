'use client'

import Styles from './mobile-navbar.module.scss';
import Image from 'next/image';
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { WalkedoButton } from "../../../components/button/button";
import { NavbarItems } from "../../../lib/navbar-items";
import { Link, usePathname } from "@/i18n/navigation";

export interface GlobalNavbarProps {
    /** CSS module class that decides at which width this navbar is shown. */
    className: string;
}

export const MobileNavbar = (props: GlobalNavbarProps) => {
    const t = useTranslations('nav');
    const pathname = usePathname();
    const [mobileMenuActive, setMobileMenuActive] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuActive(!mobileMenuActive);
        document.body.classList.toggle('no-scroll', !mobileMenuActive);
    }

    const closeMenu = () => {
        setMobileMenuActive(false);
        document.body.classList.remove('no-scroll');
    }

    const walkedoBrandingDivider = 15;
    const spiritbornBrandingDivider = 14;
    const walkedoLogoDivider = 20;

    const isSpiritborn = pathname === '/northern-Inuit-dog';

    return (
        <>
            <nav className={`${Styles.navbar} ${props.className}`}>
                <div className={Styles.navbarListSection}>
                    <Link href={'/'} onClick={closeMenu} aria-label={t('home')}>
                        <div className={Styles.brandingWrapperOuter}>
                            <Image src={'/images/brand/walkedo-logo.svg'} width={1592 / walkedoLogoDivider}
                                   height={1677 / walkedoLogoDivider} alt={t('logoAlt')}/>
                            <div className={Styles.brandingWrapper}>
                                {!isSpiritborn ?
                                    <Image src={'/images/brand/walkedo-text.svg'}
                                           className={Styles.navbarBrandingText}
                                           width={2572 / walkedoBrandingDivider}
                                           height={272 / walkedoBrandingDivider}
                                           alt={t('logoAlt')}/> :
                                    <Image src={'/images/brand/spiritborn-text.svg'}
                                           className={Styles.navbarBrandingText}
                                           width={2695 / spiritbornBrandingDivider}
                                           height={245 / spiritbornBrandingDivider}
                                           alt={t('spiritbornLogoAlt')}/>}
                            </div>
                        </div>
                    </Link>

                    <button type={'button'}
                            onClick={toggleMobileMenu}
                            className={Styles.navbarHamburger}
                            aria-expanded={mobileMenuActive}
                            aria-label={mobileMenuActive ? t('closeMenu') : t('openMenu')}>
                        <span className={`${mobileMenuActive ? Styles.navbarHamburgerLineTop : ''} ${Styles.navbarHamburgerLine}`}></span>
                        <span className={`${mobileMenuActive ? Styles.navbarHamburgerLineMiddle : ''} ${Styles.navbarHamburgerLine}`}></span>
                        <span className={`${mobileMenuActive ? Styles.navbarHamburgerLineBottom : ''} ${Styles.navbarHamburgerLine}`}></span>
                    </button>
                </div>
            </nav>

            <div className={`${Styles.mobileFoldoutMenu} ${props.className} ${mobileMenuActive ? Styles.mobileFoldoutMenuOpen : null}`}>
                <div className={`${Styles.navbarSignupSection} ${Styles.appearElement} ${mobileMenuActive ? Styles.appearFirst : ''}`}>
                    <p className={Styles.navbarSignupSectionDescription}>{t('signupIntro')}</p>
                    <Link href={'/aanmelden?service=uitlaten'} onClick={closeMenu}>
                        <WalkedoButton fullWidth={true} label={t('signup')}/>
                    </Link>
                </div>
                <div className={`${Styles.appearElement} ${mobileMenuActive ? Styles.appearSecond : ''}`}>
                    <h3 className={Styles.navbarMobileMenuHeader}>{t('menu')}</h3>
                    <ul className={Styles.navbarList}>
                        {NavbarItems.map(item => (
                            <li key={item.key}
                                className={`${pathname === item.uri ? Styles.mobileNavbarLinkActive : Styles.mobileNavbarLink}`}>
                                <Link href={item.uri}
                                      onClick={closeMenu}
                                      aria-current={pathname === item.uri ? 'page' : undefined}>
                                    {t(item.key)}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className={Styles.navbarShadow}></div>
        </>
    )
}

export default MobileNavbar
