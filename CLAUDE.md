# Walkedo — notes for whoever works on this next

Next.js **14.2.4**, **App Router**, **next-intl v4**, SCSS modules, markdown blog
in `_posts/{nl,en}`, images in `public/`. Deployed to **DigitalOcean App
Platform**.

Everything below was measured against production, not inferred. Where a claim
has a file and line number, it was read in `node_modules`. Please keep that
standard — several plausible-sounding beliefs about this stack turned out to be
wrong when actually tested, and they are recorded here so nobody re-derives
them.

---

## Hosting and the CDN

```
walkedo.com  ->  CNAME walkedo-fei62.ondigitalocean.app  ->  Cloudflare anycast
nameservers: ns1/2/3.digitalocean.com     response header: x-do-app-origin
```

This is **DigitalOcean App Platform behind its own bundled Cloudflare**, not a
Cloudflare zone we control. There is no dashboard, no cache rules, no purge
button, no page rules.

**Consequence: every caching decision has to be a `Cache-Control` header the app
emits.** There is no other lever. Assume you cannot purge; the only way to
invalidate is to wait out the TTL or redeploy.

Two behaviours of that CDN that matter:

- It **ignores `Vary` on custom headers.** `Vary: RSC` is emitted and disregarded.
  (`Vary: Accept-Encoding` is honoured.)
- It **honours the query string** as part of the cache key. Verified:
  `/nl/opvang?foo=bar` and `/nl/opvang` are separate objects.
- It **will not cache a response carrying `Set-Cookie`** — reports
  `cf-cache-status: BYPASS`.

---

## Trap 1 — `headers()` cannot set the Cache-Control of page HTML

`next.config.mjs` `headers()` does **not** work for HTML on Next 14. For any
prerendered route, `base-server.js` (~lines 1690/1710) overwrites the header via
`formatRevalidate()` in `server/lib/revalidate.js`, *after* `headers()` has run.

Tested, not assumed — a rule scoped to the RSC header:

```js
{ source: '/:path*', has: [{ type: 'header', key: 'RSC' }],
  headers: [{ key: 'Cache-Control', value: 'private, no-store' }] }
```

still came back as `s-maxage=3600, stale-while-revalidate`. A `has` condition
makes no difference. Other headers set via `headers()` *do* survive; only
`Cache-Control` on rendered routes is overwritten.

**The only lever for HTML is `export const revalidate`** in the route segment.
It is set in `src/app/[locale]/layout.tsx`.

`headers()` *does* work for static files in `public/`, which is what it is used
for here.

---

## Trap 2 — image TTL and the `public/` header are coupled

`image-optimizer.js` (~line 674) computes the TTL it puts on `/_next/image` as:

```
Math.max(getMaxAge(upstream Cache-Control), images.minimumCacheTTL)
```

and `next-server.js` (~line 651, `fetchInternalImage` → `this.routerServerHandler`)
shows the optimiser fetches its source **through this app's own routing**. So
"upstream" is literally the `headers()` rule for `/images/**`.

**A long `max-age` on `public/` silently becomes the TTL on every optimised
image and overrides `minimumCacheTTL`.** They are both set to 7 days in
`next.config.mjs` deliberately, so the effective value is never a surprise.
Change them together.

Note `public/` filenames are **not** content-hashed (unlike `/_next/static`).
Replacing a photo at the same path means either a new filename or a 7-day tail.

---

## Trap 3 — RSC flight payloads can poison a page URL (partially unfixable)

**The symptom:** a page starts serving `content-type: text/x-component` — the raw
React flight payload — to ordinary browsers. Blank or garbled page. Refreshing
does not fix it, because the CDN keeps returning the same cached object.

**The chain, each step verified:**

1. A `redirects()` entry in `next.config.mjs` strips Next's own RSC
   cache-buster. `prepare-destination.js` line ~145: `delete
   query[NEXT_RSC_UNION_QUERY]`. Live proof:
   `/opvang?_rsc=abc&foo=bar` → `301 Location: /nl/opvang?foo=bar`.
   `foo` survives; only `_rsc` is removed.
2. The client re-sends `RSC: 1` to the now-bare destination.
3. Origin answers with a flight payload, carrying whatever `s-maxage` the route
   has.
