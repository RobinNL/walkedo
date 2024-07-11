'use client'

import Image from "next/image";
import styles from "./opvang.module.scss";
import { useRouter } from "next/navigation";

export default function Page() {

    const router = useRouter();

    return (
    <main className={styles.main}>
      <div>
        <p>opvang is een goed ding</p>
      </div>
    </main>
  );
}
