/**
 * Every page lives under `src/app/[locale]`, and that layout renders <html>
 * and <body> because the lang attribute depends on the active locale. This
 * root layout therefore only passes children through.
 *
 * Trade-off: because <html> is emitted one level down, a notFound() raised at
 * request time (an unknown path inside a locale) is delivered as an RSC
 * payload and rendered on the client rather than server-rendered. The status
 * code is still 404, so it is never indexed; only the first paint is delayed.
 * The prerendered root 404 at /_not-found is unaffected and renders normally.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return children;
}
