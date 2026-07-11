<script lang="ts">
	import type { PageProps } from './$types';
	import ProjectDetail from '$lib/components/ProjectDetail.svelte';

	let { data }: PageProps = $props();
</script>

<ProjectDetail project={data.project} />
