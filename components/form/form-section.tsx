import React from "react";
import Styles from "./form.module.scss";

export interface FormSectionProps {
    /** Position in the form, shown in the numbered circle. */
    step: number;
    title: string;
    description?: string;
    children: React.ReactNode;
}

/**
 * One labelled group of the signup form. A real <fieldset>/<legend> rather than
 * a styled heading, so assistive technology announces which group a field
 * belongs to when the visitor tabs into it.
 */
export const WalkedoFormSection = ({ step, title, description, children }: FormSectionProps) => (
    <fieldset className={Styles.formSection}>
        <legend className={Styles.formSectionLegend}>
            <span className={Styles.formSectionStep} aria-hidden={true}>{step}</span>
            <span className={Styles.formSectionTitle}>{title}</span>
        </legend>
        {description ? <p className={Styles.formSectionDescription}>{description}</p> : null}
        <div className={Styles.fieldGrid}>{children}</div>
    </fieldset>
);
