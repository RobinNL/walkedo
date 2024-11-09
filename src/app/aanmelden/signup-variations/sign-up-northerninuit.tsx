'use client'
import Styles from "./aanmelden.module.scss";
import { WalkedoButton } from "../../../../components/button/button";
import React, { FormEvent, SetStateAction, useState } from "react";

export default function SignUpNortherninuit() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNr, setPhoneNr] = useState('');
    const [address, setAddress] = useState('');
    const [ownerStory, setOwnerStory] = useState('');

    // States
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const doSetFormVal = (val: FormEvent<HTMLInputElement | HTMLTextAreaElement>, stateChanger: SetStateAction<any>) => {
        stateChanger((val.target as any).value)
    }

    const resetForm = () => {
        setFirstName('');
        setlastName('');
        setEmail('');
        setPhoneNr('');
        setAddress('');
        setOwnerStory('');
    }

    const formIsValid = () => {
        return (firstName !== '' && lastName !== '' && email !== '' && address !== '' && ownerStory !== '')
    }

    const submitForm = async (event: any) => {
        event.preventDefault();
        setError(false);
        // Collect the form inputs and send using node-mailer
        setLoading(true);
        const response = await fetch('/api/aanmelden/puppy', {
            method: 'post',
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNr: phoneNr,
                address: address,
                owner: ownerStory
            }),
        });
        setLoading(false);
        if (response.status === 200) {
            setSuccess(true);
            resetForm();
        } else {
            setError(true);
        }
    }

    return (
        <div className={Styles.formWrapper}>
            <p>
                Meld je interesse in een Northern Inuit puppy. Je zit nergens aan vast, de definitieve lijst volgt nog.
            </p>

            <form name={'aanmelden'} onSubmit={(e) => submitForm(e)} className={Styles.formElement}
                  noValidate={true}>

                <div className={Styles.formGroup}>
                    <label className={Styles.formLabel}>Voornaam</label>
                    <input className={Styles.formField} value={firstName} onInput={(val) => doSetFormVal(val, setFirstName)}
                           required={true} type='text' placeholder={'Voornaam'}/>
                </div>

                <div className={Styles.formGroup}>
                    <label className={Styles.formLabel}>Achternaam</label>
                    <input className={Styles.formField} value={lastName} onInput={(val) => doSetFormVal(val, setlastName)}
                           required={true} type='text' placeholder={'Achternaam'}/>
                </div>

                <div className={Styles.formGroup}>
                    <label className={Styles.formLabel}>Email</label>
                    <input className={Styles.formField} value={email} onInput={(val) => doSetFormVal(val, setEmail)}
                           required={true} type='email' placeholder={'Email'}/>
                </div>

                <div className={Styles.formGroup}>
                    <label className={Styles.formLabel}>Telefoon nummer</label>
                    <input className={Styles.formField} value={phoneNr} onInput={(val) => doSetFormVal(val, setPhoneNr)}
                           type='tel'
                           placeholder={'Telefoon nummer'}/>
                </div>

                <div className={Styles.formGroup}>
                    <label className={Styles.formLabel}>Adres</label>
                    <input className={Styles.formField} value={address} onInput={(val) => doSetFormVal(val, setAddress)}
                           required={true} type='text'
                           placeholder={'Bijvoorbeeld hondenlaan 2, 1111HD Arnhem'}/>
                </div>
                <div className={Styles.formGroup}>
                    <label className={Styles.formLabel}>Beschijf je situatie</label>
                    <textarea className={Styles.formField} value={ownerStory} required={true}
                              onInput={(val) => doSetFormVal(val, setOwnerStory)}
                              placeholder={'Waarom zou je een goede eigenaar(esse) zijn voor een pup?'}/>
                </div>

                <WalkedoButton disabled={!formIsValid() || loading} label={'Verzenden'} type={'submit'}/>

                {
                    success ?
                        <div><p>Woef! Zo klinkt jouw puppy als je over een paar jaar thuis komt. We hebben je aanmelding ontvangen en nemen contact met je op.</p></div> : null
                }


                {error ?
                    <div className={Styles.formResultErrorWrapper}><p>Oeps, er is iets misgegaan. Probeer het
                        nogmaals of stuur een bericht naar
                        woof@walkedo.com</p></div>
                    : null
                }

                {
                    loading ?
                        <div><p>Laden.. een momentje</p></div> : null
                }

            </form>

        </div>
    );
}