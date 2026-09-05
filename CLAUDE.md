# Walkedo — notes for whoever works on this next

Next.js **16.3.4**, **App Router**, **React 19**, **next-intl v4**, SCSS modules,
markdown blog in `_posts/{nl,en}`, images in `public/`. Deployed to
**DigitalOcean App Platform**.

**Node >= 20.9 is mandatory** — Next 16 declares it in `engines` and will not
run on 18. Pinned here in `package.json` `engines` and `.nvmrc`. Check the App
Platform runtime matches before deploying.

Built with **Turbopack** (the Next 16 default). `next build --webpack` still
works and produces the same bundle sizes, but takes about twice as long
(20.9s vs 10.2s clean, measured).

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

## Trap 1 — `headers()` and page HTML (FIXED in Next 16 — read the reversal)

**This trap no longer applies.** On Next 16, `headers()` **does** set the
Cache-Control of page HTML. Re-tested on 16.3.4 by adding
`{ source: '/:path*', headers: [{ key: 'Cache-Control',
value: 'private, no-store, TRAP1PROBE' }] }` and rebuilding: the response for
`/nl` came back as exactly that, probe token and all. `formatRevalidate()` no
longer wins.

**The new hazard is the opposite one:** a broad `headers()` rule will now
silently clobber the caching that `export const revalidate` sets up. Scope any
Cache-Control rule to the paths it is meant for — as the `public/` rules here
already are — and do not add a `/:path*` catch-all.

The rest of this section is the Next 14 behaviour, kept because it explains why
the config is shaped the way it is.

---

`next.config.mjs` `headers()` did **not** work for HTML on Next 14. For any
prerendered route, `base-server.js` (~lines 1690/1710) overwrote the header via
`formatRevalidate()` in `server/lib/revalidate.js`, *after* `headers()` had run.

Tested, not assumed — a rule scoped to the RSC header:

```js
{ source: '/:path*', has: [{ type: 'header', key: 'RSC' }],
  headers: [{ key: 'Cache-Control', value: 'private, no-store' }] }
```

still came back as `s-maxage=3600, stale-while-revalidate`. A `has` condition
makes no difference. Other headers set via `headers()` *do* survive; only
`Cache-Control` on rendered routes is overwritten.

On 14 the only lever for HTML was `export const revalidate` in the route
segment, set in `src/app/[locale]/layout.tsx`. That is still what this app uses
(now alongside `expireTime`, see below) — it just is not the *only* option any
more.

`headers()` *does* work for static files in `public/`, which is what it is used
for here.

---

## Trap 2 — image TTL and the `public/` header are coupled

`image-optimizer.js` (~line 1081 on 16.x) computes the TTL it puts on
`/_next/image` as:

```
Math.max(images.minimumCacheTTL, getMaxAge(upstream Cache-Control))
```

and `next-server.js` (`fetchInternalImage` → `this.routerServerHandler`)
shows the optimiser fetches its source **through this app's own routing**. So
"upstream" is literally the `headers()` rule for `/images/**`.

Because it is a `max()`, **the larger of the two always wins.** They are now
deliberately *not* equal: `minimumCacheTTL` is **30 days** and the `public/`
header is **7 days**, so `minimumCacheTTL` dominates and the effective TTL on
every optimised image is unambiguously 30 days. The trap only bites the other
way round — raising the `public/` header above `minimumCacheTTL` would silently
take over. Keep `minimumCacheTTL` the larger of the two.

The image TTL was 7 days on Next 14 and could not safely be longer; see the
HEAD-poisoning section below for why, and why 30 days is now fine.

Note `public/` filenames are **not** content-hashed (unlike `/_next/static`).
Replacing a photo at the same path means either a new filename or a 7-day tail.

---

## Trap 3 — RSC flight payloads poisoning a page URL (FIXED in Next 16)

**Fixed at the source by the Next 16 upgrade.** Two independent changes close
it, both re-tested on 16.3.4 against a real build:

1. **The redirect no longer strips `_rsc`.** `/opvang?_rsc=abc&foo=bar` now
   returns `301 Location: /nl/opvang?_rsc=abc&foo=bar` — the cache-buster
   survives. On 14.2.4 the same request returned `/nl/opvang?foo=bar`.
