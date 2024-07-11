'use client'

import Image from "next/image";
import styles from "./uitlaatservice.module.css";
import { useRouter } from "next/navigation";

export default function Page() {

    const router = useRouter();

    return (
    <main className={styles.main}>
      <div>
        <p>uitlaat</p>
      </div>
    </main>
  );
}
