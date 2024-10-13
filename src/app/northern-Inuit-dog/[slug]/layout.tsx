import { Metadata } from "next";
import Page from "./page";
import { formatHTMLTitle } from "@/app/shared/page-seo-title";   // import your Demo's page

export const metadata: Metadata = {
    title: formatHTMLTitle({ title: 'Blog' }),
    description:
        "Een uniek ras bekend uit Game of Thrones en nu in Nederland. Dit unieke ras is bij de Walkedo kennel als eerste in Nederland. Leer dit prachtige ras kennen.",
};
export default Page;