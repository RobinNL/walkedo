import React from "react";
import Styles from "./form.module.scss";

export interface TextFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    onBlur?: () => void;
    /** Already-translated message. Its presence is what marks the field invalid. */
    error?: string;
    requiredLabel?: string;
    type?: "text" | "email" | "tel";
    autoComplete?: string;
    inputMode?: "numeric" | "text";
    placeholder?: string;
    maxLength?: number;
    multiline?: boolean;
    half?: boolean;
}

/**
 * A labelled text input or textarea, owning the label/error/aria wiring so no
 * call site can forget it. Every field is required, so the marker is rendered
 * whenever a `requiredLabel` is supplied rather than being opt-in per field.
 */
export const WalkedoTextField = ({
    id, label, value, onChange, onBlur, error, requiredLabel,
    type = "text", autoComplete, inputMode, placeholder, maxLength, multiline, half,
}: TextFieldProps) => {
    const errorId = `${id}-error`;

    const shared = {
        id,
        name: id,
        value,
        onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            onChange(event.target.value),
        onBlur,
        placeholder,
        maxLength,
        autoComplete,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
        className: `${Styles.formField} ${error ? Styles.formFieldInvalid : ""}`,
    };

    return (
        <div className={`${Styles.formGroup} ${half ? Styles.formGroupHalf : ""}`}>
            <label className={Styles.formLabel} htmlFor={id}>
                {label}
                {requiredLabel ? (
                    <span className={Styles.formRequired}>
                        <span aria-hidden={true}>*</span>
                        <span className={Styles.visuallyHidden}>{` ${requiredLabel}`}</span>
                    </span>
                ) : null}
            </label>

            {multiline
                ? <textarea {...shared} rows={5}/>
                : <input {...shared} type={type} inputMode={inputMode}/>}

            {error ? <p className={Styles.fieldError} id={errorId}>{error}</p> : null}
        </div>
    );
};
