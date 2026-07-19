<script lang="ts">
	import type { PageProps } from './$types';
	import type { ProjectImage } from '$lib/types/project';
	import type { ToolImage } from '$lib/types/tool';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { setExperience } from '$lib/utils/experience';
	import Seo from '$lib/components/Seo.svelte';
	import { SITE, descriptionFromTexts, personJsonLd } from '$lib/utils/seo';

	let { data }: PageProps = $props();

	const MONTHS = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];

	const sections = [
		{ id: 'about', label: 'About' },
		{ id: 'experience', label: 'Experience' },
		{ id: 'projects', label: 'Projects' },
		{ id: 'tools', label: 'Tools' }
	];

	let descriptions = $derived([...data.about.descriptions].sort((a, b) => a.position - b.position));
	let workExperiences = $derived(
		[...data.about.workExperiences].sort((a, b) => a.position - b.position)
	);
	let techGroups = $derived(
		Object.values(
			[...data.about.techStacks]
				.sort((a, b) => a.position - b.position)
				.reduce<Record<string, { name: string; items: string[] }>>((acc, stack) => {
					const key = stack.category.name;
					acc[key] ??= { name: key, items: [] };
					acc[key].items.push(stack.name);
					return acc;
				}, {})
		)
	);

	function formatPeriod(sm: number, sy: number, em: number | null, ey: number | null) {
		const end = em && ey ? `${MONTHS[em - 1]} ${ey}` : 'Present';
		return `${MONTHS[sm - 1]} ${sy} to ${end}`;
	}

	function switchToRich() {
		setExperience('rich');
		goto('/');
	}
</script>

<Seo
	title={`${data.about.name} - ${SITE.role}`}
	description={descriptionFromTexts(data.about.descriptions)}
	jsonLd={personJsonLd(page.url.origin, data.about)}
/>

