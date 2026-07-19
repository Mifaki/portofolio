import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
	const body = `User-agent: *
Allow: /
Disallow: /preview/

Sitemap: ${url.origin}/sitemap.xml
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
