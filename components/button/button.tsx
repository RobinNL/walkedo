export interface ButtonProps {
    label: string;
    disabled: boolean;
}

import Styles from './button.module.scss';

export const WalkedoButton = (props: ButtonProps) => {

    return (<button disabled={props.disabled} className={ `${Styles.button} ${props.disabled ? Styles.disabledButton : ''}`}>{ props.label }</button>)

}