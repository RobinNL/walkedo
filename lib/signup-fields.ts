/**
 * The signup form's field specification, shared by the client form and the API
 * route.
 *
 * The visitor picks one or more services, and that choice decides which fields
 * apply. Both the browser and the server have to agree on that decision — the
 * browser to know what to render, the server to know what to insist on — so the
 * table lives here rather than being written out twice and drifting apart.
 *
 * This file is imported from a 'use client' component, so it must stay free of
 * anything server-only (no nodemailer, no process.env).
 */

export const SIGNUP_SERVICES = ["uitlaten", "opvang", "casting", "puppy"] as const;
export type SignupService = (typeof SIGNUP_SERVICES)[number];

/**
 * The services whose applicants already own the dog in question. Casting and
 * puppy enquiries come from people looking *for* a dog, so asking them to
 * describe theirs makes no sense.
 */
export const DOG_SERVICES: SignupService[] = ["uitlaten", "opvang"];

export type FieldName =
    | "firstName" | "lastName" | "email" | "phoneNr"
    | "street" | "postcode" | "city"
    | "dogName" | "breed" | "age" | "sex" | "neutered" | "dogSummary"
    | "projectSummary"
    | "motivation";

export interface FieldSpec {
    name: FieldName;
    kind: "text" | "email" | "tel" | "textarea" | "radio";
    /** Maps to the HTML autocomplete token, so browsers can fill the field. */
    autoComplete?: string;
    inputMode?: "numeric" | "text";
    /** Radio only. Stable keys — the display words are looked up per locale. */
    options?: readonly string[];
    /** Pairs with its neighbour into two columns on wider screens. */
    half?: boolean;
    /** Guards against a bot pasting a novel into a name field. */
    maxLength: number;
}

export type SectionKey = "person" | "address" | "dog" | "casting" | "puppy";

export interface SectionSpec {
    key: SectionKey;
    /** Absent = always shown; otherwise shown when any of these are selected. */
    shownFor?: SignupService[];
    fields: FieldSpec[];
}

/**
 * Section order here is the order they render in, and the order the validator
 * walks when deciding which field to focus first.
 */
export const SECTIONS: SectionSpec[] = [
    {
        key: "person",
        fields: [
            { name: "firstName", kind: "text", autoComplete: "given-name", maxLength: 100, half: true },
            { name: "lastName", kind: "text", autoComplete: "family-name", maxLength: 100, half: true },
            { name: "email", kind: "email", autoComplete: "email", maxLength: 254, half: true },
            { name: "phoneNr", kind: "tel", autoComplete: "tel", maxLength: 32, half: true },
        ],
    },
    {
        key: "address",
        fields: [
            { name: "street", kind: "text", autoComplete: "address-line1", maxLength: 200 },
            // Dutch postcodes are alphanumeric (1111 HD), so inputMode stays
            // text — "numeric" would give phones a digits-only keypad.
            { name: "postcode", kind: "text", autoComplete: "postal-code", maxLength: 16, half: true },
            { name: "city", kind: "text", autoComplete: "address-level2", maxLength: 100, half: true },
        ],
    },
    {
        key: "dog",
        shownFor: DOG_SERVICES,
        fields: [
            { name: "dogName", kind: "text", maxLength: 100, half: true },
            { name: "breed", kind: "text", maxLength: 100, half: true },
            { name: "age", kind: "text", maxLength: 40 },
            { name: "sex", kind: "radio", options: ["male", "female"], maxLength: 10 },
            { name: "neutered", kind: "radio", options: ["yes", "no"], maxLength: 10 },
            { name: "dogSummary", kind: "textarea", maxLength: 2000 },
        ],
    },
    {
        key: "casting",
        shownFor: ["casting"],
        fields: [{ name: "projectSummary", kind: "textarea", maxLength: 2000 }],
    },
    {
        key: "puppy",
        shownFor: ["puppy"],
        fields: [{ name: "motivation", kind: "textarea", maxLength: 2000 }],
    },
];

export const ALL_FIELDS: FieldSpec[] = SECTIONS.flatMap((section) => section.fields);

export const EMPTY_VALUES: Record<FieldName, string> = ALL_FIELDS.reduce(
    (values, field) => ({ ...values, [field.name]: "" }),
    {} as Record<FieldName, string>,
);

/** The sections that apply to a selection, in render order. */
export function activeSections(services: SignupService[]): SectionSpec[] {
    return SECTIONS.filter(
        (section) => !section.shownFor || section.shownFor.some((s) => services.includes(s)),
    );
}

/**
 * Every field the visitor must fill given their selection. The client renders
 * from this and the server validates against it, so neither can forget a field
 * the other knows about.
 */
export function activeFields(services: SignupService[]): FieldSpec[] {
    return activeSections(services).flatMap((section) => section.fields);
}

/**
 * The ?service= values links may carry. The site's own URLs use the internal
 * keys, but the page slugs (/uitlaatservice, /dagopvang) are the values someone
 * would guess when writing a link by hand, so both resolve.
 */
const SERVICE_ALIASES: Record<string, SignupService> = {
    uitlaten: "uitlaten",
    uitlaatservice: "uitlaten",
    walking: "uitlaten",
    opvang: "opvang",
    dagopvang: "opvang",
    daycare: "opvang",
    boarding: "opvang",
    casting: "casting",
    puppy: "puppy",
    "northern-inuit": "puppy",
    northerninuit: "puppy",
};

/**
 * Reads the ?service= parameter into a selection to pre-tick. Accepts a
 * comma-separated list; unknown values are ignored rather than failing, so a
 * stale link still opens a usable form with nothing selected.
 */
export function parseServices(param: string | null | undefined): SignupService[] {
    if (!param) return [];

    const requested = new Set(
        param
            .split(",")
            .map((value) => SERVICE_ALIASES[value.trim().toLowerCase()])
            .filter((value): value is SignupService => Boolean(value)),
    );

    // Filtered through the canonical list so the result is always in a
    // predictable order, whatever order the query string used.
    return SIGNUP_SERVICES.filter((service) => requested.has(service));
}

export function isSignupService(value: unknown): value is SignupService {
    return SIGNUP_SERVICES.includes(value as SignupService);
}

export function isValidEmail(value: unknown): value is string {
    return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}
