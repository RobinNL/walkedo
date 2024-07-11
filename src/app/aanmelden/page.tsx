'use client'

import Image from "next/image";
import styles from "./aanmelden.module.scss";
import { useRouter } from "next/navigation";

export default function Page() {

    const router = useRouter();

    return (
        <main className={styles.main}>
            <div>
                <p>Aanmelden</p>
            </div>
        </main>
    );
}
