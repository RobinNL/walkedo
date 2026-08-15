import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import React from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import Styles from "@/app/[locale]/news/news.module.scss";
import InnerStyle from "./page.module.scss";
import { Link } from "@/i18n/navigation";
import { WalkedoButton } from "../../../../../components/button/button";
import { RenderDate } from "@/app/shared/render-data";
import { getPostBySlug, getPostSlugs, localesForPost } from "../../../../../lib/blog-posts";
import { alternates, SITE_URL } from "@/i18n/metadata";
import { routing, type Locale } from "@/i18n/routing";

type Params = { params: { locale: string; slug: string } };

export function generateStaticParams() {
    // Union of every slug across locales, so the "not translated yet" page is
    // prerendered too rather than falling back to on-demand rendering.
    const slugs = Array.from(
        new Set(routing.locales.flatMap((locale) => getPostSlugs(locale))),
    );
    return routing.locales.flatMap((locale) =>
        slugs.map((slug) => ({ locale, slug })),
    );
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const locale = params.locale as Locale;
    const post = await getPostBySlug(locale, params.slug);
    const available = localesForPost(params.slug);

    if (!post) {
        // Untranslated: keep it out of the index rather than competing with
        // the locale that does have the article. Alternates are cleared
        // explicitly, otherwise this URL inherits the layout's home-page
        // hreflang set and claims to be a translation of the home page.
        const t = await getTranslations({ locale, namespace: "post" });
        return {
            title: t("notAvailableTitle"),
            robots: { index: false, follow: true },
            alternates: { canonical: null, languages: {} },
        };
    }

    const path = `/posts/${post.slug}`;
    return {
        title: post.title,
        description: post.description,
        alternates: alternates(locale, path, available),
        openGraph: {
            title: `${post.title} | Walkedo`,
            description: post.description,
            type: "article",
            publishedTime: post.date,
            url: `${SITE_URL}/${locale}${path}`,
            images: post.image ? [{ url: post.image }] : undefined,
        },
    };
}

export default async function Post({ params }: Params) {
    const locale = params.locale as Locale;
    setRequestLocale(locale);

    const t = await getTranslations('post');
    const post = await getPostBySlug(locale, params.slug);
    const available = localesForPost(params.slug);

    // Exists in no locale at all — a genuinely wrong URL.
    if (!post && available.length === 0) {
        notFound();
    }

    // Exists, but not in this language. Offer the version that does exist
    // instead of a dead end.
    if (!post) {
        const other = available[0];
        return (
            <div className={'container'}>
                <article className={InnerStyle.articleContainer}>
                    <h1 className={InnerStyle.articleHeader}>{t('notAvailableTitle')}</h1>
                    <p>{t('notAvailable')}</p>
                    <p>
                        <a href={`/${other}/posts/${params.slug}`} hrefLang={other} lang={other}>
                            {t('readInOther')}
                        </a>
                    </p>
                </article>
                <div className={InnerStyle.articleFooterCard}>
                    <Link href={'/news'}>
                        <WalkedoButton label={t('back')}/>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className={Styles.heroImage}>
                <Image sizes='max-width: 100vw' className={Styles.heroImageInner} fill={true}
                       alt={post.imageAlt ?? t('heroAlt')} src={post.image}/>
            </div>
            <div className={'container'}>
                <article className={InnerStyle.articleContainer}>
                    <h1 className={InnerStyle.articleHeader}>{post.title}</h1>
                    <p className={InnerStyle.articleDate}>
                        {t('postedOn')} {RenderDate({ date: post.date, short: false, locale })}
                    </p>
                    <div dangerouslySetInnerHTML={{ __html: post.html }}/>
                </article>
                <div className={InnerStyle.articleFooterCard}>
                    <Link href={'/news'}>
                        <WalkedoButton label={t('back')}/>
                    </Link>
                </div>
            </div>
        </div>
    )
}
