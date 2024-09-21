import { Metadata } from "next";
import Page from "./page";
import { formatHTMLTitle } from "@/app/shared/page-seo-title";   // import your Demo's page

export const metadata: Metadata = {
    title: formatHTMLTitle({ title: 'Uilaatservice Arnhem Noord' }),
    description:
        "Laat je hond uitgelaten worden met zorg samengestelde speciale kleine groepen. Zo kunnen ze de energie kwijt en lekker socialiseren in Arnhem Noord",
};
export default Page;