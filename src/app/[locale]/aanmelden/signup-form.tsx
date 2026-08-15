'use client'

import Styles from "./aanmelden.module.scss";
import React, { FormEvent, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { WalkedoButton } from "../../../../components/button/button";

export type SignupService = 'uitlaten' | 'casting' | 'puppy';

/** The one field that differs per service, and the API route it posts to. */
const SERVICE_FIELD: Record<SignupService, string> = {
    uitlaten: 'dogSummary',
    casting: 'projectSummary',
    puppy: 'owner',
};

const EMPTY = {
    firstName: '',
    lastName: '',
    email: '',
    phoneNr: '',
    address: '',
    detail: '',
};

export default function SignupForm({ service }: { service: SignupService }) {
    const t = useTranslations('signup');
    const locale = useLocale();

    const [values, setValues] = useState(EMPTY);
    // Honeypot; hidden from real users, so anything in it means a bot.
    const [website, setWebsite] = useState('');

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const setField = (field: keyof typeof EMPTY) =>
        (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setValues((current) => ({
                ...current,
                [field]: (event.target as HTMLInputElement | HTMLTextAreaElement).value,
            }));

    const formIsValid = () =>
        values.firstName !== '' && values.lastName !== '' && values.email !== ''
        && values.address !== '' && values.detail !== '';

    const submitForm = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(false);
        setLoading(true);

        const response = await fetch(`/api/aanmelden/${service}`, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                phoneNr: values.phoneNr,
                address: values.address,
                [SERVICE_FIELD[service]]: values.detail,
                locale,
                website,
            }),
        });

        setLoading(false);
        if (response.status === 200) {
            setSuccess(true);
            setValues(EMPTY);
        } else {
            setError(true);
        }
    }

    return (
        <div className={Styles.formWrapper}>
            <p>{t(`intro.${service}`)}</p>

            <form name={'aanmelden'} onSubmit={submitForm} className={Styles.formElement} noValidate={true}>

                <div className={Styles.formGroup}>
                    <label className={Styles.formLabel} htmlFor={'firstName'}>{t('firstName')}</label>
                    <input className={Styles.formField} id={'firstName'} value={values.firstName}
                           onInput={setField('firstName')}
                           required={true} type='text' placeholder={t('firstName')}/>
                </div>

                <div className={Styles.formGroup}>
                    <label className={Styles.formLabel} htmlFor={'lastName'}>{t('lastName')}</label>
                    <input className={Styles.formField} id={'lastName'} value={values.lastName}
                           onInput={setField('lastName')}
                           required={true} type='text' placeholder={t('lastName')}/>
                </div>

                <div className={Styles.formGroup}>
                    <label className={Styles.formLabel} htmlFor={'email'}>{t('email')}</label>
                    <input className={Styles.formField} id={'email'} value={values.email}
                           onInput={setField('email')}
                           required={true} type='email' placeholder={t('email')}/>
                </div>

                <div className={Styles.formGroup}>
                    <label className={Styles.formLabel} htmlFor={'phoneNr'}>{t('phone')}</label>
                    <input className={Styles.formField} id={'phoneNr'} value={values.phoneNr}
                           onInput={setField('phoneNr')}
                           type='tel' placeholder={t('phone')}/>
                </div>

                <div className={Styles.formGroup}>
                    <label className={Styles.formLabel} htmlFor={'address'}>{t('address')}</label>
                    <input className={Styles.formField} id={'address'} value={values.address}
                           onInput={setField('address')}
                           required={true} type='text' placeholder={t('addressPlaceholder')}/>
                </div>

                <div className={Styles.formGroup}>
                    <label className={Styles.formLabel} htmlFor={'detail'}>{t(`detailLabel.${service}`)}</label>
                    <textarea className={Styles.formField} id={'detail'} value={values.detail}
                              onInput={setField('detail')}
                              required={true} placeholder={t(`detailPlaceholder.${service}`)}/>
                </div>

                <div aria-hidden={true} style={{ position: 'absolute', left: '-9999px' }}>
                    <label htmlFor={'website'}>Website</label>
                    <input id={'website'} name={'website'} type={'text'} tabIndex={-1} autoComplete={'off'}
                           value={website} onInput={(e) => setWebsite((e.target as HTMLInputElement).value)}/>
                </div>

                <WalkedoButton disabled={!formIsValid() || loading} label={t('submit')} type={'submit'}/>

                {success ? <div role={'status'}><p>{t(`success.${service}`)}</p></div> : null}

                {error ?
                    <div role={'alert'} className={Styles.formResultErrorWrapper}><p>{t('error')}</p></div>
                    : null}

                {loading ? <div role={'status'}><p>{t('loading')}</p></div> : null}

            </form>
        </div>
    );
}
