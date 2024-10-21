// Set the title of the page to be the post title, note that we no longer use
// e.g. next/head in app dir
import { getAllPosts, getPostById } from "../../../../lib/blog-posts";
import Styles from "@/app/nieuws/nieuws.module.scss";
import InnerStyle from "./page.module.scss";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { WalkedoButton } from "../../../../components/button/button";
import { formatHTMLTitle } from "@/app/shared/page-seo-title";

export async function generateMetadata({
                                           params: {slug},
                                       }: {
    params: { slug: string };
}) {
    const {title} = await getPostById(slug);
    return {
        title: formatHTMLTitle({ title }),
    };
}

// Generate the post, note that this is a "react server component"! it is allowed to be async
export default async function Post({
                                       params
                                   }: {
    params: { slug: string };
}) {
    console.log(await getPostById(params.slug));
    const {html, title, date, image} = await getPostById(params.slug);
    return (
        <div>
            <div className={Styles.heroImage}>
                <Image sizes='max-width: 100vw' className={Styles.heroImageInner} fill={true}
                       alt={'Foto die het bericht beschrijft'}
                       src={image}/>
            </div>
            <div className={'container'}>

                <article className={InnerStyle.articleContainer}>
                    <h1 className={InnerStyle.articleHeader}>{title}</h1>
                    <p className={InnerStyle.articleDate}>Geplaatst op {date}</p>
                    <div dangerouslySetInnerHTML={{__html: html}}/>
                </article>
                <div className={InnerStyle.articleFooterCard}>
                    <Link href={'/nieuws'}>
                        <WalkedoButton label={'Meer nieuws bekijken'} />
                    </Link>
                </div>
            </div>
        </div>)
}

// This function can statically allow nextjs to find all the posts that you have made, and statically generate them
export async function generateStaticParams() {
    const posts = await getAllPosts();

    return posts.map((post) => ({
        id: post.id,
    }));
}