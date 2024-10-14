import Image from "next/image";

export interface ListProps {
    items: string[];
}

import Styles from './list.module.scss';

export const WalkedoList = (props: ListProps) => {

    return (
        <ul className={Styles.benefitList}>
            {
                props.items.map(item => (<li key={item}>
                    <Image src={'/images/dog-paw.svg'} className={Styles.benefitListIcon}
                           alt={'honden poot'} width={20} height={20}/>
                    {item}
                </li>))
            }
        </ul>
    )

}