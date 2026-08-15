import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { unified } from "unified";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrettyCode from "rehype-pretty-code";
import { locales, type Locale } from "@/i18n/routing";

const postsDirectory = path.join(process.cwd(), "_posts");

export type Post = {
    slug: string;
    locale: Locale;
    title: string;
    date: string;
    image: string;
    description?: string;
    imageAlt?: string;
    html: string;
};

function localeDirectory(locale: Locale) {
    return path.join(postsDirectory, locale);
}

function getPostFiles(locale: Locale): string[] {
    const dir = localeDirectory(locale);
    if (!fs.existsSync(dir)) return [];
    return fs.readdirSync(dir).filter((file) => file.endsWith(".md"));
}

function getParser() {
    return unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRehype)
        .use(rehypePrettyCode, {
            theme: "one-dark-pro",
        })
        .use(rehypeSlug)
        .use(rehypeAutolinkHeadings, {
            content: (arg) => ({
                type: "element",
                tagName: "a",
                properties: {
                    href: `#${String(arg.properties?.id)}`,
                    style: "margin-right: 10px",
                },
                children: [{ type: "text", value: "#" }],
            }),
        })
        .use(rehypeStringify);
}

// small speedup from caching this parser
const parser = getParser();

/**
 * gray-matter yields a Date for an unquoted YAML date, but a string if the
 * value is quoted. Accept either, and fail loudly on a malformed one rather
 * than emitting an "Invalid Date" into the page.
 */
function toIsoDate(value: unknown, slug: string): string {
    const date = value instanceof Date ? value : new Date(String(value));
    if (Number.isNaN(date.getTime())) {
        throw new Error(`Post "${slug}" has an unreadable date: ${String(value)}`);
    }
    return date.toISOString().slice(0, 10);
}

/** All slugs that exist for a locale. */
export function getPostSlugs(locale: Locale): string[] {
    return getPostFiles(locale).map((file) => file.replace(/\.md$/, ""));
}

/** The locales an article has been written in — drives hreflang and the switcher. */
export function localesForPost(slug: string): Locale[] {
    return locales.filter((locale) =>
        fs.existsSync(path.join(localeDirectory(locale), `${slug}.md`)),
    );
}

/** Returns null when the article does not exist in this locale. */
export async function getPostBySlug(locale: Locale, slug: string): Promise<Post | null> {
    const realSlug = slug.replace(/\.md$/, "");
    const fullPath = path.join(localeDirectory(locale), `${realSlug}.md`);

    if (!fs.existsSync(fullPath)) return null;

    const { data, content } = matter(await fs.promises.readFile(fullPath, "utf8"));
    const html = await parser.process(content);

    return {
        slug: realSlug,
        locale,
        title: data.title as string,
        date: toIsoDate(data.date, realSlug),
        image: data.image as string,
        description: data.description as string | undefined,
        imageAlt: data.alt as string | undefined,
        html: String(html.value),
    };
}

export async function getAllPosts(locale: Locale): Promise<Post[]> {
    const posts = await Promise.all(
        getPostSlugs(locale).map((slug) => getPostBySlug(locale, slug)),
    );
    return posts
        .filter((post): post is Post => post !== null)
        .sort((a, b) => (a.date > b.date ? -1 : 1));
}

/**
 * Slugs that exist in one locale but not the other. Logged at build time so
 * translation gaps are visible rather than silently shipping a half-empty
 * news section.
 */
export function untranslatedSlugs(): { slug: string; missingIn: Locale[] }[] {
    const all = new Set(locales.flatMap((locale) => getPostSlugs(locale)));
    return Array.from(all)
        .map((slug) => ({
            slug,
            missingIn: locales.filter((locale) => !localesForPost(slug).includes(locale)),
        }))
        .filter((entry) => entry.missingIn.length > 0);
}
