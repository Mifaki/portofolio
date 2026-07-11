<script lang="ts">
	import type { Project, ProjectImage } from '$lib/types/project';
	import { onMount, tick } from 'svelte';
	import { afterNavigate, goto, preloadData } from '$app/navigation';
	import { get } from 'svelte/store';
	import gsap from 'gsap';
	import { loaderDone, skipNextLoader } from '$lib/stores/loader';
	import { skipHeroReveal } from '$lib/stores/transition';
	import { lenisInstance } from '$lib/stores/lenis';
	import { isBlurredProject, blurImage, BLUR_PLACEHOLDER } from '$lib/utils/blurImage';
	import { measureScrollbarAccountedWidth } from '$lib/utils/scrollbar';

	interface Props {
		project: Project;
		preview?: boolean;
	}
	let { project, preview = false }: Props = $props();
	const thumbnail = $derived(project.images.find((img: ProjectImage) => img.type === 'thumbnail'));
	const gallery = $derived(project.images.filter((img: ProjectImage) => img.type !== 'thumbnail'));
	const isPrivate = $derived(project.visibility === 'private');

	let blurredSrc = $state<string>();
	let nextBlurredSrc = $state<string>();

	const thumbnailSrc = $derived(
		isBlurredProject(project) ? (blurredSrc ?? BLUR_PLACEHOLDER) : thumbnail?.imageUrl
	);
	const nextThumbnailSrc = $derived(
		project.nextProject && isBlurredProject(project.nextProject)
			? (nextBlurredSrc ?? BLUR_PLACEHOLDER)
			: project.nextProject?.thumbnailUrl
	);

	$effect(() => {
		blurredSrc = undefined;
		if (!thumbnail || !isBlurredProject(project)) return;
		const url = thumbnail.imageUrl;
		blurImage(url)
			.then((src) => {
				if (thumbnail?.imageUrl === url) blurredSrc = src;
			})
			.catch(() => {});
	});

	$effect(() => {
		nextBlurredSrc = undefined;
		const next = project.nextProject;
		if (!next?.thumbnailUrl || !isBlurredProject(next)) return;
		const url = next.thumbnailUrl;
		blurImage(url)
			.then((src) => {
				if (project.nextProject?.thumbnailUrl === url) nextBlurredSrc = src;
			})
			.catch(() => {});
	});

	let imgPanelEl: HTMLDivElement | undefined = $state();
	let morphPanelEl: HTMLDivElement | undefined = $state();
	let titleEl: HTMLHeadingElement | undefined = $state();
	let categoryRowEl: HTMLDivElement | undefined = $state();
	let yearEl: HTMLParagraphElement | undefined = $state();
	let introEl: HTMLParagraphElement | undefined = $state();
	let metaGroupEl: HTMLDivElement | undefined = $state();
	let cContentEl: HTMLDivElement | undefined = $state();
	let nextImgEl: HTMLImageElement | undefined = $state();
	let scrollProgress = $state(0);

	let initX = 0;
	let initY = 0;
	let wrapWidth = 0;
	let aFontSize = 0;
	let fittedFontSize = 0;
	let finalYOffset = 0;
	let entranceDone = false;
	let isWrapped = true;
	let unsubLoader: (() => void) | undefined;

	function easeInOutCubic(t: number): number {
		return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	}

	function easeInOutSine(t: number): number {
		return -(Math.cos(Math.PI * t) - 1) / 2;
	}

	function calcLayout() {
		if (!titleEl || !morphPanelEl) return;
		const vw = window.innerWidth;
		aFontSize = Math.min(vw * 0.048, 99.2);
		gsap.set(titleEl, { fontSize: `${aFontSize}px`, whiteSpace: 'nowrap', width: 'auto' });
		const singleLineW = titleEl.offsetWidth;
		const panelW = morphPanelEl.offsetWidth;
		const panelH = morphPanelEl.offsetHeight;
		wrapWidth = panelW - 112;
		gsap.set(titleEl, { whiteSpace: 'normal', width: wrapWidth });
		const titleH = titleEl.offsetHeight;
		initX = 0;
		initY = 96 + titleH / 2 - panelH / 2;
		const topReserved = 64;
		const bottomReserved = 280;
		const availableH = panelH - topReserved - bottomReserved;
		fittedFontSize = Math.min(100, Math.max(16, (availableH / singleLineW) * aFontSize));
		finalYOffset = (topReserved - bottomReserved) / 2;
	}

	function runEntranceAnimation(fromHome: boolean) {
		if (!titleEl || !categoryRowEl || !yearEl) return;
		const nonTitleEls = [categoryRowEl, yearEl, introEl].filter(Boolean) as HTMLElement[];
		gsap.set(nonTitleEls, { opacity: 0, x: -1000 });
		gsap.set(titleEl, { opacity: 0, x: initX - 1000 });
		if (!fromHome) gsap.set(imgPanelEl!, { clipPath: 'inset(0% 0% 100% 0%)' });

		unsubLoader?.();
		unsubLoader = loaderDone.subscribe((done) => {
			if (!done) return;
			unsubLoader?.();
			const delay = fromHome ? 0.35 : 0.1;
			if (!fromHome) {
				gsap.to(imgPanelEl!, {
					clipPath: 'inset(0% 0% 0% 0%)',
					duration: 1.1,
					ease: 'power3.out',
					delay: 0.1
				});
			}
			gsap.to(nonTitleEls, {
				opacity: 1,
				x: 0,
				duration: 1.1,
				stagger: 0.12,
				ease: 'power3.out',
				delay,
				onComplete: () => {
					entranceDone = true;
				}
			});
			gsap.to(titleEl!, {
				opacity: 1,
				x: initX,
				duration: 1.1,
				ease: 'power3.out',
				delay: delay + 0.12
			});
		});
	}

	function setupPage(fromHome: boolean, forceAnimate = false) {
		calcLayout();
		gsap.set(titleEl!, { xPercent: -50, yPercent: -50, x: initX, y: initY, rotation: 0 });
		gsap.set(metaGroupEl!, { opacity: 0 });

		if (!forceAnimate && window.scrollY > 0 && !fromHome) {
			gsap.set(imgPanelEl!, { clipPath: 'inset(0% 0% 0% 0%)' });
			entranceDone = true;
		} else {
			runEntranceAnimation(fromHome);
		}

		scrollUpdate();
	}

	function scrollUpdate() {
		if (
			!imgPanelEl ||
			!morphPanelEl ||
			!titleEl ||
			!categoryRowEl ||
			!yearEl ||
			!metaGroupEl ||
			!cContentEl
		)
			return;

		const sy = window.scrollY;
		const p = Math.min(Math.max(sy / (window.innerHeight * 1.8), 0), 1);
		const vw = window.innerWidth;

		const imgP = easeInOutSine(Math.min(p / 0.7, 1));
		gsap.set(imgPanelEl!, { width: `${(1 - imgP) * 60}%`, opacity: 1 - imgP });

		const panelP = easeInOutCubic(Math.min(p / 0.85, 1));
		gsap.set(morphPanelEl!, {
			left: vw * 0.6 * (1 - panelP),
			width: vw * 0.4 + (208 - vw * 0.4) * panelP
		});

		const rotP = easeInOutSine(Math.min(Math.max((p - 0.02) / 0.88, 0), 1));
		const posP = easeInOutSine(Math.min(p / 0.4, 1));

		const nowWrapped = rotP < 0.4;
		if (nowWrapped !== isWrapped) {
			isWrapped = nowWrapped;
			gsap.set(
				titleEl!,
				isWrapped
					? { whiteSpace: 'normal', width: wrapWidth }
					: { whiteSpace: 'nowrap', width: 'auto' }
			);
		}

		gsap.set(titleEl!, {
			rotation: -90 * rotP,
			scale: 1 - Math.sin(rotP * Math.PI) * 0.05,
			fontSize: `${aFontSize + (fittedFontSize - aFontSize) * rotP}px`
		});

		if (entranceDone) {
			const titleOp = rotP < 0.2 ? 1 - rotP / 0.2 : rotP > 0.75 ? (rotP - 0.75) / 0.25 : 0;
			gsap.set(titleEl!, {
				x: initX * (1 - posP),
				y: initY * (1 - posP) + finalYOffset * rotP - 28 * Math.sin(rotP * Math.PI),
				opacity: titleOp
			});

			const catP = easeInOutCubic(Math.min(panelP / 0.45, 1));
			gsap.set(categoryRowEl!, { opacity: 1 - catP, y: -30 * catP });

			const yearP = easeInOutCubic(Math.min(Math.max((panelP - 0.1) / 0.45, 0), 1));
			gsap.set(yearEl!, { opacity: 1 - yearP, y: 24 * yearP });

			if (introEl) gsap.set(introEl, { opacity: Math.max(1 - panelP * 2.5, 0) });
		}

		gsap.set(metaGroupEl!, { opacity: Math.max((panelP - 0.75) / 0.25, 0) });
		gsap.set(cContentEl!, { opacity: Math.max((p - 0.88) / 0.12, 0) });

		const maxScroll = document.body.scrollHeight - window.innerHeight;
		scrollProgress = maxScroll > 0 ? sy / maxScroll : 0;
	}

	onMount(() => {
		let rafId: number;
		const onScroll = () => {
			cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(scrollUpdate);
		};
		window.addEventListener('scroll', onScroll, { passive: true });

		if (preview) {
			window.scrollTo(0, 0);
			tick().then(() => setupPage(false, true));
		}

		return () => {
			window.removeEventListener('scroll', onScroll);
			cancelAnimationFrame(rafId);
			unsubLoader?.();
		};
	});

	afterNavigate(async ({ from }) => {
		if (preview) return;

		await tick();

		if (!imgPanelEl || !morphPanelEl || !titleEl || !categoryRowEl || !yearEl || !cContentEl)
			return;

		const fromHome = get(skipHeroReveal);
		if (fromHome) skipHeroReveal.set(false);

		if (!from) {
			setupPage(fromHome);
			return;
		}

		window.scrollTo(0, 0);
		entranceDone = false;
		isWrapped = true;

		gsap.killTweensOf(
			[
				imgPanelEl,
				morphPanelEl,
				titleEl,
				categoryRowEl,
				yearEl,
				introEl,
				metaGroupEl,
				cContentEl
			].filter(Boolean)
		);

		gsap.set(imgPanelEl!, { opacity: 1, width: '60%', clipPath: 'inset(0% 0% 0% 0%)' });
		gsap.set(morphPanelEl!, { opacity: 1, left: '60%', width: '40%' });
		gsap.set(cContentEl!, { opacity: 0 });
		if (nextImgEl) gsap.set(nextImgEl, { clearProps: 'visibility' });

		setupPage(fromHome, true);
	});

	async function handleNextProjectClick(nextId: string) {
		if (preview) return;

		if (!nextImgEl) {
			goto(`/project/${nextId}`);
			return;
		}

		skipNextLoader.set(true);
		skipHeroReveal.set(true);
		preloadData(`/project/${nextId}`).catch(() => {});

		const { left, top, width, height } = nextImgEl.getBoundingClientRect();

		const clientWidth = measureScrollbarAccountedWidth();

		const panelWidth = clientWidth * 0.6;

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

		gsap.set([imgPanelEl, morphPanelEl, cContentEl].filter(Boolean), { opacity: 0 });

		get(lenisInstance)?.scrollTo(0, { immediate: true });

		await gsap.to(ghost, {
			top: 112,
			height: window.innerHeight - 112,
			width: panelWidth,
			duration: 1.1,
			ease: 'power3.inOut'
		});

		await goto(`/project/${nextId}`);
		await gsap.to(ghost, { opacity: 0, duration: 0.4, ease: 'power2.out' });
		ghost.remove();
	}
