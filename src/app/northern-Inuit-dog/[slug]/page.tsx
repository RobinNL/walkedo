import Styles from './page.module.scss';
import Markdown from "markdown-to-jsx";
import Image from "next/image";
import getNorthernInuitPosts, { getPost } from "../../../../lib/northern-inuit-posts";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    const posts = await getNorthernInuitPosts();
    return posts.map((post) => ({ slug: post?.slug }));
}

export default async function Article({ params }: any) {
    const post = await getPost(params.slug);
    if (!post) {
        return notFound();
    }
    return (
        <main>
            <article>
                <div className={Styles.blogPostImage}>
                    <Image fill={true} src={post.thumbnail} alt={''}/>
                </div>
                <div className={Styles.blogPostContainer}>
                    <h1>
                        {post.title}
                    </h1>
                    <p>Geplaatst op {post.date}</p>
                    <Markdown>{post.body}</Markdown>
                    <div className={Styles.inuitDogBlogPostFooterCard}>
                        <h3 className={Styles.inuitDogBlogPostFooterHeader}>Zelf een Northern Inuit Dog?</h3>
                        <p>Wij zijn de eerste kennel (in opbouw) van Nederland waar jij je eigen Northern Inuit dog kunt
                            adopteren. Schrijf je vrijblijvend in op het aanmeldformulier zodat
                            wij contact met je op kunnen nemen voor meer informatie!</p>
                    </div>
                </div>
            </article>
        </main>

    )
}
