import Link from "next/link";
import {ArticleMeta} from "../shared/blog.interface";
import Style from "./article-preview.module.scss";
import {FunctionComponent} from "react";
import Styles from "@/pages/blog/slug.module.scss";

export interface ArticlePreviewProps {
    article: ArticleMeta;
    className: any;
    key: number;
    children?: any;
}

export const ArticlePreview: FunctionComponent<ArticlePreviewProps> = ({article, className}) => {

    return (
            <div className={`${className} ${Style.articleWrapper}`}>
                <Link href={`/blog/${article.slug}`}>
                <img className={Style.articleThumbnail} src={article.thumbnail} />
                <h3 className={Style.articleTitle}>{article.title}</h3>
                <p className={Style.articlePreviewByline}>Published on {article.date}</p>
                <p className={Style.articleBody}>{article.description}</p>
                </Link>
            </div>
    )

}