2. **Next refuses to serve a flight payload at a bare page URL.** A request with
   `RSC: 1` to `/nl/opvang` now returns `307 Location: /nl/opvang?_rsc`, forcing
   the client onto a distinct URL before any payload is produced. A CDN
   therefore has nothing to cache under the plain page URL.

`Vary` is also now emitted as
`rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch,
Accept-Encoding` rather than the bare `RSC` that DigitalOcean's CDN ignored.

Verified afterwards that `/nl/opvang` still answers `200 text/html`.

The `revalidate = 3600` cap in `src/app/[locale]/layout.tsx` is kept as
defence-in-depth, now paired with `expireTime` (below) so the stale window is
bounded too.

The original problem, kept because it explains the redirect comments in
`next.config.mjs`:

---

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

**Three workarounds were tried against a Next 14 build. All three failed** —
recorded so nobody retries them on 14, and to show why the version bump was the
only real fix:

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

The window was reduced to one hour as containment. The Next 16 upgrade is the
proper fix that note anticipated.

---

## Locale detection

`src/proxy.ts`. Order: `NEXT_LOCALE` cookie → geo header → `Accept-Language`
→ `en`.

**The file is `proxy.ts`, not `middleware.ts`.** Next 16 renamed the convention
and warns on every build if you use the old name (`The "middleware" file
convention is deprecated. Please use "proxy" instead.`). It is the same default
-export-a-function contract, the same `export const config = { matcher }`, and
next-intl's `createMiddleware` works unchanged inside it. There is a codemod:
`npx @next/codemod@canary middleware-to-proxy .`. The build output now labels it
`Proxy (Middleware)`.

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
switcher** (`src/layout/footer/language-switcher.tsx`), not by the proxy.
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
  in sharp, and there is still no request-level queue in front of the optimiser
  — only sharp's libvips pool is capped, which is what
  `experimental.imgOptConcurrency` now sets explicitly. On a small instance AVIF
  makes the cold transform problem worse.
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

## The image cache could be poisoned by a HEAD request (FIXED in Next 16)

This is the bug the upgrade was for. **Reproduced on 14.2.4 before upgrading and
re-tested after**, both against a real `next build && next start`.

On Next 14, `fetchInternalImage()` copied the *incoming* request method into the
internal fetch it makes for the source file:

```js
// next@14.2.4 server/image-optimizer.js:583
method: _req.method || "GET",
```

So a `HEAD /_next/image?...` produced a HEAD for the source too, which has no
body. `Buffer.concat(mocked.res.buffers)` was empty, sharp failed on it, the
`catch` fell back to "return the upstream buffer" — an empty buffer — and that
zero-byte result was written to the cache with a 200.

Measured on 14.2.4, cold URL:

| step | result |
|---|---|
| `HEAD` the URL | `200`, `X-Nextjs-Cache: MISS`, `Content-Length: 0`, type degraded to `image/jpeg` |
| `GET` the same URL | `200`, `X-Nextjs-Cache: HIT`, **`Content-Length: 0`** |

A blank image, served to every visitor for the full `minimumCacheTTL`. Control:
the same URL fetched GET-first returned 36,856 bytes of `image/webp`, and a HEAD
*after* that was harmless. **Crawlers HEAD srcset URLs**, so this happened
unprompted.

Next 16 closes it twice over:

```js
// next@16.3.4 server/image-optimizer.js:1023
// Coerce HEAD to GET to avoid issues with the image optimizer
const method = !_req.method || _req.method === 'HEAD' ? 'GET' : _req.method;
```

and, at ~line 1040, an empty upstream body is now a hard `ImageError` rather
than a cacheable result. Measured on 16.3.4: HEAD-first on a cold URL returns
`Content-Length: 36570`, `image/webp`, and the following GET is a `HIT` with the
same length and a valid 1080x714 WebP on disk.

**This is why `minimumCacheTTL` could go from 7 to 30 days.** Do not raise it on
a Next 14 deployment — there, a poisoned entry simply lasts that much longer.

---

## Two Next 16 options this app now uses

