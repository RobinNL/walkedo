'use client'
import Styles from "./aanmelden.module.scss";
import { WalkedoButton } from "../../../components/button/button";
import { FormEvent, SetStateAction, useRef, useState } from "react";
import { Sriracha } from "next/dist/compiled/@next/font/dist/google";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

type FormTargetType = 'casting' | string | null | 'uitlaatservice';

export default function Page() {


    const [firstName, setFirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNr, setPhoneNr] = useState('');
    const [address, setAddress] = useState('');
    const [dogSummary, setDogSummary] = useState('');
    const [projectSummary, setProjectSummary] = useState('');

    // States
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    // Is the form for casting
    const searchParams = useSearchParams()
    const formTarget: FormTargetType = searchParams.get('target');

    const doSetFormVal = (val: FormEvent<HTMLInputElement | HTMLTextAreaElement>, stateChanger: SetStateAction<any>) => {
        stateChanger((val.target as any).value)
    }

    const formIsValid = () => {
        return (firstName !== '' && lastName !== '' && email !== '' && address !== '' && dogSummary !== '')
    }

    const submitForm = async (event: any) => {
        event.preventDefault();
        // Collect the form inputs and send using node-mailer
        setLoading(true);
        const response = await fetch('/api/aanmelden', {
            method: 'post',
            body: JSON.stringify({firstName: firstName, lastName: lastName, email: email, phoneNr: phoneNr, address: address, dogSummary: dogSummary, projectSummary: projectSummary}),
        });
        setLoading(false);
        if (response.status === 200) {
            setSuccess(true);
        } else {
            setError(true);
        }
    }

    return (
        <main className={'container'}>
            <div className={Styles.formWrapper}>
                <h1>Aanmelden</h1>
                {
                    formTarget === 'casting' ?
                        <p>
                            Schrijf je in voor de casting. Ik begeleid de hond bij je productie. De Northern Inuit dog past heel goed bij een fantasy setting en het ras is
                            eerder ingezet bij de series Game of Thrones.
                        </p> :
                        <p>
                            Ik kan niet wachten om je hond te leren kennen. Meld je vrijblijvend aan voor een
                            kennismakingsgesprek. Dan loop ik je
                            rustig door alle stappen en kijken we samen naar de services die het beste bij jou en je
                            hond
                            passen.
                        </p>
                }

                <form name={'aanmelden'} onSubmit={(e) => submitForm(e)} className={Styles.formElement}
                      noValidate={true}>

                    <div className={Styles.formGroup}>
                        <label className={Styles.formLabel}>Voornaam</label>
                        <input className={Styles.formField} onInput={(val) => doSetFormVal(val, setFirstName)}
                               required={true} type='text' placeholder={'Voornaam'}/>
                    </div>

                    <div className={Styles.formGroup}>
                        <label className={Styles.formLabel}>Achternaam</label>
                        <input className={Styles.formField} onInput={(val) => doSetFormVal(val, setlastName)}
                               required={true} type='text' placeholder={'Achternaam'}/>
                    </div>

                    <div className={Styles.formGroup}>
                        <label className={Styles.formLabel}>Email</label>
                        <input className={Styles.formField} onInput={(val) => doSetFormVal(val, setEmail)}
                               required={true} type='email' placeholder={'Email'}/>
                    </div>

                    <div className={Styles.formGroup}>
                        <label className={Styles.formLabel}>Telefoon nummer</label>
                        <input className={Styles.formField} onInput={(val) => doSetFormVal(val, setPhoneNr)} type='tel'
                               placeholder={'Telefoon nummer'}/>
                    </div>

                    <div className={Styles.formGroup}>
                        <label className={Styles.formLabel}>Adres</label>
                        <input className={Styles.formField} onInput={(val) => doSetFormVal(val, setAddress)}
                               required={true} type='text' placeholder={'Bijvoorbeeld hondenlaan 2, 1111HD Arnhem'}/>
                    </div>

                    {
                        formTarget === 'casting' ?
                            <div className={Styles.formGroup}>
                                <label className={Styles.formLabel}>Beschijving project</label>
                                <textarea className={Styles.formField} required={true}
                                          onInput={(val) => doSetFormVal(val, setProjectSummary)}
                                          placeholder={'Beschrijf kort het project waar je een hond voor zoekt'}/>
                            </div> :
                            <div className={Styles.formGroup}>
                                <label className={Styles.formLabel}>Korte beschijving hond(en)</label>
                                <textarea className={Styles.formField} required={true}
                                          onInput={(val) => doSetFormVal(val, setDogSummary)}
                                          placeholder={'Wat maakt jouw hond uniek'}/>
                            </div>
                    }

                    <WalkedoButton disabled={!formIsValid() || loading} label={'Verzenden'} type={'submit'}/>

                    {
                        success ?
                            <div><p>Woef! We hebben je aanmelding ontvangen. Hopelijk tot snel :)</p></div> : null
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
        </main>
    );
}
