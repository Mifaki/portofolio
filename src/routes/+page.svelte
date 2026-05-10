<script lang="ts">
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
	import type { ProjectImage } from '$lib/types/project';
	import type { PageProps } from './$types';
	import { loaderDone } from '$lib/stores/loader';
	import { onMount, tick } from 'svelte';
	import gsap from 'gsap';

	let { data }: PageProps = $props();
	const projects = [...data.projects, ...data.projects];
	let activeIndex = $state(0);

	let direction = $state<'horizontal' | 'vertical'>('horizontal');
	let isTransitioning = false;

	let emblaApi: EmblaCarouselType | undefined;
	let imageEls: HTMLImageElement[] = [];
	let carouselEl: HTMLDivElement | undefined;

	const DIMS = {
		horizontal: { width: 400, height: 600 },
		vertical: { width: 500, height: 400 }
	};

	const emblaOptions = $derived<EmblaOptionsType>({
		loop: true,
		dragFree: true,
		dragThreshold: 40,
		skipSnaps: true,
		containScroll: 'trimSnaps',
		axis: direction === 'vertical' ? 'y' : 'x'
	});

	const emblaConfig = $derived({
		options: emblaOptions,
		plugins: []
	});

	$effect(() => {
		direction;
		if (emblaApi) emblaApi.reInit(emblaOptions);
	});

	async function switchDirection(newDir: 'horizontal' | 'vertical') {
		if (isTransitioning || newDir === direction || !emblaApi) return;
		isTransitioning = true;

		const toDir = newDir;
		const { width: toW, height: toH } = DIMS[toDir];

		const savedIndex = emblaApi.selectedScrollSnap();

		const snapshots = imageEls.map((img) => {
			if (!img) return null;
			const r = img.getBoundingClientRect();
			return { left: r.left, top: r.top, width: r.width, height: r.height };
		});

		const ghosts = snapshots.map((snap, i) => {
			if (!snap || !imageEls[i]) return null;
			const clone = imageEls[i].cloneNode(true) as HTMLImageElement;
			gsap.set(clone, {
				position: 'fixed',
				left: snap.left,
				top: snap.top,
				width: snap.width,
				height: snap.height,
				margin: 0,
				zIndex: 100,
				pointerEvents: 'none',
				objectFit: 'cover'
			});
			document.body.appendChild(clone);
			return clone;
		});

		gsap.set(imageEls.filter(Boolean), { visibility: 'hidden' });

		direction = toDir;
		await tick();
		emblaApi.reInit(emblaOptions);
		await tick();

		emblaApi.scrollTo(savedIndex, true);
		await tick();

		const newRects = imageEls.map((img) => img?.getBoundingClientRect());

		const tl = gsap.timeline({
			onComplete: () => {
				gsap.set(imageEls.filter(Boolean), { visibility: 'visible', clearProps: 'visibility' });
				ghosts.forEach((g) => g?.remove());
				isTransitioning = false;
				updateCenterProject();
			}
		});

		ghosts.forEach((ghost, i) => {
			if (!ghost || !newRects[i]) return;
			const nr = newRects[i]!;
			tl.to(
				ghost,
				{
					left: nr.left,
					top: nr.top,
					width: toW,
					height: toH,
					duration: 0.85,
					ease: 'power3.inOut'
				},
				0
			);
		});
	}

	function updateCenterProject() {
		if (!emblaApi) return;
		const slides = emblaApi.slideNodes();
		const isVertical = direction === 'vertical';
		const viewportCenter = isVertical ? window.innerHeight / 2 : window.innerWidth / 2;
		let closestIndex = 0;
		let closestDistance = Infinity;
		slides.forEach((slide, index) => {
			const rect = slide.getBoundingClientRect();
			const slideCenter = isVertical ? rect.top + rect.height / 2 : rect.left + rect.width / 2;
			const distance = Math.abs(viewportCenter - slideCenter);
			if (distance < closestDistance) {
				closestDistance = distance;
				closestIndex = index;
			}
		});
		activeIndex = closestIndex;
	}

	onMount(() => {
		gsap.set(imageEls, { y: 60, opacity: 0, scale: 0.92 });
		const unsub = loaderDone.subscribe((done) => {
			if (!done) return;
			unsub();
			gsap.to(imageEls, {
				y: 0,
				opacity: 1,
				scale: 1,
				duration: 1,
				ease: 'power3.out',
				stagger: 0.08,
				delay: 0.1
			});
			requestAnimationFrame(updateCenterProject);
		});
	});

	function handleEmblaInit(event: CustomEvent<EmblaCarouselType>) {
		emblaApi = event.detail;
		updateCenterProject();
		emblaApi.on('scroll', updateCenterProject);
		emblaApi.on('settle', updateCenterProject);
		emblaApi.on('reInit', updateCenterProject);
	}
</script>

<div
	bind:this={carouselEl}
	class="flex h-screen w-full cursor-pointer items-center justify-center active:cursor-grabbing"
	class:h-screen={direction === 'vertical'}
	use:emblaCarouselSvelte={emblaConfig}
	onemblaInit={handleEmblaInit}
>
	<div
		class="mb-[112px] flex w-full"
		class:flex-col={direction === 'vertical'}
		class:h-full={direction === 'vertical'}
		class:items-center={direction === 'vertical'}
	>
		{#each projects as p, index}
			{@const thumbnail = p.images.find((img: ProjectImage) => img.type === 'thumbnail')}
			{#if thumbnail}
				<div
					class="z-999 flex-[0_0_auto]"
					class:flex={direction === 'vertical'}
					class:justify-center={direction === 'vertical'}
					class:w-full={direction === 'vertical'}
					role="listitem"
				>
					<img
						bind:this={imageEls[index]}
						class="object-cover will-change-transform select-none"
						class:mr-4={direction === 'horizontal'}
						class:mb-4={direction === 'vertical'}
						class:h-[600px]={direction === 'horizontal'}
						class:w-[400px]={direction === 'horizontal'}
						class:h-[400px]={direction === 'vertical'}
						class:w-[500px]={direction === 'vertical'}
						src={thumbnail.imageUrl}
						alt={p.title}
						draggable="false"
						onmouseenter={() => {
							activeIndex = index;
						}}
						onmouseleave={() => {
							updateCenterProject();
						}}
					/>
				</div>
			{/if}
		{/each}
	</div>
</div>

<div class="pointer-events-auto fixed bottom-8 left-8 flex items-center gap-3">
	<button
		onclick={() => switchDirection('horizontal')}
		class="text-xs tracking-[0.2em] uppercase transition-opacity duration-200"
		class:opacity-100={direction === 'horizontal'}
		class:font-semibold={direction === 'horizontal'}
		class:opacity-30={direction === 'vertical'}
	>
		Horizontal
	</button>
	<span class="text-xs opacity-20">/</span>
	<button
		onclick={() => switchDirection('vertical')}
		class="text-xs tracking-[0.2em] uppercase transition-opacity duration-200"
		class:opacity-100={direction === 'vertical'}
		class:font-semibold={direction === 'vertical'}
		class:opacity-30={direction === 'horizontal'}
	>
		Vertical
	</button>
</div>

<div class="pointer-events-none fixed right-8 bottom-8 text-right text-black">
	<p class="text-xs uppercase opacity-60">
		{projects[activeIndex]?.category}
	</p>
	<h2 class="font-clash text-6xl font-bold">
		{projects[activeIndex]?.title}
	</h2>
	<p class="mt-1 text-sm opacity-60">
		{projects[activeIndex]?.year}
	</p>
</div>
