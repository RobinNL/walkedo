'use client'

import styles from './global-footer.module.scss';
import Image from 'next/image';
export interface GlobalFooterProps {

}

export const GlobalFooter = (props: GlobalFooterProps) => {

    return(
        <footer className={styles.footer}>

            <p>Walkedo is een service</p>

        </footer>
    )

}

export default GlobalFooter