import { Metadata } from "next";
import Page from "./page";
import { formatHTMLTitle } from "@/app/shared/page-seo-title";   // import your Demo's page

export const metadata: Metadata = {
    title: formatHTMLTitle({ title: 'Nieuws' }),
    description:
        "Blijf op de hoogte van het laatste Walkedo nieuws.",
};
export default Page;