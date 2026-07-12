<script lang="ts">
	import type { PageProps } from './$types';
	import type { ProjectImage } from '$lib/types/project';

	let { data }: PageProps = $props();

	let thumbnail = $derived(
		data.project.images.find((img: ProjectImage) => img.type === 'thumbnail')
	);
	let isPrivate = $derived(data.project.visibility === 'private');
</script>

<svelte:head>
	<title>{data.project.title}</title>
</svelte:head>

<div class="w-full max-w-3xl px-8 py-16 lg:py-24">
	<a
		href="/simple#projects"
		class="text-xs tracking-[0.2em] uppercase opacity-50 transition-opacity hover:opacity-100"
	>
		Back to all projects
	</a>

	<header class="mt-12">
		<p class="text-xs tracking-[0.2em] uppercase opacity-40">
			{data.project.category} · {data.project.year}{isPrivate ? ' · Private' : ''}
		</p>
		<h1 class="font-clash mt-3 text-4xl font-bold md:text-5xl">{data.project.title}</h1>
	</header>

	{#if thumbnail}
		<img
			src={thumbnail.imageUrl}
			alt={data.project.title}
			class="mt-10 aspect-video w-full object-cover"
		/>
	{/if}

	{#if isPrivate}
		<div class="mt-12">
			<p class="mb-5 text-xs tracking-[0.4em] uppercase opacity-30">Private Project</p>
			<h2 class="font-clash mb-6 text-2xl leading-tight font-bold text-balance">
				This one stays behind closed doors.
			</h2>
			<p class="leading-loose opacity-75">
				I'm really sorry I can't share more screenshots or details for this project due to its
				private nature. I still wanted to include it here because I'm really proud of the work. If
				we ever get to chat, I'd be happy to walk you through what I can.
			</p>
		</div>
	{:else if data.project.texts.length > 0}
		<div class="mt-12 flex flex-col gap-6">
			{#each data.project.texts as text}
				<p class="leading-loose opacity-75">{text.content}</p>
			{/each}
		</div>
	{/if}

	{#if data.project.nextProject}
		<div class="mt-20 border-t border-black/10 pt-8">
			<p class="text-xs tracking-[0.2em] uppercase opacity-40">Next project</p>
			<a
				href={`/simple/project/${data.project.nextProject.id}`}
				class="font-clash mt-2 inline-block text-2xl font-semibold underline-offset-4 hover:underline"
			>
				{data.project.nextProject.title}
			</a>
		</div>
	{/if}
</div>
