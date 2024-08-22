export interface ButtonProps {
    label: string;
    disabled: boolean;
    fullWidth?: boolean;
}

import Styles from './button.module.scss';

export const WalkedoButton = (props: ButtonProps) => {

    return (<button disabled={props.disabled} className={ `${Styles.button} ${props.fullWidth ? Styles.fullWidthButton : ''} ${props.disabled ? Styles.disabledButton : ''}`}>{ props.label }</button>)

}