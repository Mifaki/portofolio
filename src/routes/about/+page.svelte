<script lang="ts">
	import type { PageProps } from './$types';
	import type { About } from '$lib/types/about';
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { loaderDone } from '$lib/stores/loader';

	let { data }: PageProps = $props();
	const about: About = data.about;

	const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	function formatPeriod(sm: number, sy: number, em: number | null, ey: number | null) {
		const end = em && ey ? `${MONTHS[em - 1]} ${ey}` : 'Present';
		return `${MONTHS[sm - 1]} ${sy} – ${end}`;
	}


	let imgWrapperEl: HTMLDivElement | undefined;
	let imageLayerEls: HTMLDivElement[] = [];
	let labelEl: HTMLDivElement | undefined;
	let nameEl: HTMLHeadingElement | undefined;
	let descEls: HTMLParagraphElement[] = [];
	let socialEl: HTMLDivElement | undefined = $state();
	let contentEl: HTMLDivElement | undefined;
	let currentIndex = 0;
	let isSliding = false;
	let contentVisible = $state(false);

	let stackSectionEl: HTMLElement | undefined;
	let stackGhostEls: HTMLElement[] = [];
	let stackFilledEls: HTMLElement[] = [];

	function nextSlide() {
		if (isSliding || about.images.length <= 1) return;
		isSliding = true;
		const prev = currentIndex;
		const next = (currentIndex + 1) % about.images.length;
		gsap.set(imageLayerEls[next], { zIndex: 2, clipPath: 'inset(0% 100% 0% 0%)' });
		gsap.set(imageLayerEls[prev], { zIndex: 1 });
		gsap.to(imageLayerEls[next], {
			clipPath: 'inset(0% 0% 0% 0%)',
			duration: 1.2,
			ease: 'power3.out',
			onComplete: () => {
				gsap.set(imageLayerEls[prev], { zIndex: 0 });
				currentIndex = next;
				isSliding = false;
			}
		});
	}

	function scramble(el: HTMLElement, target: string, delayMs = 0) {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		setTimeout(() => {
			const len = target.length;
			const frames = 120;
			let f = 0;
			const tick = () => {
				const p = f / frames;
				el.textContent = Array.from({ length: len }, (_, i) =>
					i < Math.floor(p * len)
						? target[i]
						: target[i] === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]
				).join('');
				f++;
				if (f <= frames) requestAnimationFrame(tick);
				else el.textContent = target;
			};
			requestAnimationFrame(tick);
		}, delayMs);
	}

	onMount(() => {
		gsap.set(imgWrapperEl!, { clipPath: 'inset(0% 100% 0% 0%)' });
		gsap.set([labelEl, nameEl, socialEl].filter(Boolean), { opacity: 0, y: 30 });
		gsap.set(descEls.filter(Boolean), { opacity: 0, y: 20 });
		gsap.set(contentEl!, { opacity: 0 });
		imageLayerEls.forEach((el, i) =>
			gsap.set(el, { zIndex: i === 0 ? 1 : 0, clipPath: 'inset(0% 0% 0% 0%)' })
		);

		let slideInterval: ReturnType<typeof setInterval> | undefined;
		let rafId: number;

		const unsub = loaderDone.subscribe((done) => {
			if (!done) return;
			unsub();
			gsap.to(imgWrapperEl!, {
				clipPath: 'inset(0% 0% 0% 0%)',
				duration: 1.2,
				ease: 'power3.out',
				delay: 0.1,
				onComplete: () => {
					if (about.images.length > 1) slideInterval = setInterval(nextSlide, 4000);
				}
			});
			gsap.to(labelEl!, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.3 });
			gsap.to(nameEl!, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: 0.45 });
			gsap.to(descEls.filter(Boolean), {
				opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, delay: 0.65
			});
			gsap.to(socialEl!, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.85 });
		});

		const stackObs = new IntersectionObserver((entries) => {
			if (!entries.some((e) => e.isIntersecting)) return;
			stackObs.disconnect();

			stackFilledEls.filter(Boolean).forEach((el, i) => {
				const s = about.techStacks[i];
				if (!s) return;
				const delay = i * 0.15;

				gsap.fromTo(
					el,
					{ clipPath: 'inset(0 100% 0 0)' },
					{ clipPath: `inset(0 ${100 - s.percentage}% 0 0)`, duration: 2.4, ease: 'power3.out', delay }
				);

				scramble(el, s.name, delay * 1000);
				scramble(stackGhostEls[i], s.name, delay * 1000);
			});
		}, { threshold: 0.2 });
		if (stackSectionEl) stackObs.observe(stackSectionEl);

		const onScroll = () => {
			cancelAnimationFrame(rafId);
			rafId = requestAnimationFrame(() => {
				if (!contentVisible && window.scrollY > window.innerHeight * 0.4) {
					contentVisible = true;
					gsap.to(contentEl!, { opacity: 1, duration: 0.8, ease: 'power2.out' });
				}
			});
		};
		window.addEventListener('scroll', onScroll, { passive: true });

		return () => {
			unsub();
			clearInterval(slideInterval);
			cancelAnimationFrame(rafId);
			window.removeEventListener('scroll', onScroll);
			stackObs.disconnect();
		};
	});
