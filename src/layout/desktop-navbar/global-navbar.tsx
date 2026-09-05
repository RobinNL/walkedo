'use client'

import Styles from './global-navbar.module.scss';
import Image from 'next/image';
import React from "react";
import { useTranslations } from "next-intl";
import { WalkedoButton } from "../../../components/button/button";
import { Link, usePathname } from "@/i18n/navigation";
import { NavbarItems } from "../../../lib/navbar-items";

export interface GlobalNavbarProps {
    /** CSS module class that decides at which width this navbar is shown. */
    className: string;
}

export const GlobalNavbar = (props: GlobalNavbarProps) => {
    const t = useTranslations('nav');
    // usePathname from next-intl returns the path without the locale prefix,
    // so these comparisons stay locale-agnostic.
    const pathname = usePathname();

    const walkedoBrandingDivider = 15;
    const spiritbornBrandingDivider = 14;
    const walkedoLogoDivider = 20;

    const isSpiritborn = pathname === '/northern-Inuit-dog';

    return (
        <>
            <nav className={`${Styles.navbar} ${props.className}`}>
                <div className={Styles.navbarContainer}>
                    <div className={`${Styles.navbarListSection} ${Styles.navbarLogoSection}`}>
                        <ul className={Styles.navbarList}>
                            <li>
                                <Link href={'/'} aria-label={t('home')}>
                                    <div>
                                        <Image src={'/images/brand/walkedo-logo.svg'} className={Styles.navbarIcon} width={1592 / walkedoLogoDivider}
                                               height={1677 / walkedoLogoDivider} alt={t('logoAlt')}/>
                                    </div>
                                </Link>
                            </li>
                            <li className={Styles.navbarNoMargin}>
                                <Link href={'/'} className={Styles.brandingWrapper} aria-label={t('home')}>
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
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className={Styles.navbarListSection}>
                        <ul className={Styles.navbarList}>
                            {NavbarItems.map(item => (
                                <li key={item.key}
                                    className={`${pathname === item.uri ? Styles.navbarItemActive : Styles.navbarItem}`}>
                                    <Link href={item.uri}
                                          aria-current={pathname === item.uri ? 'page' : undefined}>
                                        {t(item.key)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={Styles.navbarSignupSection}>
                        <Link href={'/aanmelden?service=uitlaten'}>
                            <WalkedoButton label={t('signup')}/>
                        </Link>
                    </div>
                </div>
            </nav>
            <div className={Styles.navbarShadow}></div>
        </>
    )
}

export default GlobalNavbar
