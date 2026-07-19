import { ENV } from '$lib/config/env';
import type { RequestHandler } from './$types';
import type { Project } from '$lib/types/project';
import type { Tool } from '$lib/types/tool';
import type { ApiResponse, PaginatedData } from '$lib/types/api';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const [projectsRes, toolsRes] = await Promise.all([
		fetch(`${ENV.apiBaseUrl}/projects`),
		fetch(`${ENV.apiBaseUrl}/tools`)
	]);
	const projects: Project[] = projectsRes.ok
		? ((await projectsRes.json()) as ApiResponse<PaginatedData<Project>>).data.items
		: [];
	const tools: Tool[] = toolsRes.ok
		? ((await toolsRes.json()) as ApiResponse<PaginatedData<Tool>>).data.items
		: [];

	const entries: { path: string; lastmod?: string }[] = [
		{ path: '/' },
		{ path: '/about' },
		{ path: '/tools' },
		{ path: '/simple' },
		...projects.map((p) => ({ path: `/project/${p.id}`, lastmod: p.modifiedAt })),
		...tools.map((t) => ({ path: `/tools/${t.id}`, lastmod: t.modifiedAt }))
	];

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
	.map(
		(e) =>
			`\t<url><loc>${url.origin}${e.path}</loc>${
				e.lastmod ? `<lastmod>${new Date(e.lastmod).toISOString().slice(0, 10)}</lastmod>` : ''
			}</url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
