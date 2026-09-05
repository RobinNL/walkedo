import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Paths that existed before the /nl and /en prefixes were introduced, mapped
// to where they live now. Listed explicitly rather than as a catch-all,
// because /:path* would also match the new /nl and /en paths and redirect
// them onto themselves.
//
// /nieuws and /berichten also changed segment name, so they land on the new
// English segments rather than a straight prefixing.
//
// ---------------------------------------------------------------------------
// KNOWN, UNFIXABLE ON NEXT 14.2.4 -- read before "improving" this.
//
// These redirects drop Next's own RSC cache-buster. Verified against
// production: /opvang?_rsc=abc&foo=bar -> 301 Location: /nl/opvang?foo=bar.
// `foo` survives; only `_rsc` is removed, by
//   shared/lib/router/utils/prepare-destination.js
//   `delete query[NEXT_RSC_UNION_QUERY]`
//
// The client then re-sends `RSC: 1` to the bare destination, the origin answers
// with a flight payload (content-type text/x-component), and DigitalOcean's
// bundled Cloudflare -- which ignores `Vary: RSC` -- caches that payload under
// the plain page URL. Every later visitor gets raw RSC instead of HTML: a blank
// or garbled page that refreshing does not clear. Four pages (/nl/news,
// /nl/opvang, /nl/uitlaatservice, /nl/casting) were found in exactly this state,
// with ages of 2-3 days, against the old one-year s-maxage.
//
// Three fixes were tried against a real build. ALL THREE FAIL -- do not retry:
//
//  1. Move these redirects into middleware so `${search}` carries `_rsc`
//     across. Fails: server/web/adapter.js builds the NextRequest with
//     stripInternalSearchParams(), and INTERNAL_QUERY_NAMES includes
//     NEXT_RSC_UNION_QUERY. Middleware never sees `_rsc`, in nextUrl or in
//     request.url.
//  2. Detect the RSC request in middleware and mark it no-store. Fails: Next
//     strips the flight headers before middleware runs. Confirmed by echoing
//     the received header names back on a request that demonstrably returned a
//     flight response -- `rsc`, `next-router-state-tree` and
//     `next-router-prefetch` were all absent.
//  3. A headers() rule with `has: [{ type: 'header', key: 'RSC' }]`. Fails:
//     base-server overwrites Cache-Control after headers() has run, for every
//     prerendered route. (Other headers set this way do survive.)
//
// What actually contains the damage is `export const revalidate` in
// src/app/[locale]/layout.tsx, which caps how long a mis-cached variant can
// survive. It was one year; it is now one hour. If broken pages are still
// reported, lower that value -- it is the only lever that works.
// ---------------------------------------------------------------------------
const legacyPaths = [
    ['/uitlaatservice', '/nl/uitlaatservice'],
    ['/opvang', '/nl/opvang'],
    ['/opvang/voorwaarden', '/nl/opvang/voorwaarden'],
    ['/northern-Inuit-dog', '/nl/northern-Inuit-dog'],
    ['/casting', '/nl/casting'],
    ['/nieuws', '/nl/news'],
    ['/berichten/:slug', '/nl/posts/:slug'],
    ['/aanmelden', '/nl/aanmelden'],
    ['/documenten', '/nl/documenten'],
];

// The Dutch segment names, should anyone reach them with a locale prefix.
// The locale is constrained to the known locales so this cannot match an
// arbitrary first segment.
const renamedSegments = [
    ['/:locale(nl|en)/nieuws', '/:locale/news'],
    ['/:locale(nl|en)/berichten/:slug', '/:locale/posts/:slug'],
];

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    images: {
        // Next's default ladder ends at 2048 and 3840. Those two rungs were
        // responsible for the slowest responses on the site: a cold optimise of
        // a 5 MB source PNG at w=1920 measured 10.3s against production, and
        // the 3840 variant of the news hero was a 921 KB download that no
        // layout on this site is wide enough to need. Dropping them removes the
        // most expensive transforms outright.
        //
        // Re-adding a rung is cheap; just know it costs a fresh sharp pass per
        // (image, width, quality) on the first request after every deploy,
        // because DigitalOcean App Platform starts each deploy with an empty
        // .next/cache.
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],

        // ---------------------------------------------------------------
        // TRAP: this value and the `public/` Cache-Control below are coupled
        // and must be changed together.
        //
        // The optimiser computes the TTL it puts on /_next/image as
        //     Math.max(getMaxAge(upstream Cache-Control), minimumCacheTTL)
        // (node_modules/next/dist/server/image-optimizer.js, ~line 674), and it
        // fetches its source *through this app's own routing*
        // (next-server.js `fetchInternalImage` -> this.routerServerHandler), so
        // "upstream" here is literally the headers() rule below.
        //
        // Consequence: a long max-age on /images/** silently becomes the TTL on
        // every optimised image and overrides whatever is written here. They are
        // set to the same 7 days deliberately, so the effective value is never a
        // surprise.
        //
        // Left at the default 60 previously, which is why the CDN re-requested
        // every image once a minute and the origin re-ran sharp.
        // ---------------------------------------------------------------
        minimumCacheTTL: 604800, // 7 days

        // Deliberately NOT adding 'image/avif'. AVIF encodes far slower in sharp,
        // and Next 14 calls imageOptimizer() straight from the request handler
        // with no request-level queue (only sharp's libvips pool is capped, at
        // image-optimizer.js ~line 149). On a small instance that would make the
        // cold-transform problem worse, not better.
        formats: ['image/webp'],
    },

    /**
     * NOTE: this hook CANNOT set the Cache-Control of page HTML on Next 14.
     * For a prerendered/SSG route, base-server.js overwrites it unconditionally
     * with formatRevalidate() (server/lib/revalidate.js) at ~lines 1690/1710.
     * The only lever for HTML is `export const revalidate` in the route segment
     * -- see src/app/[locale]/layout.tsx.
     *
     * Tested, not assumed: a rule scoped to the RSC header
     *     { source: '/:path*', has: [{ type: 'header', key: 'RSC' }],
     *       headers: [{ key: 'Cache-Control', value: 'private, no-store' }] }
     * still came back as `s-maxage=3600, stale-while-revalidate`. A `has`
     * condition does not help; base-server overwrites the header after this
     * hook has run, for every prerendered route. Do not try it again.
     *
     * It does work for static files in public/, which is what it is used for
     * here. Everything under public/ was being served `public, max-age=0`,
     * so the CDN reported BYPASS and the origin served every raw byte on every
     * request -- 63 KB of SVG per page view on /news alone, before any photo.
     */
    async headers() {
        // 7 days, matching images.minimumCacheTTL above. Read the trap note there
        // before changing this number.
        //
        // Not `immutable` and not a year: unlike /_next/static, filenames under
        // public/ are NOT content-hashed, so a replaced photo at the same path
        // would otherwise be stuck in caches. Replacing an asset means either
        // giving it a new filename or accepting up to a 7-day tail.
        const publicAsset = [
            {
                key: 'Cache-Control',
                value: 'public, max-age=604800, stale-while-revalidate=86400',
            },
        ];

        return [
            { source: '/images/:path*', headers: publicAsset },
            { source: '/fonts/:path*', headers: publicAsset },
            { source: '/videos/:path*', headers: publicAsset },
            { source: '/files/:path*', headers: publicAsset },
            { source: '/favicon/:path*', headers: publicAsset },
        ];
    },
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
            ...[...legacyPaths, ...renamedSegments].map(([source, destination]) => ({
                source,
                destination,
                statusCode: 301,
            })),
        ]
    }
};

export default withNextIntl(nextConfig);
