import Styles from './voorwaarden.module.scss';
import { Metadata } from "next";
import { formatHTMLTitle } from "@/app/shared/page-seo-title";

export const metadata: Metadata = {
    title: formatHTMLTitle({ title: "Hondendagopvang voorwaarden" }),
    description:
        "Bekijk de voorwaarden voor een gezond en vrolijk verblijf van je hond bij Walkedo Arnhem, hondenopvang.",
};

export default function Page() {

    return (
        <main>
            <div className={Styles.docWrapper}>

                <h1>Hondendagopvang voorwaarden</h1>
                <p>Publicatiedatum: 12-1-2026. Versie 1.0</p>

                <a className={Styles.downloadLink} href={'/files/voorwaarden-hondenopvang-walkedo-arnhem.pdf'} target={'_blank'}>Download de voorwaarden</a>

                <p>
                    Let op! Alleen voor klanten honden van Walkedo honden dagopvang - Walkedo
                    hondenuitlaatservice - Walkedo Northen Inuit Kennel!
                </p>

                <p>
                    - Hou er rekening mee dat als de uitlaatservice van Walkedo, de dagopvang of pup aanvraag komt
                    te vervallen dat u dan geen klant meer bent van Walkedo en dus geen gebruik maar kan maken
                    van de vakantie opvang.
                </p>

                <p>
                    - Korting op de 2e en 3e hond met dezelfde eigenaar is twee euro per dag. Elke nieuwe dag gaat
                    in op de ochtend.
                </p>

                <p>
                    Honden kunnen opgehaald en/of weggebracht worden voor 08:30 s’ochtends
                    Honden kunnen opgehaald en/of weggebracht worden tussen 17:00 uur en 21:00 uur
                </p>

                <p>
                    De hond gaat 2 x mee op de uitlaatservice ( 2 x uur wandelen) en zal daarnaast nog èèn maal
                    apart worden uitgelaten. ( voor pups en oude honden zal maatwerk geleverd worden)
                </p>

                <p>
                    Wordt de hond loops tijdens het verblijf dan komt er een toeslag van 5 euro per dag.
                </p>

                <p>
                    Ongecastreerde honden kunnen niet komen logeren.
                </p>

                <p>
                    Honden moeten verplicht ingeënt zijn voor kennel hoest een maand voordat ze komen logeren.
                </p>

                <p>
                    Eigenaren wordt gevraagd om zelf voer mee te brengen en aan te geven hoe deze moet worden
                    toegediend. Moet de hond medicatie hebben dan is dat geen probleem echter mag de hond niet
                    besmettelijk zijn.
                </p>

                <p>
                    Daarnaast word gevraagd om het dierenpaspoort achter te laten. Tijdens deze overdracht word
                    het paspoort gecontroleerd op alle vaccinaties.
                </p>

                <p>
                    * Onder het hoogseizoen vallen alle kindervakanties en nationale feestdagen.
                </p>

            </div>

        </main>
    );
}
