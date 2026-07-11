<script lang="ts">
	import { onMount } from 'svelte';
	import ProjectDetail from '$lib/components/ProjectDetail.svelte';
	import { ENV } from '$lib/config/env';
	import type { Project } from '$lib/types/project';

	let project = $state<Project | null>(null);

	onMount(() => {
		function handleMessage(event: MessageEvent) {
			if (event.origin !== ENV.dashboardOrigin) return;
			if (event.data?.type !== 'preview:update') return;
			project = event.data.project as Project;
		}
		window.addEventListener('message', handleMessage);
		if (window.parent !== window) {
			window.parent.postMessage({ type: 'preview:ready' }, ENV.dashboardOrigin);
		}
		return () => window.removeEventListener('message', handleMessage);
	});
</script>

{#if project}
	{#key project}
		<ProjectDetail {project} preview />
	{/key}
{:else}
	<div class="fixed inset-0 flex items-center justify-center bg-white">
		<p class="text-xs tracking-[0.4em] uppercase opacity-30">Waiting for preview data</p>
	</div>
{/if}
