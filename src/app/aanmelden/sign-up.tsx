'use client'
import Styles from "./aanmelden.module.scss";
import React from "react";
import { useSearchParams } from "next/navigation";
import SignUpCasting from "@/app/aanmelden/signup-variations/sign-up-casting";
import SignUpUitlaatService from "@/app/aanmelden/signup-variations/sign-up-uitlaatservice";
import SignUpNortherninuit from "@/app/aanmelden/signup-variations/sign-up-northerninuit";

type FormTargetType = 'casting' | string | null | 'uitlaatservice' | 'northerninuit';

export default function SignupForm() {

    // Get the form origin
    const searchParams = useSearchParams()
    const formTarget: FormTargetType = searchParams.get('service');

    const getCorrectForm = () => {
        switch (formTarget) {
            case 'casting':
                return SignUpCasting()
            case 'uitlaten':
                return SignUpUitlaatService();
            case 'puppy':
                return SignUpNortherninuit();
            default:
                return SignUpUitlaatService();
        }
    }

    return (
            <main className={'container'}>
                <div className={Styles.formWrapper}>
                    <h1>Aanmelden</h1>
                    {
                        getCorrectForm()
                    }
                </div>
            </main>
    );
}