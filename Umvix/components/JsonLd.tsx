/**
 * Renders a Schema.org JSON-LD block. Server component by design — the markup
 * must be in the initial HTML so crawlers see it without executing JavaScript.
 */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is inserted verbatim; `<` is escaped so a value
      // can never terminate the script tag early.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
