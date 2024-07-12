import { useRouter } from "next/navigation";
import getPostMetadata from "../../../utils/getPostMetaData";
import Styles from "@/app/nieuws/nieuws.module.scss";
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

                <h1 className={Styles.header}>Nieuws</h1>

                <p className={Styles.mainHeroContentWrap}>
                    Hier komt nieuws
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