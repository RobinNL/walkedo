import React, { FunctionComponent } from "react";
import Styles from "./article-preview.module.scss";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Post } from "../../lib/blog-posts";

export interface ArticlePreviewProps {
    post: Post;
    className?: string;
    pawAlt: string;
}

export const ArticlePreview: FunctionComponent<ArticlePreviewProps> = ({ post, className, pawAlt }) => {

    return (
        <div className={`${Styles.blogCard} ${className ? className : ''}`}>
            <Link href={`/berichten/${post.slug}`} className={Styles.blogCardInner}>
                <span className={Styles.blogCardInner}>
                    <Image src={'/images/dog-paw.svg'} className={Styles.blogPostImagePreview}
                           alt={pawAlt} width={20} height={20}/>
                    <p className={Styles.blogPostTitle}>{post.title}</p>
                </span>
            </Link>
        </div>
    )

}
