import { Metadata } from "next";
import { formatHTMLTitle } from "@/app/shared/page-seo-title";

export const metadata: Metadata = {
    title: formatHTMLTitle({ title: "Hondendagopvang in Arnhem" }),
    description:
        "Een hond is een vriend voor het leven. Maar soms moet of wil je ook even ver weg van huis en dan is het niet altijd mogelijk om je hond mee te nemen.",
};

export default function HondenopvangLayout({
                                               children,
                                           }: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}