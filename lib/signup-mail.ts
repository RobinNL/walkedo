import nodemailer from "nodemailer";
import {
    activeSections,
    activeFields,
    isSignupService,
    isValidEmail,
    type FieldName,
    type SectionKey,
    type SignupService,
} from "./signup-fields";

export const MAIL_LOCALES = ["nl", "en"] as const;
export type MailLocale = (typeof MAIL_LOCALES)[number];

/**
 * One template for every signup. The services the visitor chose are a data
 * point in the body rather than a reason to send a different mail, and the
 * blocks that follow are the ones their choice made relevant — so a walking
 * enquiry carries the dog details and a casting enquiry does not.
 *
 * This copy is deliberately not in the next-intl catalogues: those are loaded
 * per request for the browser, whereas the mail layer picks its language from
 * the submitted body and has no request context to read from.
 */
const COPY: Record<MailLocale, {
    subject: string;
    greeting: (name: string) => string;
    body: string;
    signOff: string;
    interestedIn: string;
    sections: Record<SectionKey, string>;
    labels: Record<FieldName, string>;
    services: Record<SignupService, string>;
    options: Record<string, Record<string, string>>;
}> = {
    nl: {
        subject: "Walkedo Aanmelding",
        greeting: (name) => `Beste ${name},`,
        body: "Bedankt voor je aanmelding. Ik zal zo spoedig mogelijk contact met je opnemen.",
        signOff: "Met vriendelijke groet,",
        interestedIn: "Interesse in",
        sections: {
            person: "Contactgegevens",
            address: "Adres",
            dog: "Over de hond",
            casting: "Project",
            puppy: "Motivatie",
        },
        labels: {
            firstName: "Voornaam",
            lastName: "Achternaam",
            email: "Email",
            phoneNr: "Telefoon",
            street: "Straat en huisnummer",
            postcode: "Postcode",
            city: "Woonplaats",
            dogName: "Naam hond",
            breed: "Ras",
            age: "Leeftijd",
            sex: "Geslacht",
            neutered: "Gecastreerd/gesteriliseerd",
            dogSummary: "Omschrijving",
            projectSummary: "Omschrijving",
            motivation: "Omschrijving",
        },
        services: {
            uitlaten: "Uitlaatservice",
            opvang: "(Dag)opvang",
            casting: "Casting",
            puppy: "Northern Inuit puppy",
        },
        options: {
            sex: { male: "Reu", female: "Teef" },
            neutered: { yes: "Ja", no: "Nee" },
        },
    },
    en: {
        subject: "Walkedo Sign-up",
        greeting: (name) => `Dear ${name},`,
        body: "Thank you for your sign-up. I will get in touch with you as soon as possible.",
        signOff: "Kind regards,",
        interestedIn: "Interested in",
        sections: {
            person: "Contact details",
            address: "Address",
            dog: "About the dog",
            casting: "Project",
            puppy: "Motivation",
        },
        labels: {
            firstName: "First name",
            lastName: "Last name",
            email: "Email",
            phoneNr: "Phone",
            street: "Street and number",
            postcode: "Postcode",
            city: "City",
            dogName: "Dog's name",
            breed: "Breed",
            age: "Age",
            sex: "Sex",
            neutered: "Neutered/spayed",
            dogSummary: "Description",
            projectSummary: "Description",
            motivation: "Description",
        },
        services: {
            uitlaten: "Dog walking",
            opvang: "Boarding & daycare",
            casting: "Casting",
            puppy: "Northern Inuit puppy",
        },
        options: {
            sex: { male: "Male", female: "Female" },
            neutered: { yes: "Yes", no: "No" },
        },
    },
};

/** Escapes user input before it is interpolated into the HTML email body. */
function escapeHtml(value: unknown): string {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/**
 * Best-effort in-memory rate limit. On serverless this is per-instance, so it
 * throttles a single abusive client rather than guaranteeing a global cap —
 * enough to stop the endpoint being trivially used as a mail relay.
 */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_PER_WINDOW) {
        hits.set(ip, recent);
        return true;
    }
    recent.push(now);
    hits.set(ip, recent);
    return false;
}

