import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {

  const res = await fetch('https://porto-api.ahmad-faiz.my.id/projects');

  if (!res.ok) {
    throw new Error('Failed to fetch projects');
  }

  const json = await res.json();

  return {
    projects: json.data
  };
};