</script>

<div class="w-full bg-white">
	<div class="flex h-screen w-full">
		<div class="relative flex w-[55%] flex-col justify-center px-14 pb-16 pt-[112px]">
			<div bind:this={labelEl} class="mb-8 flex items-center gap-5">
				<div class="h-px w-7 shrink-0 bg-black/25"></div>
				<span class="text-xs tracking-[0.3em] uppercase opacity-40">About</span>
			</div>
			<h1 bind:this={nameEl} class="font-clash mb-8 text-[clamp(3rem,7vw,7rem)] font-bold leading-none">
				{about.name}
			</h1>
			<div class="max-w-sm space-y-4">
				{#each about.descriptions as desc, i}
					<p bind:this={descEls[i]} class="text-lg leading-relaxed opacity-60">{desc.content}</p>
				{/each}
			</div>
			{#if about.github || about.linkedin || about.instagram}
				<div bind:this={socialEl} class="mt-12 flex items-center gap-6">
					{#if about.github}
						<a href={about.github} target="_blank" rel="noopener noreferrer"
							class="text-xs tracking-[0.25em] uppercase opacity-40 transition-opacity duration-200 hover:opacity-100">GitHub</a>
					{/if}
					{#if about.linkedin}
						<span class="text-xs opacity-20">/</span>
						<a href={about.linkedin} target="_blank" rel="noopener noreferrer"
							class="text-xs tracking-[0.25em] uppercase opacity-40 transition-opacity duration-200 hover:opacity-100">LinkedIn</a>
					{/if}
					{#if about.instagram}
						<span class="text-xs opacity-20">/</span>
						<a href={about.instagram} target="_blank" rel="noopener noreferrer"
							class="text-xs tracking-[0.25em] uppercase opacity-40 transition-opacity duration-200 hover:opacity-100">Instagram</a>
					{/if}
				</div>
			{/if}
		</div>

		<div class="w-[45%] pt-[112px]">
			<div bind:this={imgWrapperEl} class="relative h-full w-full overflow-hidden">
				{#each about.images as img, i}
					<div bind:this={imageLayerEls[i]} class="absolute inset-0">
						<img class="h-full w-full object-cover" src={img.imageUrl} alt={about.name} />
					</div>
				{/each}
				{#if about.images.length === 0}
					<div class="h-full w-full bg-black/5"></div>
				{/if}
			</div>
		</div>
	</div>

	<div bind:this={contentEl} class="opacity-0">
		{#if about.workExperiences.length > 0}
			<div class="border-t border-black/10 px-14 py-24">
				<div class="mb-16 flex items-center gap-5">
					<div class="h-px w-7 shrink-0 bg-black/25"></div>
					<span class="text-xs tracking-[0.3em] uppercase opacity-40">Experience</span>
				</div>
				<div>
					{#each about.workExperiences as exp}
						<div class="border-t border-black/[0.07] py-14 first:border-t-0">
							<div class="flex items-start justify-between gap-8">
								<h3 class="font-clash text-[clamp(2.5rem,5vw,5rem)] font-bold leading-none">
									{exp.company}
								</h3>
								<div class="shrink-0 pt-2 text-right">
									{#if exp.location}
										<p class="text-xs tracking-[0.2em] uppercase opacity-35">{exp.location}</p>
									{/if}
									<p class="mt-1 text-xs tracking-[0.2em] uppercase opacity-30">
										{formatPeriod(exp.startMonth, exp.startYear, exp.endMonth, exp.endYear)}
									</p>
								</div>
							</div>
							<div class="mt-6">
								<p class="text-xl font-medium opacity-60">{exp.role}</p>
								{#if exp.description}
									<p class="mt-3 max-w-2xl text-base leading-relaxed opacity-35">{exp.description}</p>
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if about.techStacks.length > 0}
		<div class="border-t border-black/10 px-14 py-24">
			<div class="mb-16 flex items-center gap-5">
				<div class="h-px w-7 shrink-0 bg-black/25"></div>
				<span class="text-xs tracking-[0.3em] uppercase opacity-40">Stack</span>
			</div>
			<div bind:this={stackSectionEl} class="grid grid-cols-2">
				{#each about.techStacks as stack, i}
					<div class="flex items-baseline justify-between py-6
						{i < 2 ? '' : 'border-t border-black/[0.06]'}
						{i % 2 === 0 ? 'pr-12' : 'border-l border-black/[0.06] pl-12'}">
						<div class="relative min-w-0">
							<span
								bind:this={stackGhostEls[i]}
								class="font-clash whitespace-nowrap text-[clamp(1.5rem,3vw,3.5rem)] font-bold opacity-[0.07]"
							>{stack.name}</span>
							<span
								bind:this={stackFilledEls[i]}
								class="font-clash absolute inset-0 whitespace-nowrap text-[clamp(1.5rem,3vw,3.5rem)] font-bold"
								style="clip-path: inset(0 100% 0 0)"
							>{stack.name}</span>
						</div>
						<span class="ml-6 shrink-0 text-xs tracking-[0.25em] uppercase opacity-25">{stack.category.name}</span>
					</div>
				{/each}
			</div>
		</div>
		{/if}

		<div class="h-24"></div>
	</div>
</div>
