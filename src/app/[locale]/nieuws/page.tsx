import Styles from "@/app/[locale]/nieuws/nieuws.module.scss";
import Image from "next/image";
import React from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArticlePreview } from "../../../../components/article-preview/article-preview";
import { getAllPosts } from "../../../../lib/blog-posts";
import { routing, type Locale } from "@/i18n/routing";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function Page({ params }: { params: { locale: string } }) {
    const locale = params.locale as Locale;
    setRequestLocale(locale);

    const t = await getTranslations('nieuws');
    const posts = await getAllPosts(locale);

    return (
        <main>
            <div className={Styles.heroImage}>
                <Image sizes='max-width: 100vw' className={Styles.heroImageInner} fill={true}
                       alt={t('heroAlt')} src={'/images/news/news.jpeg'}/>
            </div>
            <div className={'container'}>
                <h1 className={Styles.header}>{t('title')}</h1>
                <p className={Styles.mainHeroContentWrap}>{t('intro')}</p>
                <div className={Styles.blogWrapper}>
                    {posts.length === 0
                        ? <p>{t('empty')}</p>
                        : posts.map((post) => (
                            <ArticlePreview post={post} key={post.slug}
                                            pawAlt={t('pawAlt')}
                                            className={Styles.blogPreviewCard}/>
                        ))}
                </div>
            </div>
        </main>
    );
}
