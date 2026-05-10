<script lang="ts">
	import type { PageProps } from './$types';
	import type { ProjectImage } from '$lib/types/project';
	import { onMount } from 'svelte';
	import gsap from 'gsap';

	let { data }: PageProps = $props();
	const project = data.project;

	const thumbnail = project.images.find((img: ProjectImage) => img.type === 'thumbnail');
	const otherImages = project.images.filter((img: ProjectImage) => img.type !== 'thumbnail');

	let contentEl: HTMLDivElement | undefined;

	onMount(() => {
		if (contentEl) {
			gsap.from(contentEl, {
				opacity: 0,
				y: 30,
				duration: 0.7,
				ease: 'power3.out',
				delay: 0.2
			});
		}
	});
</script>

<div class="min-h-screen w-full bg-white">
	{#if thumbnail}
		<div class="hero-wrapper w-full" style="height: calc(100vh - 112px);">
			<img
				style="view-transition-name: project-hero;"
				class="h-full w-full object-cover"
				src={thumbnail.imageUrl}
				alt={project.title}
			/>
		</div>
	{/if}

	<div bind:this={contentEl} class="mx-auto max-w-4xl px-8 py-16">
		<p class="text-xs tracking-[0.2em] uppercase opacity-60">{project.category}</p>
		<h1 class="font-clash mt-2 text-7xl leading-none font-bold">{project.title}</h1>
		<p class="mt-2 text-sm opacity-60">{project.year}</p>

		<div class="mt-12 space-y-6">
			{#each project.texts as text}
				<p class="text-base leading-relaxed opacity-80">{text.content}</p>
			{/each}
		</div>

		{#if otherImages.length > 0}
			<div class="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
				{#each otherImages as img}
					<img
						class="w-full object-cover"
						class:aspect-square={img.orientation === 'landscape'}
						class:aspect-[3_4]={img.orientation === 'portrait'}
						src={img.imageUrl}
						alt={project.title}
					/>
				{/each}
			</div>
		{/if}
	</div>
</div>
