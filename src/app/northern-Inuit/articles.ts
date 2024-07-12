'use server';

import matter from 'gray-matter';
import path from 'path';
import moment from 'moment';
import { remark } from 'remark';
import html from 'remark-html';
import fs from 'fs';

export async function timeStamp() {
    fs.writeFile("src/data.txt", `Last accessed: ${Date.now()}`, (err) => {
        if (err) {
            console.error(err);
        } else {
            // file written successfully
        }
    });
}
export interface ArticleItem {
    title: string;
    id: string;
    date: string;
    category: string;
}

const articlesDirectory = path.join(process.cwd(), 'articles');
export default async function getArticles(){

    const fileNames = fs.readdirSync(articlesDirectory);
    const allArticlesData = fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/, '');
        const fullPath = path.join(articlesDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf-8');
        const matterRes = matter(fileContents)

        return {
            id,
            title: matterRes.data.title,
            date: matterRes.data.date,
            category: matterRes.data.category
        }

    });

    return allArticlesData.sort((a, b) => {
        const format = 'DD-MM-YYYY';
        const dateOne = moment(a.date, format);
        const dateTwo = moment(b.date, format);
        if (dateOne.isBefore(dateTwo)) {
            return 1;
        } else if (dateTwo.isAfter(dateOne)) {
            return 1
        } else {
            return 0
        }
    })

}