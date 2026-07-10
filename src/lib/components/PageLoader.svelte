<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { get } from 'svelte/store';
	import { beforeNavigate, goto } from '$app/navigation';
	import { loaderDone, skipNextLoader } from '$lib/stores/loader';
	import { measureScrollbarAccountedWidth } from '$lib/utils/scrollbar';

	interface Props {
		ready?: boolean;
	}
	let { ready = false }: Props = $props();

	let visible = $state(true);
	let paused = $state(false);
	let slideIn = $state(false);
	let slideOut = $state(false);
	let logoFull = $state(false);
	let logoFromFull = $state(false);
	let overlayWidth = $state(0);
	let scrollbarPad = $state(0);
	let exiting = false;
	let entering = false;
	let runId = 0;

	const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
	const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));

	onMount(() => {
		window.scrollTo(0, 0);
		setTimeout(() => window.scrollTo(0, 0), 0);
	});

	beforeNavigate((nav) => {
		if (entering) return;
		if (get(skipNextLoader)) return;
		if (nav.willUnload || !nav.to || nav.to.route.id === null) return;
		if (nav.type !== 'link' && nav.type !== 'goto') return;
		if (visible && !slideOut) return;

		nav.cancel();
		enterAndNavigate(nav.to.url.href);
	});

	$effect(() => {
		if (!ready) untrack(handleNavStart);
	});

	function handleNavStart() {
		if (entering) return;

		if (get(skipNextLoader)) {
			skipNextLoader.set(false);
			visible = false;
			loaderDone.set(true);
			return;
		}

		if (visible && !slideOut) {
			runId++;
			exiting = false;
			paused = false;
			loaderDone.set(false);
			window.scrollTo(0, 0);
			return;
		}

		runEnter();
	}

	async function enterAndNavigate(href: string) {
		await runEnter();
		await goto(href).catch(() => {});
	}

	async function runEnter() {
		const id = ++runId;

		overlayWidth = window.innerWidth;
		scrollbarPad = overlayWidth - measureScrollbarAccountedWidth();
		entering = true;
		visible = true;
		slideIn = true;
		logoFull = true;
		logoFromFull = true;
		paused = false;
		slideOut = false;
		exiting = false;
		loaderDone.set(false);

		await nextFrame();
		await nextFrame();
		if (id !== runId) {
			entering = false;
			return;
		}
		slideIn = false;

		// wait slide-in transition
		await sleep(1000);
		entering = false;
		if (id !== runId) return;

		window.scrollTo(0, 0);
		logoFull = false;
	}

	async function handleIteration() {
		if (!ready || exiting) return;

		exiting = true;
		const id = ++runId;

		// wait until logo fully filled
		await sleep(1650);
		if (id !== runId) return;
		paused = true;

		// hold completed logo
		await sleep(500);
		if (id !== runId) return;
		slideOut = true;

		// wait slide transition
		await sleep(1000);
		if (id !== runId) return;
		visible = false;

		loaderDone.set(true);
	}
</script>

{#if visible}
	<div
		class="overlay"
		class:slide-in={slideIn}
		class:slide-out={slideOut}
		style:width={overlayWidth ? `${overlayWidth}px` : null}
		style:padding-right={scrollbarPad ? `${scrollbarPad}px` : null}
	>
		<svg
			width="216"
			height="150"
			viewBox="0 0 36 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class:paused
			class:full={logoFull}
			class:from-full={logoFromFull}
		>
			<defs>
				<mask id="circle-mask">
					<rect
						class="fill-circle"
						x="0"
						y="25"
						width="25"
						height="25"
						fill="white"
						onanimationiteration={handleIteration}
					/>
				</mask>
				<mask id="bar-mask">
					<rect class="fill-bar" x="24" y="25" width="12" height="25" fill="white" />
				</mask>
			</defs>
			<g mask="url(#circle-mask)">
				<circle
					cx="12.2474"
					cy="12.2474"
					r="10.1856"
					fill="black"
					stroke="black"
					stroke-width="4.12371"
				/>
			</g>
			<g mask="url(#bar-mask)">
				<rect
					x="31.5465"
					y="1.48454"
					width="2.96907"
					height="21.5258"
					fill="black"
					stroke="black"
					stroke-width="2.96907"
				/>
			</g>
		</svg>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 9999;
		display: grid;
		place-items: center;
		background: white;
		transition: transform 1s cubic-bezier(0.76, 0, 0.24, 1);
	}
	.overlay.slide-in {
		transform: translateY(-100%);
	}
	.overlay.slide-out {
		transform: translateY(-100%);
		pointer-events: none;
	}
	.paused :global(.fill-circle),
	.paused :global(.fill-bar) {
		animation-play-state: paused;
	}
	.full :global(.fill-circle),
	.full :global(.fill-bar) {
		animation: none;
		y: 0;
	}
	.from-full :global(.fill-circle),
	.from-full :global(.fill-bar) {
		animation-delay: -1.68s;
	}
	.fill-circle {
		animation: fill-circle 2.4s ease infinite;
	}
	.fill-bar {
		animation: fill-bar 2.4s ease infinite;
	}
	@keyframes fill-circle {
		0%,
		100% {
			y: 25px;
		}
		40%,
		70% {
			y: 0;
		}
	}
	@keyframes fill-bar {
		0%,
		35%,
		100% {
			y: 25px;
		}
		70%,
		85% {
			y: 0;
		}
	}
</style>
