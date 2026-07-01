import Head from '@docusaurus/Head';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Metadata from '@theme-original/DocItem/Metadata';
import React from 'react';

// Point LLM agents at this page's clean markdown twin. An agent that lands on
// the HTML page (via web search) otherwise has no machine-readable pointer to
// the small, self-contained `.md` and ingests the full HTML instead.
// Swizzling DocItem/Metadata (not DocItem/Layout) so this fires for every doc
// page regardless of `docItemComponent` -- ApiItem also renders this component.
// `${permalink}.md` matches the canonical sidecar emitted by llms-txt-plugin.
export default function MetadataWrapper(props) {
  const {metadata} = useDoc();
  const {permalink} = metadata;
  // Advertise the .md twin only where it's a genuine upgrade over the HTML. Skip:
  // - the '/' docs instance (home, /examples): no sidecar generated -> would 404.
  // - /docs/api/*: ApiItem renders the full OpenAPI schema in HTML; the generated
  //   sidecar there is a sub-50-byte stub, strictly worse than the page.
  const advertiseMarkdown =
    (permalink === '/docs' || permalink.startsWith('/docs/')) &&
    !permalink.startsWith('/docs/api/');
  return (
    <>
      <Metadata {...props} />
      {advertiseMarkdown && (
        <Head>
          <link
            rel="alternate"
            type="text/markdown"
            href={`${permalink.replace(/\/$/, '')}.md`}
            title="Markdown version of this page"
          />
        </Head>
      )}
    </>
  );
}
