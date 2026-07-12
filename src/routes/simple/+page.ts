import { ENV } from '$lib/config/env';
import type { PageLoad } from './$types';
import type { Project } from '$lib/types/project';
import type { About } from '$lib/types/about';
import type { Tool } from '$lib/types/tool';
import type { ApiResponse, PaginatedData } from '$lib/types/api';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ fetch }) => {
	const [projectsRes, aboutRes, toolsRes] = await Promise.all([
		fetch(`${ENV.apiBaseUrl}/projects`),
		fetch(`${ENV.apiBaseUrl}/about`),
		fetch(`${ENV.apiBaseUrl}/tools`)
	]);
	if (!projectsRes.ok || !aboutRes.ok || !toolsRes.ok) {
		throw error(500, 'Failed to load portfolio data');
	}
	const projectsJson: ApiResponse<PaginatedData<Project>> = await projectsRes.json();
	const aboutJson: ApiResponse<About> = await aboutRes.json();
	const toolsJson: ApiResponse<PaginatedData<Tool>> = await toolsRes.json();
	return {
		projects: projectsJson.data.items.sort((a, b) => a.position - b.position),
		about: aboutJson.data,
		tools: toolsJson.data.items.sort((a, b) => a.position - b.position)
	};
};
