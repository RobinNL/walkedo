import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import createNextIntlPlugin from 'next-intl/plugin';

const projectRoot = dirname(fileURLToPath(import.meta.url));

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
// HISTORY: these redirects used to poison page URLs with RSC flight payloads.
// FIXED by the Next 16 upgrade -- kept here so nobody reintroduces it.
//
// On 14.2.4 a redirect dropped Next's own RSC cache-buster:
//   prepare-destination.js -> `delete query[NEXT_RSC_UNION_QUERY]`
// Verified then: /opvang?_rsc=abc&foo=bar -> 301 /nl/opvang?foo=bar. The client
// re-sent `RSC: 1` to the bare destination, the origin answered with a flight
// payload (content-type text/x-component), and DigitalOcean's bundled
// Cloudflare -- which ignores `Vary: RSC` -- cached that under the plain page
// URL. Four pages were found serving raw RSC to browsers.
//
// Re-tested on 16.3.4, both halves of the chain are gone:
//   1. /opvang?_rsc=abc&foo=bar -> 301 /nl/opvang?_rsc=abc&foo=bar
//      (the cache-buster now survives the redirect)
//   2. `RSC: 1` on /nl/opvang    -> 307 /nl/opvang?_rsc
//      (Next refuses to serve a flight payload at a bare page URL at all)
// Vary is now `rsc, next-router-state-tree, next-router-prefetch,
// next-router-segment-prefetch, Accept-Encoding`.
//
// Three workarounds were tried against a real Next 14 build and ALL FAILED
// (middleware cannot see `_rsc` -- stripInternalSearchParams(); middleware
// cannot see the RSC headers; and headers() could not override Cache-Control on
// 14). None of that is needed now, but do not spend time re-deriving it.
//
// `export const revalidate = 3600` in src/app/[locale]/layout.tsx is kept as
// defence-in-depth, now paired with `expireTime` below so the stale window is
// bounded too.
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

    /**
     * Turbopack is the default builder from Next 16, and it resolves the
     * "project root" by walking up from cwd looking for a lockfile. There is a
     * stray package-lock.json in the home directory above this repo, which made
     * it pick that as the root and warn about it. Pinning it here is the fix;
     * the file above us belongs to whoever put it there.
     */
    turbopack: {
        root: projectRoot,
    },

    /**
     * Webpack's sass-loader put the project root on Sass's load path, so every
     * stylesheet could write `@import "styles/variables"` and have it resolve
     * from the repo root. Turbopack -- the default builder from Next 16 -- does
     * not do that, and all 21 .scss files in this repo are written that way, so
     * without this the build fails on the first module stylesheet it reaches.
     *
     * It must be `loadPaths`. The older `includePaths` name is a node-sass-ism
     * that modern Dart Sass ignores silently: it will not error, the imports
     * will simply still not resolve.
     */
    sassOptions: {
        loadPaths: [projectRoot],

        /**
         * Every stylesheet here uses `@import`, which Dart Sass deprecated in
         * 1.80 in favour of `@use`/`@forward`. Migrating 21 files to the module
         * system is a real refactor -- no more global scope, explicit
         * namespacing -- and does not belong in a dependency upgrade, so the
         * warning is silenced instead.
         */
        silenceDeprecations: ['import'],
    },

    experimental: {
        /**
         * sharp sizes libvips' thread pool from the CPUs it can *see*, which in
         * a container is the host's core count rather than the vCPU share the
         * instance is actually allowed. On a small App Platform instance that
         * means it spawns far more threads than it can run, and each one holds
         * its own decode buffers -- the reason a cold optimise of a large source
         * PNG measured 10.3s in production.
         *
         * Next 16 added this option to pin the pool (image-optimizer.js passes
         * it straight to sharp.concurrency()). Next 14 had no such lever.
         *
         * Set to match the instance's real vCPU count. 1 is correct for a basic
         * App Platform instance; raise it in step with the instance size.
         */
        imgOptConcurrency: 1,
    },

    /**
     * Caps `stale-while-revalidate` on page HTML.
     *
     * Next 14 emitted a bare `stale-while-revalidate` with no value alongside
     * `s-maxage`, and gave no way to change it -- which meant a shared cache was
     * entitled to serve a stale object for its own default, effectively forever.
     * That is the wrong pairing for the RSC-poisoning failure documented above:
     * the whole containment strategy is "a bad cached object must expire
     * quickly", and an unbounded SWR window undoes it.
     *
     * This is the TOTAL lifetime, not the stale window: Next emits
     * `stale-while-revalidate = expireTime - revalidate`. Setting it equal to
     * `revalidate` therefore removes stale serving altogether, which trades the
     * availability that SWR buys for nothing. At 7200 against the layout's
     * `revalidate = 3600` the emitted header is
     *     s-maxage=3600, stale-while-revalidate=3600
     * so a mis-cached object can survive at most an hour fresh plus an hour
     * stale, and a slow origin is still covered by a real grace window.
     */
    expireTime: 7200,

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
        // Coupled with the `public/` Cache-Control in headers() below. Read
        // both before changing either.
        //
        // The optimiser computes the TTL it puts on /_next/image as
        //     Math.max(minimumCacheTTL, getMaxAge(upstream Cache-Control))
        // (node_modules/next/dist/server/image-optimizer.js, ~line 1081 on 16.x),
        // and it fetches its source *through this app's own routing*
        // (next-server.js `fetchInternalImage` -> routerServerHandler), so
        // "upstream" here is literally the headers() rule below.
        //
        // Because it is a max(), the LARGER of the two always wins. With 30 days
        // here and 7 days on public/, this value dominates and the effective TTL
        // on every optimised image is unambiguously 30 days. The trap only bites
        // the other way round -- if the public/ header were ever raised above
        // this number it would silently take over. Keep this one the larger.
        //
        // Raised from 7 days to 30 only because Next 16 fixes the bug that made
        // a long image TTL dangerous on 14.2.4: fetchInternalImage() there
        // copied the *incoming* request method into the internal fetch for the
        // source file, so a HEAD request stored a zero-byte cache entry and
        // every later GET for that url+w+q served a blank image until it
        // expired. Crawlers HEAD srcset URLs, so this happened by itself. Two
        // separate guards in 16.x close it: the method is coerced to GET
        // ("Coerce HEAD to GET to avoid issues with the image optimizer",
        // image-optimizer.js ~line 1023) and an empty upstream body is now a
        // hard error rather than a cacheable result (~line 1040).
        //
        // Do not raise this on a Next 14 deployment. There, a poisoned entry
        // simply lasts however long this number says.
        // ---------------------------------------------------------------
        minimumCacheTTL: 2592000, // 30 days

        // Deliberately NOT adding 'image/avif'. AVIF encodes far slower in
        // sharp, and there is still no request-level queue in front of the
        // optimiser -- only sharp's libvips pool is capped, which is what
        // experimental.imgOptConcurrency below now sets explicitly. On a small
        // instance AVIF would make the cold-transform problem worse, not
        // better.
        formats: ['image/webp'],
    },

    /**
     * CAREFUL: on Next 16 this hook CAN set the Cache-Control of page HTML,
     * which is a reversal of Next 14 and the opposite hazard.
     *
     * On 14, base-server.js overwrote it unconditionally for any prerendered
     * route via formatRevalidate(), so `headers()` was simply ignored for HTML.
     * Re-tested on 16.3.4 by adding
     *     { source: '/:path*', headers: [{ key: 'Cache-Control',
     *       value: 'private, no-store, TRAP1PROBE' }] }
     * and rebuilding: /nl came back carrying exactly that, probe token and all.
     *
     * So a broad rule here will now silently clobber the caching that
     * `export const revalidate` (src/app/[locale]/layout.tsx) and `expireTime`
     * set up. Every rule below is scoped to a specific asset prefix on purpose.
     * Do not add a `/:path*` catch-all. Everything under public/ was being served `public, max-age=0`,
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
