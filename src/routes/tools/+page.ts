import { ENV } from '$lib/config/env';
import type { PageLoad } from './$types';
import type { Tool } from '$lib/types/tool';
import type { ApiResponse, PaginatedData } from '$lib/types/api';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch(`${ENV.apiBaseUrl}/tools`);
	if (!res.ok) {
		throw new Error('Failed to fetch tools');
	}
	const json: ApiResponse<PaginatedData<Tool>> = await res.json();
	return {
		tools: json.data.items.sort((a, b) => a.position - b.position)
	};
};
