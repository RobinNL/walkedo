import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Paths that existed before the /nl and /en prefixes were introduced. Listed
// explicitly rather than as a catch-all, because /:path* would also match the
// new /nl and /en paths and redirect them onto themselves.
const legacyPaths = [
    '/uitlaatservice',
    '/opvang',
    '/opvang/voorwaarden',
    '/northern-Inuit-dog',
    '/casting',
    '/nieuws',
    '/berichten/:slug',
    '/aanmelden',
    '/documenten',
];

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async redirects() {
        return [
            // Walkedo.nl redirects
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'walkedo.nl' }],
                destination: 'https://walkedo.com/:path*',
                permanent: true
            },
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'www.walkedo.nl' }],
                destination: 'https://walkedo.com/:path*',
                permanent: true
            },
            // hondenuitlaatservicearnhem.com redirects
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'hondenuitlaatservicearnhem.com' }],
                destination: 'https://walkedo.com/:path*',
                permanent: true
            },
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'www.hondenuitlaatservicearnhem.com' }],
                destination: 'https://walkedo.com/:path*',
                permanent: true
            },
            // always without www.
            {
                source: '/:path*',
                has: [{ type: 'host', value: 'www.walkedo.com' }],
                destination: 'https://walkedo.com/:path*',
                permanent: true
            },
            // Pre-locale URLs -> their Dutch equivalent. These run before the
            // middleware, so it never sees these paths.
            // 301 rather than `permanent: true` (which emits 308), because a
            // 301 is what every crawler and SEO tool understands without
            // ambiguity, and these are the redirects carrying the site's
            // existing rankings across.
            ...legacyPaths.map((source) => ({
                source,
                destination: `/nl${source}`,
                statusCode: 301,
            })),
        ]
    }
};

export default withNextIntl(nextConfig);
