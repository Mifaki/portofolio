import { ENV } from '$lib/config/env';
import { SITE } from '$lib/utils/seo';
import type { RequestHandler } from './$types';
import type { Project } from '$lib/types/project';
import type { Tool } from '$lib/types/tool';
import type { About } from '$lib/types/about';
import type { ApiResponse, PaginatedData } from '$lib/types/api';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const [aboutRes, projectsRes, toolsRes] = await Promise.all([
		fetch(`${ENV.apiBaseUrl}/about`),
		fetch(`${ENV.apiBaseUrl}/projects`),
		fetch(`${ENV.apiBaseUrl}/tools`)
	]);
	const about: About | null = aboutRes.ok
		? ((await aboutRes.json()) as ApiResponse<About>).data
		: null;
	const projects: Project[] = projectsRes.ok
		? ((await projectsRes.json()) as ApiResponse<PaginatedData<Project>>).data.items
		: [];
	const tools: Tool[] = toolsRes.ok
		? ((await toolsRes.json()) as ApiResponse<PaginatedData<Tool>>).data.items
		: [];

	const links = [about?.github, about?.linkedin, about?.instagram].filter(Boolean);

	const body = `# ${about?.name ?? SITE.name}

> ${SITE.description}

## Pages

- [Home](${url.origin}/): Selected projects
- [About](${url.origin}/about): Bio, work experience, and tech stack
- [Tools](${url.origin}/tools): Tools and side projects
- [Simple version](${url.origin}/simple): Text-only version of this site

## Projects

${projects.map((p) => `- [${p.title}](${url.origin}/project/${p.id}): ${p.category}, ${p.year}`).join('\n')}

## Tools

${tools.map((t) => `- [${t.title}](${url.origin}/tools/${t.id})`).join('\n')}
${links.length ? `\n## Elsewhere\n\n${links.map((l) => `- ${l}`).join('\n')}\n` : ''}`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
