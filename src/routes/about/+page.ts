import { ENV } from '$lib/config/env';
import type { PageLoad } from './$types';
import type { About } from '$lib/types/about';
import type { ApiResponse } from '$lib/types/api';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch(`${ENV.apiBaseUrl}/about`);
	if (!res.ok) {
		throw error(404, 'About not found');
	}
	const json: ApiResponse<About> = await res.json();
	return {
		about: json.data
	};
};