</script>

<div class="w-full bg-white">
	<div class="h-[240vh]"></div>

	<div bind:this={cContentEl} class="ml-52 px-12 pt-12 pb-40 opacity-0">
		{#if thumbnail}
			<div class="mb-16">
				<img class="aspect-video w-full object-cover" src={thumbnailSrc} alt={project.title} />
			</div>
		{/if}

		{#if isPrivate}
			<div class="max-w-4xl pt-4 pb-24">
				<p class="mb-5 text-xs tracking-[0.4em] uppercase opacity-30">Private Project</p>
				<h3 class="font-clash mb-10 text-5xl leading-tight font-bold text-balance">
					This one stays behind closed doors.
				</h3>
				<p class="max-w-xl text-xl leading-loose opacity-75">
					I'm really sorry I can't share more screenshots or details for this project due to its
					private nature. I still wanted to include it here because I'm really proud of the work —
					if we ever get to chat, I'd be happy to walk you through what I can.
				</p>
			</div>
		{:else if project.texts.length > 0}
			<div class="mb-20 max-w-xl">
				<p class="text-xl leading-loose opacity-75">{project.texts[0].content}</p>
			</div>
		{/if}

		{#each isPrivate ? [] : gallery as img, i}
			<div class="mb-10">
				{#if img.orientation === 'landscape'}
					<img class="aspect-video w-full object-cover" src={img.imageUrl} alt={project.title} />
				{:else}
					<div class="flex" class:justify-end={i % 2 !== 0}>
						<img class="aspect-3/4 w-[52%] object-cover" src={img.imageUrl} alt={project.title} />
					</div>
				{/if}
			</div>

			{#if project.texts[i + 1]}
				<div class="mb-14 max-w-4xl">
					<p class="text-right text-xl leading-loose opacity-70">{project.texts[i + 1].content}</p>
				</div>
			{/if}
		{/each}

		{#if project.nextProject?.thumbnailUrl}
			<div class="mt-40 border-t border-black/10 pt-16 pb-0">
				<p class="mb-5 text-xs tracking-[0.4em] uppercase opacity-30">Next</p>
				<h3 class="font-clash mb-10 text-5xl leading-none font-bold">
					{project.nextProject.title}
				</h3>
				<div
					class="cursor-pointer overflow-hidden"
					role="button"
					tabindex="0"
					onclick={() => handleNextProjectClick(project.nextProject!.id)}
					onkeydown={(e) => e.key === 'Enter' && handleNextProjectClick(project.nextProject!.id)}
				>
					<img
						bind:this={nextImgEl}
						class="aspect-video w-full object-cover select-none"
						src={nextThumbnailSrc}
						alt={project.nextProject.title}
						draggable="false"
					/>
				</div>
			</div>
		{/if}
	</div>
</div>

<div
	bind:this={imgPanelEl}
	class="fixed top-[112px] left-0 z-10 h-[calc(100vh-112px)] w-[60%] overflow-hidden"
>
	{#if thumbnail}
		<img class="h-full w-full object-cover" src={thumbnailSrc} alt={project.title} />
	{/if}
</div>

<div
	bind:this={morphPanelEl}
	class="fixed top-[112px] bottom-0 left-[60%] z-10 w-[40%] overflow-hidden border-r border-black/[0.07] bg-white"
>
	<div bind:this={categoryRowEl} class="absolute top-[56px] left-[56px] flex items-center gap-5">
		<div class="h-px w-7 shrink-0 bg-black/25"></div>
		<span class="tracking-[0.3em] uppercase opacity-40">{project.category}</span>
		{#if isPrivate}
			<span
				class="border border-black/20 px-2.5 py-1 text-[10px] tracking-[0.3em] uppercase opacity-50"
			>
				Private
			</span>
		{/if}
	</div>

	<h1 bind:this={titleEl} class="font-clash absolute top-1/2 left-1/2 leading-none font-bold">
		{project.title}
	</h1>

	<p
		bind:this={yearEl}
		class="absolute bottom-[88px] left-[56px] text-[9px] tracking-[0.48em] uppercase opacity-30"
	>
		{project.year}
	</p>

	{#if project.texts.length > 0}
		<p
			bind:this={introEl}
			class="absolute bottom-12 left-[56px] max-w-[30vw] text-xl leading-relaxed opacity-55"
		>
			{project.texts[0].content}
		</p>
	{/if}

	<div bind:this={metaGroupEl} class="absolute bottom-12 left-8 space-y-5">
		<div>
			<p class="mb-1 text-xs tracking-[0.5em] uppercase opacity-25">Category</p>
			<p class="leading-snug opacity-65">{project.category}</p>
		</div>
		<div>
			<p class="racking-[0.5em] mb-1 text-xs uppercase opacity-25">Year</p>
			<p class="opacity-65">{project.year}</p>
		</div>
		<div class="flex justify-center pt-3">
			<div class="relative h-16 w-[2px] bg-black/10">
				<div
					class="absolute top-0 left-0 w-full bg-black transition-[height] duration-120 ease-linear"
					style="height: {scrollProgress * 100}%;"
				></div>
			</div>
		</div>
	</div>
</div>
