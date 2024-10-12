import { Metadata } from "next";
import Page from "./page";
import { formatHTMLTitle } from "@/app/shared/page-seo-title";   // import your Demo's page

export const metadata: Metadata = {
    title: formatHTMLTitle({ title: 'Casting Hond Wolf uiterlijk' }),
    description:
        "Heb je een hond nodig die lijkt op een wolf voor je productie, een fotoshoot of andere vorm van Media? Walkedo helpt je graag met een Northern Inuit Dog die goed getraind is.",
};
export default Page;