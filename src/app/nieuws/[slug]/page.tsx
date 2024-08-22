import Markdown from "markdown-to-jsx"
import React from 'react'
import fs from 'fs'
import matter from "gray-matter"
import getPostMetadata from "../../../../utils/getPostMetaData";
import Image from "next/image";
import Styles from "./page.module.scss";

function getPostContent(slug) {
    const folder = 'articles/news/'
    const file = folder + `${slug}.md`
    const content = fs.readFileSync(file, 'utf8')

    const matterResult = matter(content)
    return matterResult
}

export const generateStaticParams = async () => {
    const posts = await getPostMetadata('articles/news')
    console.log(posts);
    return posts.map((post) => ({ category: post.category, title: post.title, date: post.date, thumbnail: post.thumbnail, slug: post.slug }))
}

export default function page(props) {

    const slug = props.params.slug
    const post = getPostContent(slug)

    return (
        <main>
            <article>
                <div className={Styles.blogPostImage}>
                    <Image fill={true} src={post.data.thumbnail} alt={''} />
                </div>
                <div className={Styles.blogPostContainer}>
                    <h1>
                        {post.data.title}
                    </h1>
                    <p>Geplaatst op {post.data.date}</p>
                    <Markdown>{post.content}</Markdown>
                </div>
            </article>
        </main>
    )
}