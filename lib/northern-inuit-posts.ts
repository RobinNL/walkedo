// lib/blog.ts
import matter from "gray-matter";
import path from "path";
import fs from "fs/promises";
import { cache } from "react";
export const getNorthernInuitPosts: () => Promise<any[]> = cache(async () => {
    const posts = await fs.readdir("./articles/northern-inuit/");

    return Promise.all(
        posts
            .filter((file) => path.extname(file) === ".md")
            .map(async (file) => {
                const filePath = `./articles/northern-inuit/${file}`;
                const postContent = await fs.readFile(filePath, "utf8");
                const { data, content } = matter(postContent);

                // Not published? No problem, don't show it.
                if (data.published === false) {
                    return undefined;
                }

                return { ...data, body: content, slug: file.split('.')[0]} as any;
            })
            .filter((e) => e)
    ) as Promise<any[]>;
});

export async function getPost(slug: string) {
    const posts = await getNorthernInuitPosts();
    return posts.find((post) => post?.slug === slug);
}

export default getNorthernInuitPosts;