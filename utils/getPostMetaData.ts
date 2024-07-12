'use server';

import fs from 'fs'
import matter from 'gray-matter'

export default async function getPostMetadata(basePath) {
    const folder = basePath + '/'
    const files = fs.readdirSync(folder)
    const markdownPosts = files.filter(file => file.endsWith('.md'))

    // get the file data
    const posts = markdownPosts.map((filename) => {
        const fileContents = fs.readFileSync(`${basePath}/${filename}`, 'utf8')
        const matterResult = matter(fileContents)
        return {
            title: matterResult.data.title,
            category: matterResult.data.category,
            date: matterResult.data.date,
            thumbnail: matterResult.data.thumbnail,
            slug: filename.replace('.md', '')
        }
    })
    return posts
}