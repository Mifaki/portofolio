<script lang="ts">
	import type { PageProps } from './$types';
	import type { Tool, ToolImage } from '$lib/types/tool';
	import { onMount, tick } from 'svelte';
	import { afterNavigate, goto, preloadData } from '$app/navigation';
	import { get } from 'svelte/store';
	import gsap from 'gsap';
	import { loaderDone, skipNextLoader } from '$lib/stores/loader';
	import { skipHeroReveal } from '$lib/stores/transition';
	import { lenisInstance } from '$lib/stores/lenis';
	import { measureScrollbarAccountedWidth } from '$lib/utils/scrollbar';

	let { data }: PageProps = $props();
	const tool = $derived<Tool>(data.tool);
	const thumbnail = $derived(
		tool.images.find((img: ToolImage) => img.type === 'thumbnail') ?? tool.images[0] ?? null
	);
	const gallery = $derived(tool.images.filter((img: ToolImage) => img !== thumbnail));

	let rootEl: HTMLDivElement | undefined = $state();
	let labelEl: HTMLParagraphElement | undefined = $state();
	let titleEl: HTMLHeadingElement | undefined = $state();
	let linksEl: HTMLDivElement | undefined = $state();
	let heroImgWrapperEl: HTMLDivElement | undefined = $state();
	let nextImgEl: HTMLImageElement | undefined = $state();
	let isTransitioning = false;
	let unsubLoader: (() => void) | undefined;

	function setupPage(fromGhost: boolean) {
		const fadeEls = [labelEl, titleEl, linksEl].filter(Boolean) as HTMLElement[];
		gsap.killTweensOf([...fadeEls, heroImgWrapperEl, rootEl].filter(Boolean));
		gsap.set(rootEl!, { opacity: 1 });
		if (nextImgEl) gsap.set(nextImgEl, { clearProps: 'visibility' });
		gsap.set(fadeEls, { opacity: 0, y: 30 });
		if (heroImgWrapperEl) {
			gsap.set(
				heroImgWrapperEl,
				fromGhost
					? { clipPath: 'inset(0% 0% 0% 0%)', opacity: 0 }
					: { clipPath: 'inset(0% 100% 0% 0%)', opacity: 1 }
			);
		}

		unsubLoader?.();
		unsubLoader = loaderDone.subscribe((done) => {
			if (!done) return;
			unsubLoader?.();
			gsap.to(fadeEls, {
				opacity: 1,
				y: 0,
				duration: 1,
				stagger: 0.12,
				ease: 'power3.out',
				delay: 0.1
			});
			if (!fromGhost && heroImgWrapperEl) {
				gsap.to(heroImgWrapperEl, {
					clipPath: 'inset(0% 0% 0% 0%)',
					duration: 1.2,
					ease: 'power3.out',
					delay: 0.3
				});
			}
		});
	}

	onMount(() => {
		return () => {
			unsubLoader?.();
		};
	});

	afterNavigate(async () => {
		await tick();
		const fromGhost = get(skipHeroReveal);
		if (fromGhost) skipHeroReveal.set(false);
		window.scrollTo(0, 0);
		isTransitioning = false;
		setupPage(fromGhost);
	});

	async function handleNextToolClick(nextId: string) {
		if (isTransitioning) return;
		if (!nextImgEl) {
			goto(`/tools/${nextId}`);
			return;
		}
		isTransitioning = true;
		skipNextLoader.set(true);
		skipHeroReveal.set(true);
		preloadData(`/tools/${nextId}`).catch(() => {});

		const { left, top, width, height } = nextImgEl.getBoundingClientRect();

		const clientWidth = measureScrollbarAccountedWidth();

		const ghost = nextImgEl.cloneNode(true) as HTMLImageElement;
		gsap.set(ghost, {
			position: 'fixed',
			left,
			top,
			width,
			height,
			margin: 0,
			zIndex: 200,
			objectFit: 'cover',
			pointerEvents: 'none',
			clipPath: 'none'
		});
		document.body.appendChild(ghost);
		gsap.set(nextImgEl, { visibility: 'hidden' });

		await gsap.to(ghost, {
			left: 0,
			top: 0,
			width: clientWidth,
			height: window.innerHeight,
			duration: 2.0,
			ease: 'power3.inOut'
		});

		gsap.set(rootEl!, { opacity: 0 });
		get(lenisInstance)?.scrollTo(0, { immediate: true });

		await gsap.to(ghost, {
			top: 112,
			height: window.innerHeight - 112,
			duration: 1.1,
			ease: 'power3.inOut'
		});

		await goto(`/tools/${nextId}`);
		await tick();

		const heroEl = document.querySelector('[data-tool-hero]') as HTMLElement | null;
		if (heroEl) {
			const rect = heroEl.getBoundingClientRect();
			await gsap.to(ghost, {
				left: rect.left,
				top: rect.top,
				width: rect.width,
				height: rect.height,
				duration: 1.1,
				ease: 'power3.inOut'
			});
			gsap.set(heroEl, { opacity: 1 });
		}
		await gsap.to(ghost, { opacity: 0, duration: 0.4, ease: 'power2.out' });
		ghost.remove();
	}
