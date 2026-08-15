import Link from "next/link";
import { defaultLocale } from "@/i18n/routing";

/**
 * Fallback for paths outside any locale segment. Localised 404s live in
 * src/app/[locale]/not-found.tsx; this one has to render its own <html> and
 * <body> because the root layout does not.
 */
export default function NotFound() {
    return (
        <html lang={defaultLocale}>
        <body>
        <main style={{ padding: "6rem 1.5rem", textAlign: "center" }}>
            <h2>Oh nee! Een hond is de bal kwijt</h2>
            <p>Oh no! A dog has lost the ball</p>
            <p>
                <Link href={`/${defaultLocale}`}>walkedo.com</Link>
            </p>
        </main>
        </body>
        </html>
    );
}
