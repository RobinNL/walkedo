'use client'

import Image from "next/image";
import Styles from "./documenten.module.scss";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Page() {

    const router = useRouter();

    return (
        <main>
            <div className={Styles.docWrapper}>
                <h1>
                    Documenten
                </h1>
                <div className={Styles.docSectionExplain}>
                    <p>
                        Bij de intake zullen we enkele documenten doornemen die van belang zijn voor een veilige en
                        succesvolle samenwerking voor jou en je hond. Hier kan je deze documenten alvast bekijken.
                        Bij
                        vragen kan je altijd contact met mij opnemen.
                    </p>
                </div>
                <ul className={Styles.docList}>
                    <li>
                        <Link className={Styles.docDownloadBtn} href={'/files/intakeformulier.pdf'}
                              target={'_blank'}>Intake formulier (.pdf)</Link>
                    </li>
                    <li>
                        <Link className={Styles.docDownloadBtn} href={'/files/leveringsvoorwaarden.pdf'}
                              target={'_blank'}>Leveringsvoorwaarden (.pdf)</Link>
                    </li>
                    <li>
                        <Link className={Styles.docDownloadBtn} href={'/files/sleutelcontract.pdf'}
                              target={'_blank'}>Sleutelcontract (.pdf)</Link>
                    </li>
                </ul>
            </div>
        </main>
    );
}