- **`experimental.imgOptConcurrency: 1`** pins libvips' thread pool.
  `image-optimizer.js` passes it straight to `sharp.concurrency()`. sharp
  otherwise sizes that pool from the CPUs it can *see*, which in a container is
  the host's core count rather than the vCPU share the instance is allowed — so
  it spawns far more threads than it can run, each holding its own decode
  buffers. Set it to the instance's real vCPU count; 1 is right for a basic App
  Platform instance. Next 14 had no equivalent lever.

- **`expireTime: 7200`** caps `stale-while-revalidate` on HTML. Next 14 emitted
  a bare `stale-while-revalidate` with no value and no way to change it, which
  entitles a shared cache to serve a stale object more or less indefinitely.
  **It is the total lifetime, not the stale window** — Next emits
  `stale-while-revalidate = expireTime - revalidate`, so setting it *equal* to
  `revalidate` removes stale serving altogether. At 7200 against the layout's
  `revalidate = 3600` the emitted header is
  `s-maxage=3600, stale-while-revalidate=3600`.

---

## Dependency tree

`npm audit` is **clean (0 vulnerabilities)**. It was 38 (2 critical, 27 high)
before. Two roots accounted for essentially all of it:

- **`react-multi-carousel` was removed.** It listed `npm` (the CLI, 17 MB on
  disk) and `install` among its *runtime* dependencies — almost certainly by
  accident — and those pulled in 22 of the 38 advisories, including both
  criticals. Nothing had been published since April 2025, so there was no fixed
  version to move to. It was used on exactly one page.

  Replaced by `components/carousel/carousel.tsx`, a local component reproducing
  what the casting page actually asked for: 3/2/1 items per view by breakpoint,
  drag and swipe, autoplay with pause-on-hover, keyboard control, and a seamless
  infinite loop. Scrolling is native CSS scroll-snap, so touch swipe, momentum
  and focus handling come for free.

  Two things in it are non-obvious and are commented in the file:
  **`scrollBy({ behavior: 'smooth' })` does not work** on a container with
  `scroll-snap-type: x mandatory` — measured: a smooth scrollBy of exactly one
  slide width left `scrollLeft` completely unchanged, while `behavior: 'auto'`
  moved it correctly. The tween is therefore done by hand with snapping switched
  off for its duration. And the tween falls back to an instant jump when
  `document.hidden`, because `requestAnimationFrame` does not fire in a hidden
  tab and would otherwise strand the track mid-slide with snapping disabled.

- **`sharp` 0.33.4 → 0.35.4**, clearing four libvips CVEs.

The rest cleared with the upgrade itself or `npm audit fix`. `nodemailer` went
6 → 10; only `createTransport` and `sendMail` are used and both are unchanged.

**There is no Tailwind or PostCSS in this repo** — checked, in case the same
"configured but inert" cleanup from the sibling site was expected here. There is
no `postcss.config.*`, no Tailwind in `package-lock.json`, and no `@tailwind`
directive anywhere. Nothing to remove.

`eslint`, `typescript` and all `@types/*` are in **devDependencies**, which
assumes the App Platform build installs dev dependencies (the default for
`npm ci` / `npm install` unless `NODE_ENV=production` or `--omit=dev` is set).
If the build is ever switched to production-only installs, the build will fail
on the type check.

**TypeScript is pinned to 5.9.3.** `typescript@latest` is now **7.x** — the
native port, a brand-new major. It is deliberately not taken here: it is
unrelated to this upgrade and its compatibility with typescript-eslint is
unproven. That is a separate decision.

---

## Linting

`next lint` **no longer exists** — there is no `next-lint.js` in
`next/dist/cli`. Linting is a plain `eslint .` (`npm run lint`) against
`eslint.config.mjs`, flat config. `.eslintrc.json` is gone.

**ESLint is pinned to 9 and must stay there.** `eslint-config-next@16.3.4`
declares `"eslint": ">=9.0.0"`, which reads as though 10 is fine. It is not: the
`eslint-plugin-react` vendored inside `@next/eslint-plugin-next` still calls the
removed `context.getFilename()`. The peer range is simply wrong. Revisit when
that plugin moves to `context.filename`.

