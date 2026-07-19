<script lang="ts">
	import type { PageProps } from './$types';
	import type { Tool, ToolImage } from '$lib/types/tool';
	import { onMount, tick } from 'svelte';
	import { goto, preloadData } from '$app/navigation';
	import { get } from 'svelte/store';
	import gsap from 'gsap';
	import { loaderDone, skipNextLoader } from '$lib/stores/loader';
	import { skipHeroReveal } from '$lib/stores/transition';
	import { lenisInstance } from '$lib/stores/lenis';
	import { measureScrollbarAccountedWidth } from '$lib/utils/scrollbar';
	import Seo from '$lib/components/Seo.svelte';
	import { SITE } from '$lib/utils/seo';

	let { data }: PageProps = $props();
	// TEMP: repeat the tools to 8 entries
	const tools: Tool[] =
		data.tools.length > 0
			? Array.from({ length: 8 }, (_, i) => data.tools[i % data.tools.length])
			: [];

	const STEP = 24;

	function thumbnailOf(tool: Tool) {
		return tool.images.find((img: ToolImage) => img.type === 'thumbnail') ?? tool.images[0] ?? null;
	}

	function descriptionOf(tool: Tool) {
		return tool.texts[0]?.content ?? '';
	}

	let leftPanelEl: HTMLDivElement | undefined = $state();
	let arcContainerEl: HTMLDivElement | undefined = $state();
	let mobileRootEl: HTMLDivElement | undefined = $state();
	let labelEl: HTMLParagraphElement | undefined;
	let headingEl: HTMLHeadingElement | undefined;
	let disclaimerEl: HTMLParagraphElement | undefined;
	let infoEl: HTMLDivElement | undefined = $state();
	let cardEls: HTMLDivElement[] = [];
	let cardImgEls: HTMLImageElement[] = [];
	let mobileImgEls: HTMLImageElement[] = [];
	let activeIndex = $state(0);
	let guideStyle = $state('');
	let isTransitioning = false;
	let entranceDone = false;
	let t = 0;
	let tTarget = 0;
	let lastWheelTime = 0;

	function layoutCards() {
		if (!arcContainerEl) return;
		const cw = arcContainerEl.offsetWidth;
		const ch = arcContainerEl.offsetHeight;
		const radius = ch * 0.95;
		const cx = cw + radius * 0.3;
		const cy = ch / 2;

		guideStyle = `left:${cx - radius}px; top:${cy - radius}px; width:${radius * 2}px; height:${radius * 2}px;`;

		cardEls.forEach((el, i) => {
			if (!el) return;
			const delta = (i - t) * STEP;
			if (Math.abs(delta) > 80) {
				gsap.set(el, { autoAlpha: 0 });
				return;
			}
			const rad = (delta * Math.PI) / 180;
			const prox = Math.abs(delta) / STEP;
			gsap.set(el, {
				x: cx - radius * Math.cos(rad),
				y: cy + radius * Math.sin(rad),
				xPercent: -50,
				yPercent: -50,
				scale: 1 - Math.min(prox * 0.08, 0.3),
				autoAlpha: Math.max(1 - prox * 0.4, 0),
				zIndex: 100 - Math.round(prox * 10)
			});
		});
	}

	function handleWheel(e: WheelEvent) {
		if (isTransitioning || tools.length <= 1) return;
		lastWheelTime = performance.now();
		tTarget = Math.min(Math.max(tTarget + e.deltaY * 0.002, 0), tools.length - 1);
	}

	let isDragging = false;
	let isPointerDown = false;
	let dragStartY = 0;
	let dragStartT = 0;

	function handlePointerDown(e: PointerEvent) {
		if (isTransitioning || tools.length <= 1) return;
		isPointerDown = true;
		isDragging = false;
		dragStartY = e.clientY;
		dragStartT = tTarget;
	}

	function handlePointerMove(e: PointerEvent) {
		if (!isPointerDown) return;
		const dy = e.clientY - dragStartY;
		if (Math.abs(dy) > 5) isDragging = true;
		if (!isDragging) return;
		lastWheelTime = performance.now();
		tTarget = Math.min(Math.max(dragStartT - dy * 0.005, 0), tools.length - 1);
	}

	function handlePointerUp() {
		isPointerDown = false;
		setTimeout(() => (isDragging = false), 0);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (isTransitioning || tools.length <= 1) return;
		if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
		lastWheelTime = 0;
		const dir = e.key === 'ArrowDown' ? 1 : -1;
		tTarget = Math.min(Math.max(Math.round(tTarget) + dir, 0), tools.length - 1);
	}

	function tickUpdate() {
		if (performance.now() - lastWheelTime > 250) {
			tTarget += (Math.round(tTarget) - tTarget) * 0.08;
		}
		t += (tTarget - t) * 0.09;
		if (Math.abs(tTarget - t) < 0.0005) t = tTarget;
		const idx = Math.round(t);
		if (idx !== activeIndex) activeIndex = idx;
		layoutCards();
	}

	$effect(() => {
		void activeIndex;
		if (!entranceDone || !infoEl) return;
		gsap.fromTo(
			infoEl,
			{ opacity: 0, y: 16 },
			{ opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
		);
	});

	async function handleToolClick(toolId: string, index: number, fromMobile = false) {
		if (isTransitioning || isDragging) return;
		const img = fromMobile ? mobileImgEls[index] : cardImgEls[index];
		if (!img) {
			goto(`/tools/${toolId}`);
			return;
		}
		isTransitioning = true;
		skipNextLoader.set(true);
		skipHeroReveal.set(true);
		preloadData(`/tools/${toolId}`).catch(() => {});

		const { left, top, width, height } = img.getBoundingClientRect();

		const clientWidth = measureScrollbarAccountedWidth();
		const targetHeight = window.innerHeight - 112;

		const ghost = img.cloneNode(true) as HTMLImageElement;
		gsap.set(ghost, {
			position: 'fixed',
			left,
			top,
			width,
			height,
			margin: 0,
			zIndex: 200,
			objectFit: 'cover',
			pointerEvents: 'none'
		});
		document.body.appendChild(ghost);
		gsap.set(fromMobile ? img : cardEls[index], { visibility: 'hidden' });

		gsap.to([leftPanelEl, arcContainerEl, mobileRootEl].filter(Boolean), {
			opacity: 0,
			duration: 0.4,
			ease: 'power2.out'
		});

		await gsap.to(ghost, {
			left: 0,
			top: 112,
			width: clientWidth,
			height: targetHeight,
			duration: 2.0,
			ease: 'power3.inOut'
		});

		await goto(`/tools/${toolId}`);
		await tick();
		get(lenisInstance)?.scrollTo(0, { immediate: true });

		const heroEl = document.querySelector('[data-tool-hero]') as HTMLElement | null;
		if (heroEl) {
			const heroRect = heroEl.getBoundingClientRect();
			await gsap.to(ghost, {
				left: heroRect.left,
				top: heroRect.top,
				width: heroRect.width,
				height: heroRect.height,
				duration: 1.1,
				ease: 'power3.inOut'
			});
			gsap.set(heroEl, { opacity: 1 });
		}
		await gsap.to(ghost, { opacity: 0, duration: 0.4, ease: 'power2.out' });
		ghost.remove();
	}

	onMount(() => {
		gsap.set([labelEl, headingEl, disclaimerEl, infoEl].filter(Boolean), { opacity: 0, y: 30 });
		if (arcContainerEl) gsap.set(arcContainerEl, { opacity: 0, x: 80 });

		layoutCards();

		let rafId: number;
		const loop = () => {
			tickUpdate();
			rafId = requestAnimationFrame(loop);
		};
		rafId = requestAnimationFrame(loop);

		const onResize = () => layoutCards();
		window.addEventListener('wheel', handleWheel, { passive: true });
		window.addEventListener('keydown', handleKeydown);
		window.addEventListener('pointermove', handlePointerMove);
		window.addEventListener('pointerup', handlePointerUp);
		window.addEventListener('resize', onResize);

		const unsub = loaderDone.subscribe((done) => {
			if (!done) return;
			unsub();
			gsap.to(labelEl!, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.1 });
			gsap.to(headingEl!, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: 0.25 });
			gsap.to(disclaimerEl!, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.4 });
			if (infoEl) {
				gsap.to(infoEl, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.55 });
			}
			if (arcContainerEl) {
				gsap.to(arcContainerEl, {
					opacity: 1,
					x: 0,
					duration: 1.2,
					ease: 'power3.out',
					delay: 0.45,
					onComplete: () => {
						entranceDone = true;
					}
				});
			} else {
				entranceDone = true;
			}
		});

		return () => {
			unsub();
			cancelAnimationFrame(rafId);
			window.removeEventListener('wheel', handleWheel);
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('pointermove', handlePointerMove);
			window.removeEventListener('pointerup', handlePointerUp);
			window.removeEventListener('resize', onResize);
		};
	});
