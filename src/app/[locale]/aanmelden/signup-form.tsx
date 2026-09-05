'use client'

import Styles from "./aanmelden.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { WalkedoButton } from "../../../../components/button/button";
import { WalkedoFormSection } from "../../../../components/form/form-section";
import { WalkedoTextField } from "../../../../components/form/text-field";
import { WalkedoChoiceGroup } from "../../../../components/form/choice-group";
import {
    EMPTY_VALUES,
    SIGNUP_SERVICES,
    activeFields,
    activeSections,
    isValidEmail,
    type FieldName,
    type FieldSpec,
    type SignupService,
} from "../../../../lib/signup-fields";

/** Error values are message keys, so the validator itself stays locale-free. */
type ErrorKey = "required" | "invalidEmail" | "chooseOne";
type Errors = Partial<Record<FieldName | "services", ErrorKey>>;

/** The id of the control an error should send focus to. */
function controlId(field: FieldSpec): string {
    return field.options ? `${field.name}-${field.options[0]}` : field.name;
}

function validate(services: SignupService[], values: Record<FieldName, string>): Errors {
    const errors: Errors = {};

    if (services.length === 0) {
        errors.services = "chooseOne";
    }

    for (const field of activeFields(services)) {
        if (values[field.name].trim() === "") {
            errors[field.name] = "required";
        } else if (field.kind === "email" && !isValidEmail(values[field.name].trim())) {
            errors[field.name] = "invalidEmail";
        }
    }

    return errors;
}