4. The CDN ignores `Vary: RSC` and caches it under the plain page URL.

Next adds `?_rsc=` *specifically* to prevent this — its own source comment reads
"avoid caching conflicts on CDN which don't respect to Vary header".

**Three fixes were tried against a real build. All three fail. Do not retry:**

| Attempt | Why it fails |
|---|---|
| Move the redirects into middleware so `${search}` carries `_rsc` across | `server/web/adapter.js` line ~130 builds the `NextRequest` with `stripInternalSearchParams()`, and `INTERNAL_QUERY_NAMES` includes `NEXT_RSC_UNION_QUERY`. Middleware never sees `_rsc`, in `nextUrl` or in `request.url`. |
| Detect the RSC request in middleware and mark it `no-store` | Next strips the flight headers before middleware runs. Confirmed by echoing received header names back on a request that demonstrably returned a flight response: `rsc`, `next-router-state-tree`, `next-router-prefetch` all absent. |
| `headers()` with `has: [{ type: 'header', key: 'RSC' }]` | See Trap 1. |

Middleware is **structurally blind to RSC requests** on 14.2.4.

**What actually contains it:** `export const revalidate = 3600` in
`src/app/[locale]/layout.tsx`. It was previously unset, so `formatRevalidate()`
fell through to its default of `s-maxage=31536000` — **one year**. Four pages
(`/nl/news`, `/nl/opvang`, `/nl/uitlaatservice`, `/nl/casting`) were found
poisoned in production with ages of 2–3 days.

The window is now one hour. **If broken pages are still reported, lower that
number — it is the only lever that works.** A proper fix likely needs a Next
upgrade.

---

## Locale detection

`src/middleware.ts`. Order: `NEXT_LOCALE` cookie → geo header → `Accept-Language`
→ `en`.

The geo header list is `["cf-ipcountry", "x-vercel-ip-country"]`. It used to be
**only** `x-vercel-ip-country`, which **does not exist on DigitalOcean** — so
`country` was always `""`, the `=== "NL"` test could never be true, and *every*
unprefixed visitor was redirected to `/en`, including Dutch ones, on a site whose
market is Arnhem. Confirmed live: `Accept-Language` of `nl-NL`, `en-US` and
`de-DE` all redirected to `/en`.

Neither geo header is actually present on DO's bundled CDN today; the list is
kept so detection follows the app if it moves host. `Accept-Language` is the
path that runs in practice.

The unprefixed redirect is content-negotiated per visitor, so it sets
`Cache-Control: private, no-store` and `Vary: Accept-Language, Cookie`. Do not
let that redirect become shared-cacheable — one cached copy pins every later
visitor to one language.

**The `NEXT_LOCALE` cookie is written client-side, by the footer language
switcher** (`src/layout/footer/language-switcher.tsx`), not by middleware.
`localeCookie: false` is set in `src/i18n/routing.ts` to stop next-intl writing
it too. Reason: a `Set-Cookie` on a page response makes the CDN `BYPASS`, so
every first-time visitor fell through to an origin render. Without JS the
language link still works, the choice just does not persist.

---

## Images

- `deviceSizes` is trimmed to end at **1920** (default ends at 3840). Production
  was fetching 3840-wide variants for 500px-wide boxes. A cold optimise of a
  5 MB source PNG measured **10.3 s** against production; warm, 0.27 s. The
  origin's disk cache works, but DO starts every deploy with an empty
  `.next/cache`, so every `(image, width, quality)` pays that cost once per
  deploy.
- **No AVIF.** `formats` is `['image/webp']` on purpose. AVIF encodes far slower
  in sharp, and `imageOptimizer()` is called straight from the request handler
  with no request-level queue — only sharp's libvips pool is capped
  (`image-optimizer.js` ~line 149). On a small instance AVIF makes the cold
  transform problem worse.
- **Always pass `sizes` with `fill`.** Without it next/image assumes `100vw` and
  picks the widest rung. Eight images were missing it; two more had
  `sizes='max-width: 100vw'`, which is not valid media-query syntax and was
  silently discarded.
- `objectFit` / `objectPosition` **are still honoured** by next/image 14 as
  legacy props — `get-img-props.js` line ~122 destructures them and ~370 folds
  them into the inline style. They are *not* dead props and do *not* leak to the
  DOM. (This was initially misdiagnosed. The emitted `style` attribute is
  byte-identical whether you pass them as props or via `style`.)

