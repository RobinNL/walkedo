import { useTranslations } from "next-intl";
import Styles from "./not-found.module.scss";

export default function NotFound() {
    const t = useTranslations("notFound");

    return (
        <main className={Styles.notHereContainer}>
            <div>
                <h2>{t("title")}</h2>
                <p>{t("body")}</p>
            </div>
        </main>
    )
}