<div class="w-full max-w-6xl px-8 py-16 lg:flex lg:items-start lg:gap-20 lg:py-24">
	<header class="mb-16 lg:sticky lg:top-24 lg:mb-0 lg:w-2/5">
		<h1 class="font-clash text-4xl font-bold md:text-5xl">{data.about.name}</h1>
		<p class="mt-3 text-xs tracking-[0.3em] uppercase opacity-50">Simple version</p>

		<nav class="mt-12 hidden lg:block">
			<ul class="flex flex-col gap-3">
				{#each sections as section}
					<li>
						<a
							href={'#' + section.id}
							class="text-xs tracking-[0.2em] uppercase opacity-50 transition-opacity hover:opacity-100"
						>
							{section.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="mt-12 flex flex-wrap gap-x-6 gap-y-3 text-xs tracking-[0.2em] uppercase">
			{#if data.about.github}
				<a
					href={data.about.github}
					target="_blank"
					rel="noopener noreferrer"
					class="opacity-50 transition-opacity hover:opacity-100">GitHub</a
				>
			{/if}
			{#if data.about.linkedin}
				<a
					href={data.about.linkedin}
					target="_blank"
					rel="noopener noreferrer"
					class="opacity-50 transition-opacity hover:opacity-100">LinkedIn</a
				>
			{/if}
			{#if data.about.instagram}
				<a
					href={data.about.instagram}
					target="_blank"
					rel="noopener noreferrer"
					class="opacity-50 transition-opacity hover:opacity-100">Instagram</a
				>
			{/if}
			{#if data.about.resumeUrl}
				<a
					href={data.about.resumeUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="opacity-50 transition-opacity hover:opacity-100">Resume</a
				>
			{/if}
		</div>

		<button
			onclick={switchToRich}
			class="mt-12 w-fit cursor-pointer text-xs tracking-[0.2em] uppercase underline underline-offset-4 opacity-50 transition-opacity hover:opacity-100"
		>
			Switch to the full experience
		</button>
	</header>

	<div class="flex flex-col gap-20 lg:w-3/5">
		<section id="about">
			<h2 class="mb-6 text-xs tracking-[0.4em] uppercase opacity-40">About</h2>
			<div class="flex flex-col gap-4">
				{#each descriptions as description}
					<p class="leading-relaxed opacity-80">{description.content}</p>
				{/each}
			</div>
			{#if techGroups.length}
				<div class="mt-8 flex flex-col gap-2">
					{#each techGroups as group}
						<p class="text-sm leading-relaxed opacity-60">
							<span class="text-xs font-semibold tracking-[0.2em] uppercase">{group.name}</span>
							<span class="ml-2">{group.items.join(', ')}</span>
						</p>
					{/each}
				</div>
			{/if}
		</section>

		<section id="experience">
			<h2 class="mb-6 text-xs tracking-[0.4em] uppercase opacity-40">Experience</h2>
			<ul class="flex flex-col gap-10">
				{#each workExperiences as exp}
					<li>
						<p class="text-xs tracking-[0.2em] uppercase opacity-40">
							{formatPeriod(exp.startMonth, exp.startYear, exp.endMonth, exp.endYear)}
						</p>
						<h3 class="font-clash mt-2 text-xl font-semibold">{exp.role} · {exp.company}</h3>
						{#if exp.location}
							<p class="mt-1 text-xs tracking-[0.2em] uppercase opacity-40">{exp.location}</p>
						{/if}
						{#if exp.description}
							<p class="mt-3 leading-relaxed opacity-70">{exp.description}</p>
						{/if}
					</li>
				{/each}
			</ul>
		</section>

		<section id="projects">
			<h2 class="mb-6 text-xs tracking-[0.4em] uppercase opacity-40">Projects</h2>
			<ul class="flex flex-col gap-12">
				{#each data.projects as project}
					{@const thumbnail = project.images.find((img: ProjectImage) => img.type === 'thumbnail')}
					{@const intro = project.texts.find((t) => t.type === 'regular')}
					<li>
						<a
							href={`/simple/project/${project.id}`}
							class="group flex flex-col gap-4 sm:flex-row sm:gap-6"
						>
							{#if thumbnail}
								<img
									src={thumbnail.imageUrl}
									alt={project.title}
									loading="lazy"
									class="h-44 w-full shrink-0 object-cover sm:h-28 sm:w-44"
								/>
							{/if}
							<div>
								<p class="text-xs tracking-[0.2em] uppercase opacity-40">
									{project.category} · {project.year}{project.visibility === 'private'
										? ' · Private'
										: ''}
								</p>
								<h3
									class="font-clash mt-2 text-xl font-semibold underline-offset-4 group-hover:underline"
								>
									{project.title}
								</h3>
								{#if intro}
									<p class="mt-3 line-clamp-3 leading-relaxed opacity-70">{intro.content}</p>
								{/if}
							</div>
						</a>
					</li>
				{/each}
			</ul>
		</section>

		<section id="tools">
			<h2 class="mb-6 text-xs tracking-[0.4em] uppercase opacity-40">Tools</h2>
			<p class="mb-10 leading-relaxed opacity-60">
				Personal tools I built to fix problems I found annoying. Made for myself, though one or two
				friends use them too. Fair warning: these are 70-80% vibe-coded, so keep that in mind while
				looking around.
			</p>
			<ul class="flex flex-col gap-12">
				{#each data.tools as tool}
					{@const thumbnail = tool.images.find((img: ToolImage) => img.type === 'thumbnail')}
					{@const intro = [...tool.texts]
						.sort((a, b) => a.position - b.position)
						.find((t) => t.type === 'regular')}
					<li>
						<a
							href={`/simple/tools/${tool.id}`}
							class="group flex flex-col gap-4 sm:flex-row sm:gap-6"
						>
							{#if thumbnail}
								<img
									src={thumbnail.imageUrl}
									alt={tool.title}
									loading="lazy"
									class="h-44 w-full shrink-0 object-cover sm:h-28 sm:w-44"
								/>
							{/if}
							<div>
								<h3
									class="font-clash text-xl font-semibold underline-offset-4 group-hover:underline"
								>
									{tool.title}
								</h3>
								{#if intro}
									<p class="mt-3 line-clamp-3 leading-relaxed opacity-70">{intro.content}</p>
								{/if}
							</div>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	</div>
</div>
