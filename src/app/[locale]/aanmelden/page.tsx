import React, { Suspense } from "react";
import SignupPage from "./sign-up";

export default function Page() {
    return (
        <Suspense>
            <SignupPage/>
        </Suspense>
    );
}
