import React, { Suspense } from "react";
import SignupForm from "@/app/aanmelden/sign-up";

export default function Page() {

    return (
        <Suspense>
           <SignupForm />
        </Suspense>
    );
}
