'use client'

import Styles from "./aanmelden.module.scss";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import SignupForm from "./signup-form";
import { parseServices } from "../../../../lib/signup-fields";

export default function SignupPage() {
    const t = useTranslations('signup');

    // ?service= no longer picks a form — there is only one — it pre-ticks the
    // matching box, so every link that used to point at a variant still lands
    // the visitor on the right starting point.
    const initialServices = parseServices(useSearchParams().get('service'));

    return (
        <div className={'container'}>
            <div className={Styles.formWrapper}>
                <h1 className={Styles.formHeader}>{t('title')}</h1>
                <p className={Styles.formIntro}>{t('intro')}</p>
                <SignupForm initialServices={initialServices}/>
            </div>
        </div>
    );
}