export default function SignupForm({ initialServices }: { initialServices: SignupService[] }) {
    const t = useTranslations('signup');
    const locale = useLocale();

    const [services, setServices] = useState<SignupService[]>(initialServices);
    const [values, setValues] = useState<Record<FieldName, string>>(EMPTY_VALUES);
    // Nothing is flagged until the first submit; validating while someone is
    // still typing their email reads as nagging rather than helping.
    const [submitted, setSubmitted] = useState(false);
    // Honeypot; hidden from real users, so anything in it means a bot.
    const [website, setWebsite] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const successRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (status === 'success') successRef.current?.focus();
    }, [status]);

    /**
     * Errors are derived, not stored. Nothing is flagged until the first submit
     * attempt; after that the list is simply what `validate` says about the
     * answers currently in the form.
     *
     * This was previously `useState` kept in step by a per-field re-check on
     * blur, which read `values` and `services` through two refs assigned during
     * render. React 19 rejects that on two counts, and is right on both: a
     * render-phase ref write is unsafe under concurrent rendering
     * (`react-hooks/refs`), and syncing state that is a pure function of other
     * state belongs in render, not an effect (`react-hooks/set-state-in-effect`).
     *
     * The refs existed to work around a real bug: a blur handler closes over
     * the render that created it, so when a change and a blur landed in the
     * same batch — exactly what browser autofill does — the handler validated
     * the previous value and left a stale error on screen. Deriving removes
     * that race at the source rather than racing it back, and an error now
     * clears as soon as the field is right instead of waiting for a blur that
     * autofill never sends.
     */
    const errors: Errors = submitted ? validate(services, values) : {};

    const sections = activeSections(services);

    const setField = (field: FieldName) => (value: string) => {
        setValues((current) => ({ ...current, [field]: value }));
    };

    const toggleService = (value: string) => {
        const service = value as SignupService;
        setServices((current) => {
            const next = current.includes(service)
                ? current.filter((s) => s !== service)
                : SIGNUP_SERVICES.filter((s) => s === service || current.includes(s));
            // Dropping a service hides its fields, so its errors have to go
            // too, or the summary would count errors nobody can see. Nothing to
            // do for that here any more: `errors` is derived from `services`,
            // so returning the new list is what clears them.
            return next;
        });
    };

    const submitForm = async (event: React.FormEvent) => {
        event.preventDefault();
        setSubmitted(true);

        // Computed here as well as in render, because this handler has to act
        // on the result now -- the re-render that `setSubmitted` schedules has
        // not happened yet.
        const found = validate(services, values);

        if (Object.keys(found).length > 0) {
            const firstField = activeFields(services).find((field) => found[field.name]);
            const targetId = found.services
                ? `services-${SIGNUP_SERVICES[0]}`
                : firstField && controlId(firstField);
            if (targetId) document.getElementById(targetId)?.focus();
            return;
        }

        setStatus('loading');

        // Only the fields their choice made relevant — a service ticked and
        // then unticked leaves nothing behind in the payload.
        const answers = activeFields(services).reduce(
            (payload, field) => ({ ...payload, [field.name]: values[field.name].trim() }),
            {} as Record<string, string>,
        );

        try {
            const response = await fetch('/api/aanmelden', {
                method: 'post',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...answers, services, locale, website }),
            });
            setStatus(response.status === 200 ? 'success' : 'error');
        } catch {
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <div className={Styles.formSuccess} role={'status'} tabIndex={-1} ref={successRef}>
                <h2>{t('success.title')}</h2>
                <p>{t('success.body')}</p>
            </div>
        );
    }

    const errorMessage = (key?: ErrorKey) => (key ? t(`errors.${key}`) : undefined);

    const renderField = (field: FieldSpec) => {
        if (field.options) {
            return (
                <WalkedoChoiceGroup
                    key={field.name}
                    name={field.name}
                    type={'radio'}
                    label={t(`fields.${field.name}.label`)}
                    requiredLabel={t('required')}
                    options={field.options.map((option) => ({
                        value: option,
                        label: t(`options.${field.name}.${option}`),
                    }))}
                    selected={[values[field.name]]}
                    onToggle={setField(field.name)}
                    error={errorMessage(errors[field.name])}
                />
            );
        }

        return (
            <WalkedoTextField
                key={field.name}
                id={field.name}
                label={t(`fields.${field.name}.label`)}
                requiredLabel={t('required')}
                placeholder={t(`fields.${field.name}.placeholder`)}
                value={values[field.name]}
                onChange={setField(field.name)}
                error={errorMessage(errors[field.name])}
                type={field.kind === 'email' ? 'email' : field.kind === 'tel' ? 'tel' : 'text'}
                multiline={field.kind === 'textarea'}
                autoComplete={field.autoComplete}
                inputMode={field.inputMode}
                maxLength={field.maxLength}
                half={field.half}
            />
        );
    };

    const invalidCount = Object.keys(errors).length;

    return (
        <form name={'aanmelden'} onSubmit={submitForm} className={Styles.formElement} noValidate={true}>

            <WalkedoFormSection
                step={1}
                title={t('sections.services.title')}
                description={t('sections.services.description')}
            >
                <WalkedoChoiceGroup
                    name={'services'}
                    type={'checkbox'}
                    options={SIGNUP_SERVICES.map((service) => ({
                        value: service,
                        label: t(`services.${service}.label`),
                        description: t(`services.${service}.description`),
                    }))}
                    selected={services}
                    onToggle={toggleService}
                    error={errorMessage(errors.services)}
                />
            </WalkedoFormSection>

            {sections.map((section, index) => (
                <WalkedoFormSection
                    key={section.key}
                    step={index + 2}
                    title={t(`sections.${section.key}.title`)}
                    description={section.key === 'dog' ? t('sections.dog.description') : undefined}
                >
                    {section.fields.map(renderField)}
                </WalkedoFormSection>
            ))}

            <div aria-hidden={true} style={{ position: 'absolute', left: '-9999px' }}>
                <label htmlFor={'website'}>Website</label>
                <input id={'website'} name={'website'} type={'text'} tabIndex={-1} autoComplete={'off'}
                       value={website} onInput={(e) => setWebsite((e.target as HTMLInputElement).value)}/>
            </div>

            <WalkedoButton disabled={status === 'loading'} label={t('submit')} type={'submit'} fullWidth={true}/>

            {submitted && invalidCount > 0 ? (
                <div role={'alert'} className={Styles.formResultErrorWrapper}>
                    <p>{t('errors.summary')}</p>
                </div>
            ) : null}

            {status === 'error' ? (
                <div role={'alert'} className={Styles.formResultErrorWrapper}><p>{t('error')}</p></div>
            ) : null}

            {status === 'loading' ? <div role={'status'}><p>{t('loading')}</p></div> : null}

        </form>
    );
}
