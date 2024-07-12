import { useRouter } from "next/navigation";
import getPostMetadata from "../../../utils/getPostMetaData";
import Styles from "@/app/northern-Inuit/norhern-inuit.module.scss";
import Image from "next/image";

export default async function Page() {

    const postMetadata = await getPostMetadata('articles')

    return (
        <main>
            <div className={Styles.heroImage}>
                <Image sizes='max-width: 100vw' className={Styles.heroImageInner} fill={true}
                       alt={'honden in arnhem'}
                       src={'/images/inuit-dog/northern-inuit.jpeg'}/>
            </div>
            <div className={'container'}>

                <h1 className={Styles.header}>Northern Inuit Dog</h1>

                <p className={Styles.mainHeroContentWrap}>
                    Dit prachtige ras is nog heel onbekend wereldwijd en al helemaal in Nederland. De honden zijn heel sociaal,
                    gaan goed in groepen en andere honden. Het ras is vooral bekend van de TV serie Game of Thrones. Ik wil graag dat meer mensen het ras leren kennen.
                </p>

                <div>

                </div>

                <p>
                    {JSON.stringify(postMetadata)}
                </p>
            </div>
        </main>
    );
}