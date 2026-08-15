'use client'

import Styles from "./aanmelden.module.scss";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import SignupForm, { type SignupService } from "./signup-form";

const SERVICES: SignupService[] = ['uitlaten', 'casting', 'puppy'];

export default function SignupPage() {
    const t = useTranslations('signup');

    const requested = useSearchParams().get('service');
    const service: SignupService =
        SERVICES.includes(requested as SignupService) ? (requested as SignupService) : 'uitlaten';

    return (
        <main className={'container'}>
            <div className={Styles.formWrapper}>
                <h1>{t('title')}</h1>
                <SignupForm service={service}/>
            </div>
        </main>
    );
}
