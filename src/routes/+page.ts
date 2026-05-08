import { ENV } from '$lib/config/env';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {

  const res = await fetch(`${ENV.apiBaseUrl}/projects`);

  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }

  const json = await res.json();

  return {
    projects: json.data
  };
};