import { ENV } from '$lib/config/env';
import type { PageLoad } from './$types';
import type { Project } from '$lib/types/project';
import type { ApiResponse } from '$lib/types/api';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch(`${ENV.apiBaseUrl}/projects`);
	if (!res.ok) {
		throw new Error('Failed to fetch projects');
	}
	const json: ApiResponse<Project[]> = await res.json();
	return {
		projects: json.data.sort((a, b) => a.position - b.position)
	};
};
