import getPostMetadata from "../../../utils/getPostMetaData";
import Styles from "@/app/nieuws/nieuws.module.scss";
import Image from "next/image";
import React from "react";
import { ArticlePreview } from "../../../components/article-preview/article-preview";

export default async function Page() {

    const posts = await getPostMetadata('articles/news')

    const renderPostSlug = (post: any) => {
        return (
            <ArticlePreview baseUrl={'nieuws'} post={post} key={post.title} className={Styles.blogPreviewCard} />
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

                <h1 className={Styles.header}>Nieuws</h1>

                <p className={Styles.mainHeroContentWrap}>Blijf op de hoogte van het laatste Walkedo nieuws</p>

                <div className={Styles.blogWrapper}>
                    {
                        posts.map(post => renderPostSlug(post))
                    }
                </div>
            </div>
        </main>
    );
}