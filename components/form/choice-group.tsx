import React from "react";
import Styles from "./form.module.scss";

export interface ChoiceOption {
    value: string;
    label: string;
    description?: string;
}

export interface ChoiceGroupProps {
    /** Shared input name, and the stem for each option's id. */
    name: string;
    type: "checkbox" | "radio";
    options: ChoiceOption[];
    /** The selected value(s); a radio group simply never holds more than one. */
    selected: string[];
    onToggle: (value: string) => void;
    label?: string;
    error?: string;
    requiredLabel?: string;
}

/**
 * The service checklist and the dog's yes/no questions.
 *
 * The native input stays in the accessibility tree and keeps its keyboard
 * behaviour — it is only visually replaced by the styled indicator beside it,
 * because a checkbox cannot be given the site's colours directly.
 */
export const WalkedoChoiceGroup = ({
    name, type, options, selected, onToggle, label, error, requiredLabel,
}: ChoiceGroupProps) => {
    const labelId = `${name}-label`;
    const errorId = `${name}-error`;

    return (
        <div
            className={Styles.formGroup}
            role={type === "radio" ? "radiogroup" : "group"}
            aria-labelledby={label ? labelId : undefined}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={error ? true : undefined}
        >
            {label ? (
                <span className={Styles.formLabel} id={labelId}>
                    {label}
                    {requiredLabel ? (
                        <span className={Styles.formRequired}>
                            <span aria-hidden={true}>*</span>
                            <span className={Styles.visuallyHidden}>{` ${requiredLabel}`}</span>
                        </span>
                    ) : null}
                </span>
            ) : null}

            <div className={Styles.choiceList}>
                {options.map((option) => (
                    <label className={Styles.choice} key={option.value}>
                        <input
                            className={Styles.choiceInput}
                            type={type}
                            id={`${name}-${option.value}`}
                            name={name}
                            value={option.value}
                            checked={selected.includes(option.value)}
                            onChange={() => onToggle(option.value)}
                        />
                        <span
                            className={`${Styles.choiceIndicator} ${type === "radio" ? Styles.choiceIndicatorRound : ""}`}
                            aria-hidden={true}
                        />
                        <span className={Styles.choiceText}>
                            <span className={Styles.choiceLabel}>{option.label}</span>
                            {option.description
                                ? <span className={Styles.choiceDescription}>{option.description}</span>
                                : null}
                        </span>
                    </label>
                ))}
            </div>

            {error ? <p className={Styles.fieldError} id={errorId}>{error}</p> : null}
        </div>
    );
};
