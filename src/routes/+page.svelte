<script lang="ts">
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel';
	import type { ProjectImage } from '$lib/types/project';
	import type { PageProps } from './$types';
	import { loaderDone, skipNextLoader } from '$lib/stores/loader';
	import { skipHeroReveal } from '$lib/stores/transition';
	import { onMount, tick } from 'svelte';
	import gsap from 'gsap';
	import { goto } from '$app/navigation';

	let { data }: PageProps = $props();
	const projects = [...data.projects, ...data.projects];
	let activeIndex = $state(0);

	let direction = $state<'horizontal' | 'vertical'>('horizontal');
	let isTransitioning = false;

	let emblaApi: EmblaCarouselType | undefined;
	let wrapperEls: HTMLDivElement[] = [];
	let imageEls: HTMLImageElement[] = [];
	let carouselEl: HTMLDivElement | undefined;
	let dirButtonsEl: HTMLDivElement | undefined;
	let textOverlayEl: HTMLDivElement | undefined;

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
		if (emblaApi) emblaApi.reInit(emblaOptions);
	});

	async function switchDirection(newDir: 'horizontal' | 'vertical') {
		if (isTransitioning || newDir === direction || !emblaApi) return;
		isTransitioning = true;

		const { width: toW, height: toH } = DIMS[newDir];
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

		direction = newDir;
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

	function buildRadialOrder(count: number): number[] {
		const center = Math.floor(count / 2);
		const order: number[] = [];
		order.push(center);
		let left = center - 1;
		let right = center + 1;
		while (order.length < count) {
			if (right < count) order.push(right++);
			if (left >= 0) order.push(left--);
		}
		return order;
	}

	onMount(() => {
		const validWrappers = wrapperEls.filter(Boolean);

		gsap.set(validWrappers, { clipPath: 'inset(0% 0% 100% 0%)' });

		const unsub = loaderDone.subscribe((done) => {
			if (!done) return;
			unsub();

			const count = validWrappers.length;
			const radialOrder = buildRadialOrder(count);

			const staggerDelays = new Array(count).fill(0);
			radialOrder.forEach((originalIdx, staggerPos) => {
				staggerDelays[originalIdx] = staggerPos * 0.2;
			});

			validWrappers.forEach((wrapper, i) => {
				gsap.to(wrapper, {
					clipPath: 'inset(0% 0% 0% 0%)',
					duration: 1.1,
					ease: 'power3.out',
					delay: 0.1 + staggerDelays[i]
				});
			});

			requestAnimationFrame(updateCenterProject);
		});
	});

	function handleEmblaInit(event: CustomEvent<EmblaCarouselType>) {
		emblaApi = event.detail;
		updateCenterProject();
	}

	let isDragging = false;
	let pointerDownPos = { x: 0, y: 0 };

	function handlePointerDown(e: PointerEvent) {
		pointerDownPos = { x: e.clientX, y: e.clientY };
		isDragging = false;
	}

	function handlePointerMove(e: PointerEvent) {
		const dx = Math.abs(e.clientX - pointerDownPos.x);
		const dy = Math.abs(e.clientY - pointerDownPos.y);
		if (dx > 5 || dy > 5) isDragging = true;
	}

	async function handleImageClick(projectId: string, clickedIndex: number) {
		if (isDragging) return;
		const img = imageEls[clickedIndex];
		const wrapper = wrapperEls[clickedIndex];
		if (!img || !wrapper) {
			goto(`/project/${projectId}`);
			return;
		}
		skipNextLoader.set(true);
		skipHeroReveal.set(true);

		gsap.to([dirButtonsEl, textOverlayEl].filter(Boolean), {
			opacity: 0,
			duration: 0.35,
			ease: 'power2.out'
		});

		const rect = img.getBoundingClientRect();
		const targetHeight = window.innerHeight - 112;

		document.documentElement.style.overflowY = 'scroll';
		const clientWidth = document.documentElement.clientWidth;
		document.documentElement.style.overflowY = '';

		const panelWidth = clientWidth * 0.6;

		const ghost = img.cloneNode(true) as HTMLImageElement;
		gsap.set(ghost, {
			position: 'fixed',
			left: rect.left,
			top: rect.top,
			width: rect.width,
			height: rect.height,
			margin: 0,
			zIndex: 200,
			objectFit: 'cover',
			pointerEvents: 'none'
		});
		document.body.appendChild(ghost);
		gsap.set(wrapper, { visibility: 'hidden' });

		const count = wrapperEls.filter(Boolean).length;
		const radialOrder = buildRadialOrder(count).filter((i) => i !== clickedIndex);
		radialOrder.forEach((originalIdx, staggerPos) => {
			const w = wrapperEls[originalIdx];
			if (!w) return;
			gsap.to(w, {
				clipPath: 'inset(100% 0% 0% 0%)',
				duration: 1,
				ease: 'power3.in',
				delay: staggerPos * 0.04
			});
		});

		await gsap.to(ghost, {
			left: 0,
			top: 112,
			width: clientWidth,
			height: targetHeight,
			duration: 2.0,
			ease: 'power3.inOut'
		});

		await gsap.to(ghost, {
			width: panelWidth,
			duration: 1.1,
			ease: 'power3.inOut'
		});

		ghost.style.viewTransitionName = 'project-hero';
		
		if (document.startViewTransition) {
			const transition = document.startViewTransition(async () => {
				await goto(`/project/${projectId}`);
			});

			transition.ready.then(() => {
				ghost.remove();
			});

			transition.finished.finally(() => {
				ghost.remove();
			});
		} else {
			ghost.remove();
			await goto(`/project/${projectId}`);
		}
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
					<div
						bind:this={wrapperEls[index]}
						class="overflow-hidden"
						class:mr-4={direction === 'horizontal'}
						class:mb-4={direction === 'vertical'}
						class:h-[600px]={direction === 'horizontal'}
						class:w-[400px]={direction === 'horizontal'}
						class:h-[400px]={direction === 'vertical'}
						class:w-[500px]={direction === 'vertical'}
					>
						<img
							bind:this={imageEls[index]}
							class="h-full w-full object-cover will-change-transform select-none"
							src={thumbnail.imageUrl}
							alt={p.title}
							draggable="false"
							onpointerdown={handlePointerDown}
							onpointermove={handlePointerMove}
							onclick={() => handleImageClick(p.id, index)}
							onmouseenter={() => {
								activeIndex = index;
							}}
							onmouseleave={() => {
								updateCenterProject();
							}}
						/>
					</div>
				</div>
			{/if}
		{/each}
	</div>
</div>

<div bind:this={dirButtonsEl} class="pointer-events-auto fixed bottom-8 left-8 flex items-center gap-3">
	<button
		onclick={() => switchDirection('horizontal')}
		class="cursor-pointer text-xs tracking-[0.2em] uppercase transition-opacity duration-200"
		class:opacity-100={direction === 'horizontal'}
		class:font-semibold={direction === 'horizontal'}
		class:opacity-30={direction === 'vertical'}
	>
		Horizontal
	</button>
	<span class="text-xs opacity-20">/</span>
	<button
		onclick={() => switchDirection('vertical')}
		class="cursor-pointer text-xs tracking-[0.2em] uppercase transition-opacity duration-200"
		class:opacity-100={direction === 'vertical'}
		class:font-semibold={direction === 'vertical'}
		class:opacity-30={direction === 'horizontal'}
	>
		Vertical
	</button>
</div>

<div bind:this={textOverlayEl} class="pointer-events-none fixed right-8 bottom-8 text-right text-black">
	<p class="text-xs uppercase opacity-60">{projects[activeIndex]?.category}</p>
	<h2 class="font-clash text-6xl font-bold">{projects[activeIndex]?.title}</h2>
	<p class="mt-1 text-sm opacity-60">{projects[activeIndex]?.year}</p>
</div>
