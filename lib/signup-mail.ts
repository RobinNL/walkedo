import nodemailer from "nodemailer";

export const SIGNUP_SERVICES = ["uitlaten", "casting", "puppy"] as const;
export type SignupService = (typeof SIGNUP_SERVICES)[number];

export const MAIL_LOCALES = ["nl", "en"] as const;
export type MailLocale = (typeof MAIL_LOCALES)[number];

/**
 * The three signup forms differ only in their free-text field and subject line.
 * Everything else — the greeting, the sign-off, the contact details block — is shared.
 */
const SERVICE_CONFIG: Record<
    SignupService,
    {
        field: string;
        subject: Record<MailLocale, string>;
        fieldLabel: Record<MailLocale, string>;
    }
> = {
    uitlaten: {
        field: "dogSummary",
        subject: {
            nl: "Walkedo Uitlaatservice - Aanmelding",
            en: "Walkedo Dog Walking - Sign-up",
        },
        fieldLabel: { nl: "Over de honden", en: "About the dog(s)" },
    },
    casting: {
        field: "projectSummary",
        subject: {
            nl: "Walkedo Casting - Aanmelding",
            en: "Walkedo Casting - Sign-up",
        },
        fieldLabel: { nl: "Project", en: "Project" },
    },
    puppy: {
        field: "owner",
        subject: {
            nl: "Walkedo Puppy - Aanmelding",
            en: "Walkedo Puppy - Sign-up",
        },
        fieldLabel: { nl: "Eigenaar", en: "Owner" },
    },
};

const COPY: Record<MailLocale, {
    greeting: (name: string) => string;
    body: string;
    signOff: string;
    name: string;
    email: string;
    phone: string;
    address: string;
}> = {
    nl: {
        greeting: (name) => `Beste ${name},`,
        body: "Bedankt voor je aanmelding. Ik zal zo spoedig mogelijk contact met je opnemen.",
        signOff: "Met vriendelijke groet,",
        name: "Naam",
        email: "Email",
        phone: "Telefoon",
        address: "Adres",
    },
    en: {
        greeting: (name) => `Dear ${name},`,
        body: "Thank you for your sign-up. I will get in touch with you as soon as possible.",
        signOff: "Kind regards,",
        name: "Name",
        email: "Email",
        phone: "Phone",
        address: "Address",
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

function isValidEmail(value: unknown): value is string {
    return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
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

export async function handleSignup(request: Request, service: SignupService): Promise<Response> {
    const config = SERVICE_CONFIG[service];

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

    if (!isValidEmail(body.email)) {
        return Response.json({ message: "Invalid email" }, { status: 400 });
    }

    const locale = resolveLocale(body.locale);
    const copy = COPY[locale];

    const firstName = escapeHtml(body.firstName);
    const lastName = escapeHtml(body.lastName);
    const email = escapeHtml(body.email);
    const phoneNr = escapeHtml(body.phoneNr);
    const address = escapeHtml(body.address);
    const detail = escapeHtml(body[config.field]);

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
            subject: config.subject[locale],
            html: `
                <p>${copy.greeting(firstName)}</p>
                <p>${copy.body}</p>
                <p>${copy.signOff}</p>
                <p>Walkedo</p>

                <p>---</p>

                <p>${copy.name}: ${firstName} ${lastName}</p>
                <p>${copy.email}: ${email}</p>
                <p>${copy.phone}: ${phoneNr}</p>
                <p>${copy.address}: ${address}</p>
                <p>${config.fieldLabel[locale]}: ${detail}</p>
            `,
        });
        return Response.json({ message: "Success" }, { status: 200 });
    } catch (error) {
        // Log the failure, never the submitted body — it contains customer PII.
        console.error(`Signup mail failed for service "${service}"`, error);
        return Response.json({ message: "Error" }, { status: 500 });
    }
}