The stricter React 19 rules surfaced six genuine pre-existing issues, all fixed
properly rather than suppressed — nothing in this repo is disabled with an
inline comment. The interesting one was `src/app/[locale]/aanmelden/signup-form.tsx`,
which kept `values` and `services` in refs assigned *during render*
(`react-hooks/refs`). Those refs existed to dodge a real bug — a blur handler
closes over the render that created it, so when a change and a blur landed in
the same batch, as browser autofill does, it validated the previous value.
`errors` is now derived in render (`submitted ? validate(services, values) : {}`)
instead of being state, which removes the race at the source. Verified in a
browser: after a failed submit, typing into a field clears its error **without a
blur**.

---

## Sass and Turbopack

Turbopack does not put the project root on Sass's load path the way webpack's
sass-loader did, and all 21 `.scss` files here use root-relative
`@import "styles/..."`. Fixed with `sassOptions.loadPaths: [projectRoot]`. It
**must** be `loadPaths` — the older `includePaths` name is a node-sass-ism that
modern Dart Sass ignores silently: no error, imports still unresolved.

`sassOptions.silenceDeprecations: ['import']` suppresses the Dart Sass 1.80
`@import` deprecation. Migrating the 21 files to `@use`/`@forward` is a real
refactor (no more global scope, explicit namespacing) and is deliberately not
part of this upgrade.

`map-get` **was** migrated, because that one is cheap: the five files in
`styles/functions/` now `@use "sass:map"` and call `map.get`. Global built-ins
are removed in Dart Sass 3.0, and the module form works fine inside an
`@import`-ed file.

`turbopack.root` is pinned to the project directory. Turbopack finds the
"project root" by walking up for a lockfile and there is a stray
`~/package-lock.json` above this repo, which it otherwise picks. Pin it; do not
delete a file that belongs to someone else.

---

## Bundle size — the cost of this upgrade

Measured as the gzipped total of every JS asset a page actually loads,
**excluding the `noModule` polyfills chunk**, which only legacy browsers fetch.
Counting it overstates every figure by ~30-38 KB.

| Page | Next 14.2.4 + React 18 | Next 16.3.4 + React 19 | delta |
|---|---|---|---|
| `/nl` | 126.6 KB | 165.2 KB | +38.6 (+30%) |
| `/nl/casting` | 132.9 KB | 166.1 KB | +33.2 (+25%) |
| `/nl/news` | 123.9 KB | 163.3 KB | +39.4 (+32%) |

Where it goes, on `/nl`: the vendored React grew 53.7 → 63.2 KB, and the
framework/app chunks ~62.3 → ~80.2 KB. This is inherent to Next 16 and was
accepted as the price of the fixes above.

**React 18 vs React 19 makes no difference to this number**, and the reason is
worth knowing: Next's App Router **aliases `react` and `react-dom` to its own
vendored copy** (`next/dist/compiled/react`, package name `react-builtin`; see
`createVendoredReactAliases` in `build/webpack-config.js:1275`). Proved
empirically — with `react@18.3.1` installed, the built client chunks contained
only React 19's `__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE`
(3 chunks) and *zero* React 18 `__SECRET_INTERNALS_...` markers, and the byte
counts were identical to the React 19 build. **What `package.json` declares for
React affects types and DX, not what ships to the browser.** It is set to 19 so
the types describe the React that actually runs.

---

## Other Next 16 behaviour changes seen here

- **`params` is a Promise.** Every `page.tsx` / `layout.tsx` / `generateMetadata`
  taking `{ params }` had to become `Promise<{ locale: string }>` and `await` it.
  16 files. The build fails the type check otherwise.
- **`images.qualities` is enforced.** Only the default `q=75` is accepted now;
  `/_next/image?...&q=61` returns `400 "q" parameter (quality) of 61 is not
  allowed`. Harmless here — no `quality` prop is passed anywhere in this repo —
  but set `images.qualities` if one is ever added.
- Next rewrote `tsconfig.json` on first build: `jsx: preserve` → `react-jsx`,
  added `target: ES2017` and `.next/dev/types`. `moduleResolution` was already
  `bundler`.

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
  also sets `object-position: 0% 0%`** (`opvang:18`, `casting:26`,
  `dagopvang:20`, `northern-Inuit-dog:28`). The inline style wins, so the props
  are what render. Left alone because rationalising them is an art-direction
  decision, not a performance one.
