import { ArticleMeta } from "../shared/blog.interface";
import React, { FunctionComponent } from "react";
import Styles from "./article-preview.module.scss";
import Image from "next/image";

export interface ArticlePreviewProps {
    post: ArticleMeta;
    className: any;
    baseUrl: string;
    key: number;
}

export const ArticlePreview: FunctionComponent<ArticlePreviewProps> = ({post, baseUrl, className}) => {

    return (
        <div key={post.title} className={`${Styles.blogCard} ${className ? className : ''}`}>
            <a href={`${baseUrl}/${post.slug}`}>
                <h3 className={Styles.blogPostTitle}>{post.title}</h3>
                <p className={Styles.blogPostDate}>Geplaatst op: {post.date}</p>
                <div className={Styles.blogPostImage}>
                    <Image src={post.thumbnail} fill={true} alt={''}/>
                </div>
            </a>
        </div>
    )

}