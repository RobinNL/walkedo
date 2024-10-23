import React, { FunctionComponent } from "react";
import Styles from "./article-preview.module.scss";
import Image from "next/image";
import { RenderDate } from "@/app/shared/render-data";

export interface ArticlePreviewProps {
    post: any;
    className: any;
    baseUrl: string;
    key: number;
}

export const ArticlePreview: FunctionComponent<ArticlePreviewProps> = ({post, baseUrl, className}) => {

    return (
        <div key={post.title} className={`${Styles.blogCard} ${className ? className : ''}`}>
            <a href={`berichten/${post.id}`} className={Styles.blogCardInner}>
                <span className={Styles.blogCardInner}>
                    <Image src={'/images/dog-paw.svg'} className={Styles.blogPostImagePreview}
                           alt={'honden poot'} width={20} height={20}/>
                    <p className={Styles.blogPostTitle}>{post.title}</p>
                </span>
                {/*<p className={Styles.blogPostDate}>{RenderDate({ date: post.date, short: true })}</p>*/}
            </a>
        </div>
    )

}