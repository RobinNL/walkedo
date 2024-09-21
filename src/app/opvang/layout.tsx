import { Metadata } from "next";
import Page from "./page";
import { formatHTMLTitle } from "@/app/shared/page-seo-title";   // import your Demo's page

export const metadata: Metadata = {
    title: formatHTMLTitle({ title: 'Opvangservice' }),
    description:
        "Een hond is een vriend voor het leven. Maar soms moet of wil je ook even ver weg van huis en dan is het niet altijd mogelijk om je hond mee te nemen.",
};
export default Page;