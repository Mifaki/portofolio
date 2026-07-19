<script lang="ts">
	import type { PageProps } from './$types';
	import ProjectDetail from '$lib/components/ProjectDetail.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { page } from '$app/state';
	import { SITE, descriptionFromTexts, projectJsonLd } from '$lib/utils/seo';

	let { data }: PageProps = $props();

	let thumbnail = $derived(data.project.images.find((img) => img.type === 'thumbnail'));
</script>

<Seo
	title={`${data.project.title} - ${SITE.name}`}
	description={descriptionFromTexts(data.project.texts)}
	image={thumbnail?.imageUrl}
	type="article"
	jsonLd={projectJsonLd(data.project, page.url.origin + page.url.pathname)}
/>

<ProjectDetail project={data.project} />
