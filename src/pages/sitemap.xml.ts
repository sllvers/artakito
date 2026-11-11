import type { APIRoute } from 'astro';
import { artworks } from '../lib/content';

// Explicit public routes keep error pages and future private routes out of the sitemap.
export const GET: APIRoute = ({ site }) => {
  const paths = [
    '/',
    '/works/',
    '/contact/',
    '/privacy/',
    '/privacy-policy/',
    ...artworks.map(({ catalog }) => `/works/${encodeURIComponent(catalog)}/`),
  ];
  const urls = paths.map((path) => {
    const location = new URL(path, site).href.replace(/&/g, '&amp;');
    return `<url><loc>${location}</loc></url>`;
  });

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