### Measured effect of the image changes

Both sides negotiated with `Accept: image/webp,image/avif,*/*` — i.e. what a
real browser sends. Measuring without an `Accept` header inflates the "before"
roughly 3.5×, because the optimiser then falls back to JPEG; do not quote such
numbers.

| Page | before | after |
|---|---|---|
| `/nl/news` | 837 KB | 367 KB (−56%) |
| `/nl` (excl. the 3.1 MB video) | 4085 KB | 3032 KB (−26%) |
| `/nl/uitlaatservice` | 4472 KB | 3722 KB (−16%) |
| `/nl/northern-Inuit-dog` | 949 KB | 836 KB (−11%) |

The news hero alone: 706 KB → 225 KB.

---

## Known, deliberately not done

- **`public/` is 97 MB**, almost all photographs, with the largest stored as
  PNG (`honden-3.png` is 5.4 MB). No WebP/AVIF sources anywhere. Recompressing
  and downscaling the sources is the single biggest remaining win — it would cut
  both the cold-transform time and the deploy size. Deferred as an explicit
  scope decision, not an oversight.
- **21 files / 15.6 MB in `public/` are unreferenced.** Scan them with a
  basename grep across `src components lib styles messages _posts`, plus
  `next.config.mjs` and `public/favicon/site.webmanifest`. **Beware dynamic
  paths**: `ogImage(name)` in `src/i18n/metadata.ts` builds
  `/images/og/${name}.jpg`, and `site.webmanifest` references the
  `web-app-manifest-*.png` icons. Neither shows up in a naive path grep.
  Current list includes `walking-dogs-hero.jpg` (2.3 MB),
  `inuit-dog/northern-inuit-grass.jpeg` (3.8 MB),
  `opvang/hond-genieten-zon.jpeg` (3.4 MB), and several near-duplicate pairs
  (`opvang-3.jpg` is used, `opvang-3.jpeg` is not).
- **Four hero images still pass `objectPosition` as a prop while their CSS class
  also sets `object-position: 0% 0%`** (`opvang:18`, `casting:44`,
  `dagopvang:20`, `northern-Inuit-dog:28`). The inline style wins, so the props
  are what render. Left alone because rationalising them is an art-direction
  decision, not a performance one.
- **`getAllPosts()` fully parses every markdown file** — including shiki
  highlighting via `rehype-pretty-code` — just to render the news listing, which
  only needs title/date/slug. Build-time cost only, 14 files, not currently
  worth fixing.
- **Markdown article bodies contain no images at all.** They render through
  `rehype-stringify` into `dangerouslySetInnerHTML`, so there is no components
  map and no `img` override. If an image is ever added to a post it will be a
  raw `<img>` that bypasses the optimiser entirely — that is the moment to add
  a renderer, not before.

---

## Verifying a change to any of this

```bash
npm run build && npx next start -p 3210

# HTML must be s-maxage=3600, never 31536000
curl -sI localhost:3210/nl | grep -i cache-control
# must be empty -- a Set-Cookie here makes the CDN BYPASS
curl -sI localhost:3210/nl/opvang | grep -i set-cookie
# public/ assets: 7 days, matching images.minimumCacheTTL
curl -sI localhost:3210/images/brand/walkedo-logo.svg | grep -i cache-control
# optimised images: 7 days; 2048 and 3840 must 400
curl -sI 'localhost:3210/_next/image?url=%2Fimages%2Fnews%2Fnews-header.jpg&w=1920&q=75' | grep -i cache-control
curl -s -o /dev/null -w '%{http_code}\n' 'localhost:3210/_next/image?url=%2Fimages%2Fnews%2Fnews-header.jpg&w=3840&q=75'
# locale detection
curl -sI -H 'Accept-Language: nl-NL' localhost:3210/ | grep -i location   # -> /nl
curl -sI -H 'Accept-Language: de-DE' localhost:3210/ | grep -i location   # -> /en
```

Then walk the pages in a browser at desktop and mobile width and check CLS and
that nothing is stretched or missing. The `sizes` and `deviceSizes` values are
exactly the kind of change that breaks art silently.