- **`getAllPosts()` fully parses every markdown file** — including shiki
  highlighting via `rehype-pretty-code` — just to render the news listing, which
  only needs title/date/slug. Build-time cost only, 14 files, not currently
  worth fixing.
- **The SCSS is still on `@import`, not `@use`/`@forward`.** 21 files, silenced
  via `sassOptions.silenceDeprecations: ['import']`. Dart Sass will remove
  `@import` in 3.0, so this has a deadline. It is a real refactor — the module
  system drops global scope and requires explicit namespacing at every call site
  — and deliberately was not bundled into a dependency upgrade. The `map-get`
  → `map.get` half was done, because that one is local to five files.
- **TypeScript is held at 5.9.3 while `latest` is 7.x.** The 7.0 native port is
  a separate evaluation, notably for typescript-eslint compatibility.
- **The +38.5 KB gzip that Next 16 costs was accepted, not attacked.** If it
  ever matters, the two things worth measuring are a `browserslist` target (the
  polyfills chunk grew 30.3 → 38.4 KB, though it is `noModule` and modern
  browsers skip it) and whether any `'use client'` component can move back to
  the server. Neither was investigated.
- **Markdown article bodies contain no images at all.** They render through
  `rehype-stringify` into `dangerouslySetInnerHTML`, so there is no components
  map and no `img` override. If an image is ever added to a post it will be a
  raw `<img>` that bypasses the optimiser entirely — that is the moment to add
  a renderer, not before.

---

## Verifying a change to any of this

```bash
npm run build && npx next start -p 3210

# HTML: bounded stale window, never a bare `stale-while-revalidate`
curl -sI localhost:3210/nl | grep -i cache-control
#   -> s-maxage=3600, stale-while-revalidate=3600

# must be empty -- a Set-Cookie here makes the CDN BYPASS
curl -sI localhost:3210/nl/opvang | grep -i set-cookie

# public/ assets: 7 days. Must stay BELOW images.minimumCacheTTL.
curl -sI localhost:3210/images/brand/walkedo-logo.svg | grep -i cache-control

# optimised images: 30 days; 2048 and 3840 must 400
curl -sI 'localhost:3210/_next/image?url=%2Fimages%2Fnews%2Fnews-header.jpg&w=1920&q=75' | grep -i cache-control
curl -s -o /dev/null -w '%{http_code}\n' 'localhost:3210/_next/image?url=%2Fimages%2Fnews%2Fnews-header.jpg&w=3840&q=75'

# HEAD must NOT poison the image cache: both lines must show the same
# non-zero Content-Length. A zero here is the Next 14 regression coming back.
IMG='localhost:3210/_next/image?url=%2Fimages%2Fcasting%2Ffilm-productie.jpg&w=1080&q=75'
curl -sI -H 'Accept: image/webp,*/*' "$IMG" | grep -i content-length
curl -s -D- -o /dev/null -H 'Accept: image/webp,*/*' "$IMG" | grep -i content-length

# RSC cache-buster must survive the redirect, and a bare RSC request must be
# bounced onto a _rsc URL rather than answered with a flight payload
curl -sI 'localhost:3210/opvang?_rsc=abc&foo=bar' | grep -i location   # -> ...?_rsc=abc&foo=bar
curl -sI -H 'RSC: 1' localhost:3210/nl/opvang | grep -iE '^HTTP|location'  # -> 307 ...?_rsc

# locale detection
curl -sI -H 'Accept-Language: nl-NL' localhost:3210/ | grep -i location   # -> /nl
curl -sI -H 'Accept-Language: de-DE' localhost:3210/ | grep -i location   # -> /en

# static checks
npm run lint && npm run typecheck && npm audit
```

Then walk the pages in a browser at desktop and mobile width and check CLS and
that nothing is stretched or missing. The `sizes` and `deviceSizes` values are
exactly the kind of change that breaks art silently.

On the casting page specifically, check the carousel: it should show 3 items
above 1024px, 2 above 600px and 1 below, autoplay every 7s, pause on hover, and
loop past the last photo without a visible jump. The loop works by rendering the
slides three times and silently correcting the scroll position back to the
middle copy — if you see it snap, that correction is the thing to look at.
