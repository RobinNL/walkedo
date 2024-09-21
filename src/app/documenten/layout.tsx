import { Metadata } from "next";
import Page from "./page";
import { formatHTMLTitle } from "@/app/shared/page-seo-title";   // import your Demo's page

export const metadata: Metadata = {
    title: formatHTMLTitle({ title: 'Documenten' }),
    description:
        "Download en lees alle documenten die ter sprake komen tijdens de intake voor je hond.",
};
export default Page;