</script>

<div bind:this={rootEl} class="w-full bg-white px-8 pt-8 pb-32 md:px-14">
	<div class="mb-16">
		<p bind:this={labelEl} class="mb-5 text-xs tracking-[0.4em] uppercase opacity-30">Tool</p>
		<h1 bind:this={titleEl} class="font-clash mb-8 text-5xl leading-none font-bold md:text-8xl">
			{tool.title}
		</h1>
		<div bind:this={linksEl} class="flex items-center gap-8">
			{#if tool.url}
				<a
					href={tool.url}
					target="_blank"
					rel="noopener noreferrer"
					class="text-xs tracking-[0.3em] uppercase opacity-50 transition-opacity duration-300 hover:opacity-100"
				>
					Live Site ↗
				</a>
			{/if}
			{#if tool.repoUrl}
				<a
					href={tool.repoUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="text-xs tracking-[0.3em] uppercase opacity-50 transition-opacity duration-300 hover:opacity-100"
				>
					Source Code ↗
				</a>
			{/if}
		</div>
	</div>

	{#if thumbnail}
		<div bind:this={heroImgWrapperEl} data-tool-hero class="mb-20 overflow-hidden">
			<img class="aspect-video w-full object-cover" src={thumbnail.imageUrl} alt={tool.title} />
		</div>
	{/if}

	{#if tool.texts.length > 0}
		<div class="mb-20 max-w-xl">
			<p class="text-xl leading-loose opacity-75">{tool.texts[0].content}</p>
		</div>
	{/if}

	{#each gallery as img, i (img.id)}
		<div class="mb-10">
			{#if img.orientation === 'landscape'}
				<img class="aspect-video w-full object-cover" src={img.imageUrl} alt={tool.title} />
			{:else}
				<div class="flex" class:justify-end={i % 2 !== 0}>
					<img class="aspect-3/4 w-[52%] object-cover" src={img.imageUrl} alt={tool.title} />
				</div>
			{/if}
		</div>

		{#if tool.texts[i + 1]}
			<div class="mb-14 max-w-4xl">
				<p class="text-right text-xl leading-loose opacity-70">{tool.texts[i + 1].content}</p>
			</div>
		{/if}
	{/each}

	{#if tool.nextTool?.thumbnailUrl}
		<div class="mt-40 border-t border-black/10 pt-16">
			<p class="mb-5 text-xs tracking-[0.4em] uppercase opacity-30">Next</p>
			<h3 class="font-clash mb-10 text-5xl leading-none font-bold">
				{tool.nextTool.title}
			</h3>
			<div
				class="cursor-pointer overflow-hidden"
				role="button"
				tabindex="0"
				onclick={() => handleNextToolClick(tool.nextTool!.id)}
				onkeydown={(e) => e.key === 'Enter' && handleNextToolClick(tool.nextTool!.id)}
			>
				<img
					bind:this={nextImgEl}
					class="aspect-[21/9] w-full object-cover select-none"
					src={tool.nextTool.thumbnailUrl}
					alt={tool.nextTool.title}
					draggable="false"
				/>
			</div>
		</div>
	{/if}
</div>
