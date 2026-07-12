<script lang="ts">
	import type { PageProps } from './$types';
	import type { ToolImage } from '$lib/types/tool';

	let { data }: PageProps = $props();

	let thumbnail = $derived(data.tool.images.find((img: ToolImage) => img.type === 'thumbnail'));
	let texts = $derived([...data.tool.texts].sort((a, b) => a.position - b.position));
</script>

<svelte:head>
	<title>{data.tool.title}</title>
</svelte:head>

<div class="w-full max-w-3xl px-8 py-16 lg:py-24">
	<a
		href="/simple#tools"
		class="text-xs tracking-[0.2em] uppercase opacity-50 transition-opacity hover:opacity-100"
	>
		Back to all tools
	</a>

	<header class="mt-12">
		<h1 class="font-clash mt-3 text-4xl font-bold md:text-5xl">{data.tool.title}</h1>
		{#if data.tool.url || data.tool.repoUrl}
			<div class="mt-4 flex gap-6 text-xs tracking-[0.2em] uppercase">
				{#if data.tool.url}
					<a
						href={data.tool.url}
						target="_blank"
						rel="noopener noreferrer"
						class="underline underline-offset-4 opacity-50 transition-opacity hover:opacity-100"
						>Live</a
					>
				{/if}
				{#if data.tool.repoUrl}
					<a
						href={data.tool.repoUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="underline underline-offset-4 opacity-50 transition-opacity hover:opacity-100"
						>Code</a
					>
				{/if}
			</div>
		{/if}
	</header>

	{#if thumbnail}
		<img
			src={thumbnail.imageUrl}
			alt={data.tool.title}
			class="mt-10 aspect-video w-full object-cover"
		/>
	{/if}

	{#if texts.length > 0}
		<div class="mt-12 flex flex-col gap-6">
			{#each texts as text}
				<p class="leading-loose opacity-75">{text.content}</p>
			{/each}
		</div>
	{/if}

	{#if data.tool.nextTool}
		<div class="mt-20 border-t border-black/10 pt-8">
			<p class="text-xs tracking-[0.2em] uppercase opacity-40">Next tool</p>
			<a
				href={`/simple/tools/${data.tool.nextTool.id}`}
				class="font-clash mt-2 inline-block text-2xl font-semibold underline-offset-4 hover:underline"
			>
				{data.tool.nextTool.title}
			</a>
		</div>
	{/if}
</div>
