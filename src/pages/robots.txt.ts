import type { APIRoute } from "astro";
import { SITE_URL, SITE_INDEXABLE } from "../config/site";

/**
 * Generated rather than static so it follows SITE_INDEXABLE — a file in public/
 * cannot, and a demo deployment inviting crawlers in to find canonicals that
 * 404 on the real domain is the whole problem we are avoiding.
 */
export const GET: APIRoute = () => {
  const body = SITE_INDEXABLE
    ? `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap-index.xml
`
    : `# Demo / preview deployment — NOT the canonical site.
# nvpower.bg is the live site; this build declares canonicals pointing there,
# so it must not be indexed or it competes with the real thing.
# Flip SITE_INDEXABLE in src/config/site.ts when this becomes nvpower.bg.
User-agent: *
Disallow: /
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