function clientIp(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    return forwarded?.split(",")[0]?.trim() || "unknown";
}

function resolveLocale(value: unknown): MailLocale {
    return MAIL_LOCALES.includes(value as MailLocale) ? (value as MailLocale) : "nl";
}

function resolveServices(value: unknown): SignupService[] {
    return Array.isArray(value) ? value.filter(isSignupService) : [];
}

/**
 * Renders the submitted answers, grouped exactly as the visitor saw them.
 * Driven by the same section table the form renders from, so a field added
 * there appears here without a second edit.
 */
function detailsHtml(
    services: SignupService[],
    values: Record<string, unknown>,
    copy: (typeof COPY)[MailLocale],
): string {
    return activeSections(services)
        .map((section) => {
            const rows = section.fields
                .map((field) => {
                    const raw = String(values[field.name] ?? "").trim();
                    if (!raw) return "";
                    // Radios travel as stable keys, so the readable word is
                    // chosen here rather than trusting whatever was posted.
                    const display = field.options
                        ? copy.options[field.name]?.[raw] ?? raw
                        : raw;
                    return `<p>${escapeHtml(copy.labels[field.name])}: ${escapeHtml(display)}</p>`;
                })
                .filter(Boolean)
                .join("\n");

            return rows ? `<h3>${escapeHtml(copy.sections[section.key])}</h3>\n${rows}` : "";
        })
        .filter(Boolean)
        .join("\n");
}

export async function handleSignup(request: Request): Promise<Response> {
    if (isRateLimited(clientIp(request))) {
        return Response.json({ message: "Too many requests" }, { status: 429 });
    }

    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return Response.json({ message: "Invalid body" }, { status: 400 });
    }

    // Honeypot: bots fill every field, humans never see this one.
    if (typeof body.website === "string" && body.website.trim() !== "") {
        return Response.json({ message: "Success" }, { status: 200 });
    }

    const services = resolveServices(body.services);
    if (services.length === 0) {
        return Response.json({ message: "No service selected" }, { status: 400 });
    }

    if (!isValidEmail(body.email)) {
        return Response.json({ message: "Invalid email" }, { status: 400 });
    }

    // The browser blocks an incomplete submit, but it is not the only way to
    // reach this route, so the same rule is applied again here.
    const missing = activeFields(services)
        .filter((field) => String(body[field.name] ?? "").trim() === "")
        .map((field) => field.name);

    if (missing.length > 0) {
        return Response.json({ message: "Missing fields", fields: missing }, { status: 400 });
    }

    const locale = resolveLocale(body.locale);
    const copy = COPY[locale];

    const firstName = escapeHtml(body.firstName);
    const serviceList = services.map((service) => copy.services[service]).join(", ");

    const transporter = nodemailer.createTransport({
        host: "smtp.mail.me.com",
        port: 587,
        requireTLS: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.PERSONAL_EMAIL,
            to: body.email as string,
            bcc: process.env.PERSONAL_EMAIL,
            replyTo: process.env.PERSONAL_EMAIL,
            subject: `${copy.subject} - ${serviceList}`,
            html: `
                <p>${copy.greeting(firstName)}</p>
                <p>${copy.body}</p>
                <p>${copy.signOff}</p>
                <p>Walkedo</p>

                <p>---</p>

                <p><strong>${escapeHtml(copy.interestedIn)}: ${escapeHtml(serviceList)}</strong></p>

                ${detailsHtml(services, body, copy)}
            `,
        });
        return Response.json({ message: "Success" }, { status: 200 });
    } catch (error) {
        // Log the failure, never the submitted body — it contains customer PII.
        console.error(`Signup mail failed for services "${services.join(",")}"`, error);
        return Response.json({ message: "Error" }, { status: 500 });
    }
}
