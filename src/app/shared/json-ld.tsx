/**
 * Renders a structured-data block.
 *
 * A plain <script> rather than next/script, because the tag has to be present
 * in the server-rendered HTML — that is the only place a crawler looks, and
 * next/script would inject it after hydration.
 *
 * `<` is escaped so a string in the payload can never close the script tag
 * early; JSON.stringify on its own does not protect against that.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
    const json = JSON.stringify(data).replace(/</g, "\\u003c");

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: json }}
        />
    );
}

export default JsonLd;
