import { Metadata } from "next";
import Page from "./page";
import { formatHTMLTitle } from "@/app/shared/page-seo-title";   // import your Demo's page

export const metadata: Metadata = {
    title: formatHTMLTitle({ title: 'Aanmelden' }),
    description:
        "Meld je aan bij Walkedo voor de uitlaatservice en opvangservice in Arnhem Noord. Of neem contact op over de Northern Inuit Dog. ",
};
export default Page;