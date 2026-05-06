const MARKDOWN_CONTENT_TYPE = 'text/markdown; charset=UTF-8';

function getAcceptEntryQ(parameters) {
  const qParameter = parameters.find((parameter) => parameter.startsWith('q='));
  if (!qParameter) return 1;

  const qValue = Number.parseFloat(qParameter.slice(2));
  return Number.isFinite(qValue) ? qValue : 0;
}

function prefersMarkdown(acceptHeader) {
  if (!acceptHeader) return false;

  let markdownQ = 0;
  let htmlQ = 0;

  for (const entry of acceptHeader.split(',')) {
    const [mediaType, ...parameters] = entry
      .split(';')
      .map((part) => part.trim().toLowerCase());
    const qValue = getAcceptEntryQ(parameters);

    if (mediaType === 'text/markdown') {
      markdownQ = Math.max(markdownQ, qValue);
    } else if (
      mediaType === 'text/html' ||
      mediaType === 'application/xhtml+xml'
    ) {
      htmlQ = Math.max(htmlQ, qValue);
    }
  }

  // Wildcards such as */* or text/* are intentionally not enough to select markdown.
  // Explicit text/markdown ties intentionally favor markdown for agent clients.
  return markdownQ > 0 && markdownQ >= htmlQ;
}

function toMarkdownPath(pathname) {
  const normalizedPathname = pathname.replace(/\/+$/, '') || '/';

  if (
    normalizedPathname.endsWith('.md') ||
    normalizedPathname === '/docs/api' ||
    normalizedPathname.startsWith('/docs/api/') ||
    normalizedPathname.includes('/_')
  ) {
    return '';
  }

  if (normalizedPathname === '/docs') return '/docs.md';
  if (normalizedPathname.startsWith('/docs/'))
    return `${normalizedPathname}.md`;

  return '';
}

function appendVary(headers, headerName) {
  const vary = headers.get('vary');
  if (vary === '*') return;
  if (!vary) {
    headers.set('vary', headerName);
    return;
  }

  const existingHeaders = vary
    .split(',')
    .map((value) => value.trim().toLowerCase());
  if (!existingHeaders.includes(headerName.toLowerCase())) {
    headers.set('vary', `${vary}, ${headerName}`);
  }
}

function isMarkdownCompatibleContentType(contentType) {
  if (!contentType) return false;

  const mediaType = contentType.split(';', 1)[0].trim().toLowerCase();
  return mediaType === 'text/markdown' || mediaType === 'text/plain';
}

async function passThroughWithVary(request, context) {
  const response = await context.next();
  const responseWithVary = new Response(
    request.method === 'HEAD' ? null : response.body,
    response,
  );
  appendVary(responseWithVary.headers, 'Accept');

  return responseWithVary;
}

export default async (request, context) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') return;

  if (!prefersMarkdown(request.headers.get('accept'))) {
    return passThroughWithVary(request, context);
  }

  const url = new URL(request.url);
  const markdownPath = toMarkdownPath(url.pathname);
  if (!markdownPath) return passThroughWithVary(request, context);

  const markdownUrl = new URL(request.url);
  markdownUrl.pathname = markdownPath;

  let markdownResponse;
  try {
    markdownResponse = await context.rewrite(markdownUrl);
  } catch (error) {
    console.warn(
      `Could not rewrite markdown variant for ${url.pathname}: ${error.message}`,
    );
    return passThroughWithVary(request, context);
  }

  if (
    !markdownResponse.ok ||
    !isMarkdownCompatibleContentType(
      markdownResponse.headers.get('content-type'),
    )
  ) {
    return passThroughWithVary(request, context);
  }

  const headers = new Headers(markdownResponse.headers);
  headers.set('content-type', MARKDOWN_CONTENT_TYPE);
  appendVary(headers, 'Accept');

  return new Response(
    request.method === 'HEAD' ? null : markdownResponse.body,
    {
      headers,
      status: markdownResponse.status,
      statusText: markdownResponse.statusText,
    },
  );
};

// Inline config keeps this repo from needing a netlify.toml just to register one edge function.
export const config = {path: ['/docs', '/docs/', '/docs/*']};
