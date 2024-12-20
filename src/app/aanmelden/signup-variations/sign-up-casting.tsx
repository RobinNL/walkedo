'use client'
import Styles from "./aanmelden.module.scss";
import { WalkedoButton } from "../../../../components/button/button";
import React, { FormEvent, SetStateAction, useState } from "react";

export default function SignUpCasting() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNr, setPhoneNr] = useState('');
    const [address, setAddress] = useState('');
    const [projectSummary, setProjectSummary] = useState('');

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
        setProjectSummary('');
    }

    const formIsValid = () => {
        return (firstName !== '' && lastName !== '' && email !== '' && address !== '' && projectSummary !== '')
    }

    const submitForm = async (event: any) => {
        event.preventDefault();
        setError(false);
        // Collect the form inputs and send using node-mailer
        setLoading(true);
        const response = await fetch('/api/aanmelden/casting', {
            method: 'post',
            body: JSON.stringify({firstName: firstName, lastName: lastName, email: email, phoneNr: phoneNr, address: address, projectSummary: projectSummary}),
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
                        Schrijf je in voor de casting. Ik begeleid de hond bij je productie. De Northern Inuit
                        dog past heel goed bij een fantasy setting en het ras is
                        eerder ingezet bij de series Game of Thrones.
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
                            <label className={Styles.formLabel}>Beschijving project</label>
                            <textarea className={Styles.formField} required={true}
                                      value={projectSummary}
                                      onInput={(val) => doSetFormVal(val, setProjectSummary)}
                                      placeholder={'Beschrijf kort het project waar je een hond voor zoekt'}/>
                        </div>

                        <WalkedoButton disabled={!formIsValid() || loading} label={'Verzenden'} type={'submit'}/>

                        {
                            success ?
                                <div><p>Woef! Het script is al praktisch geschreven. We hebben je aanmelding ontvangen en nemen contact met je op</p></div> : null
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