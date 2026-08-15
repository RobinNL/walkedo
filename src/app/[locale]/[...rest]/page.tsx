import { notFound } from "next/navigation";

/**
 * Catch-all so that an unknown path inside a locale (e.g. /nl/does-not-exist)
 * renders the localised 404 rather than the bare root one.
 */
export default function CatchAllPage() {
    notFound();
}
