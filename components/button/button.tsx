export interface ButtonProps {
    label: string;
    disabled?: boolean;
    onPress?: Function;
    type?: "submit" | 'reset' | 'button' | undefined;
    fullWidth?: boolean;
}

import Styles from './button.module.scss';

export const WalkedoButton = (props: ButtonProps) => {

    return (<button disabled={props.disabled} type={props.type} className={ `${Styles.button} ${props.fullWidth ? Styles.fullWidthButton : ''} ${props.disabled ? Styles.disabledButton : ''}`}>{ props.label }</button>)

}