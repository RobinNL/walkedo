import getPostMetadata from "../../../utils/getPostMetaData";
import Styles from "@/app/northern-Inuit-dog/norhern-inuit.module.scss";
import Image from "next/image";
import React from "react";
import { ArticlePreview } from "../../../components/article-preview/article-preview";

export default async function Page() {

    const posts = await getPostMetadata('articles/northern-inuit')

    const renderPostSlug = (post: any) => {
        return (
            <ArticlePreview baseUrl={'northern-Inuit-dog'} post={post} key={post.title} className={Styles.blogPreviewCard} />
        )
    }

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
                    Dit prachtige ras is nog heel onbekend wereldwijd en al helemaal in Nederland. De honden zijn heel
                    sociaal, gaan goed in groepen en andere honden. Het ras is vooral bekend van de TV serie Game of Thrones. Omdat wij een nesje Northern Inuit hondjes verwachten kan jij je aanmelden voor
                    de wachtlijst. Om het ras beter te leren kennen kan je hier wat artikelen lezen over de Northern Inuit Dog.
                </p>

                <div className={Styles.blogWrapper}>
                    {
                        posts.map(post => renderPostSlug(post))
                    }
                </div>

            </div>
        </main>
    );
}