</script>

<Seo
	title={`Tools - ${SITE.name}`}
	description={`Tools and side projects built by ${SITE.name}.`}
/>

<div class="hidden w-full lg:block">
	<div
		bind:this={leftPanelEl}
		class="fixed top-[112px] left-0 z-10 flex h-[calc(100vh-112px)] w-1/2 flex-col justify-between px-8 pb-16 md:px-14"
	>
		<div>
			<p bind:this={labelEl} class="mb-5 text-xs tracking-[0.4em] uppercase opacity-30">
				Personal Tools
			</p>
			<h1 bind:this={headingEl} class="font-clash text-6xl leading-none font-bold lg:text-8xl">
				Tools
			</h1>
			<p bind:this={disclaimerEl} class="mt-8 max-w-md leading-relaxed opacity-50 lg:text-lg">
				Personal tools I built to fix problems I found annoying. Made for myself, though one or two
				friends use them too. <br /><br />Fair warning: these are 70-80% vibe-coded, so keep that in
				mind while looking around.
			</p>
		</div>

		{#if tools[activeIndex]}
			<div bind:this={infoEl}>
				<p class="mb-4 text-xs tracking-[0.4em] uppercase opacity-30">
					{String(activeIndex + 1).padStart(2, '0')} / {String(tools.length).padStart(2, '0')}
				</p>
				<h2 class="font-clash mb-4 text-4xl font-bold lg:text-5xl">{tools[activeIndex].title}</h2>
				{#if descriptionOf(tools[activeIndex])}
					<p class="max-w-md leading-relaxed opacity-50 lg:text-lg">
						{descriptionOf(tools[activeIndex])}
					</p>
				{/if}
			</div>
		{:else}
			<p class="text-xl opacity-40">Nothing here yet, soon.</p>
		{/if}
	</div>

	<div
		bind:this={arcContainerEl}
		class="fixed top-[112px] right-0 h-[calc(100vh-112px)] w-1/2 cursor-grab touch-none overflow-hidden select-none active:cursor-grabbing"
		role="listbox"
		tabindex="-1"
		onpointerdown={handlePointerDown}
	>
		<div class="absolute rounded-full border border-black/10" style={guideStyle}></div>
		{#each tools as tool, i (`${tool.id}-${i}`)}
			{@const thumbnail = thumbnailOf(tool)}
			{#if thumbnail}
				<div
					bind:this={cardEls[i]}
					class="absolute top-0 left-0 w-80 cursor-pointer will-change-transform lg:w-96"
					role="button"
					tabindex="0"
					onclick={() => handleToolClick(tool.id, i)}
					onkeydown={(e) => e.key === 'Enter' && handleToolClick(tool.id, i)}
				>
					<img
						bind:this={cardImgEls[i]}
						class="aspect-video w-full object-cover select-none"
						src={thumbnail.imageUrl}
						alt={tool.title}
						draggable="false"
					/>
				</div>
			{/if}
		{/each}
	</div>
</div>

<div bind:this={mobileRootEl} class="mx-auto w-full max-w-3xl px-8 pt-8 pb-32 lg:hidden">
	<div class="mb-16">
		<p class="mb-5 text-xs tracking-[0.4em] uppercase opacity-30">Personal Tools</p>
		<h1 class="font-clash text-6xl leading-none font-bold">Tools</h1>
		<p class="mt-8 leading-relaxed opacity-50">
			Personal tools I built to fix problems I found annoying. Made for myself, though one or two
			friends use them too. Fair warning: these are 70-80% vibe-coded, so keep that in mind while
			looking around.
		</p>
	</div>

	<div class="flex flex-col">
		{#each tools as tool, i (`${tool.id}-${i}`)}
			{@const thumbnail = thumbnailOf(tool)}
			{@const description = descriptionOf(tool)}
			<div
				class="cursor-pointer border-t border-black/10 py-10 last:border-b"
				role="button"
				tabindex="0"
				onclick={() => handleToolClick(tool.id, i, true)}
				onkeydown={(e) => e.key === 'Enter' && handleToolClick(tool.id, i, true)}
			>
				<span class="text-xs tracking-[0.4em] uppercase opacity-30">
					{String(i + 1).padStart(2, '0')}
				</span>
				{#if thumbnail}
					<div class="mt-6 overflow-hidden">
						<img
							bind:this={mobileImgEls[i]}
							class="aspect-video w-full object-cover select-none"
							src={thumbnail.imageUrl}
							alt={tool.title}
							draggable="false"
						/>
					</div>
				{/if}
				<h2 class="font-clash mt-6 mb-3 text-3xl font-bold">{tool.title}</h2>
				{#if description}
					<p class="leading-relaxed opacity-50">{description}</p>
				{/if}
			</div>
		{/each}
	</div>

	{#if tools.length === 0}
		<p class="border-t border-black/10 pt-10 text-xl opacity-40">Nothing here yet, soon.</p>
	{/if}
</div>
