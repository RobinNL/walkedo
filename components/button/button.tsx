export interface ButtonProps {
    label: string;
}

import Styles from './button.module.scss';

export const WalkedoButton = (props: ButtonProps) => {

    const style = {
        button: {
            padding: '12px',
        }
    }

    return (<button className={Styles.button}>{ props.label }</button>)

}