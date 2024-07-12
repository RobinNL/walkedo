import Image from "next/image";
import Styles from "./aanmelden.module.scss";
import { useRouter } from "next/navigation";
import { WalkedoButton } from "../../../components/button/button";
import { FormEvent, SetStateAction, useState } from "react";

export default function Page() {

    const router = useRouter();

    const [firstName, setFirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNr, setPhoneNr] = useState('');
    const [address, setAddress] = useState('');
    const [dogSummary, setDogSummary] = useState('');

    // States
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const doSetFormVal = (val: FormEvent<HTMLInputElement | HTMLTextAreaElement>, stateChanger: SetStateAction<any>) => {
        stateChanger(val.target?.value)
    }

    const formIsValid = () => {
        return (firstName !== '' && lastName !== '' && email !== '' && address !== '' && dogSummary !== '')
    }

    const submitForm = async (event) => {
        event.preventDefault();
        // Collect the form inputs and send using node-mailer
        setLoading(true);
        const response = await fetch('/api/aanmelden', {
            method: 'post',
            body: JSON.stringify({firstName: firstName, lastName: lastName, email: email, phoneNr: phoneNr, address: address, dogSummary: dogSummary}),
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
                <p>
                    Ik kan niet wachten om je hond te leren kennen. Meld je vrijblijvend aan voor een
                    kennismakingsgesprek. Dan loop ik je
                    rustig door alle stappen en kijken we samen naar de services die het beste bij jou en je hond
                    passen.
                </p>

                <form name={'aanmelden'} onSubmit={(e) => submitForm(e)} className={Styles.formElement} noValidate={true}>

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

                    <div className={Styles.formGroup}>
                        <label className={Styles.formLabel}>Korte beschijving hond(en)</label>
                        <textarea className={Styles.formField} required={true}
                                  onInput={(val) => doSetFormVal(val, setDogSummary)} type='text'
                                  placeholder={'Wat maakt jouw hond uniek'}/>
                    </div>

                    <WalkedoButton disabled={!formIsValid() || loading} label={'Verzenden'} type={'submit'}/>

                    {
                        success ?
                            <div><p>Woef! We hebben je aanmelding ontvangen. Hopelijk tot snel :)</p></div> : null
                    }


                    {error ?
                        <div className={Styles.formResultErrorWrapper}><p>Oeps, er is iets misgegaan. Probeer het nogmaals of stuur een bericht naar
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
