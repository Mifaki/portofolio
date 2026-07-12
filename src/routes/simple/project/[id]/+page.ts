import { ENV } from '$lib/config/env';
import type { PageLoad } from './$types';
import type { Project } from '$lib/types/project';
import type { ApiResponse } from '$lib/types/api';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ fetch, params }) => {
	const res = await fetch(`${ENV.apiBaseUrl}/projects/${params.id}`);
	if (!res.ok) {
		throw error(404, 'Project not found');
	}
	const json: ApiResponse<Project> = await res.json();
	return {
		project: json.data
	};
};
