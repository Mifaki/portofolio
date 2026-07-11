import { ENV } from '$lib/config/env';
import type { PageLoad } from './$types';
import type { Tool } from '$lib/types/tool';
import type { ApiResponse } from '$lib/types/api';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ fetch, params }) => {
	const res = await fetch(`${ENV.apiBaseUrl}/tools/${params.id}`);
	if (!res.ok) {
		throw error(404, 'Tool not found');
	}
	const json: ApiResponse<Tool> = await res.json();
	return {
		tool: json.data
	};
};
