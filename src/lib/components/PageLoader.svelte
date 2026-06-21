<script lang="ts">
	import { onMount } from 'svelte';
	import { loaderDone, skipNextLoader } from '$lib/stores/loader';

	interface Props {
		ready?: boolean;
	}
	let { ready = false }: Props = $props();

	let visible = $state(true);
	let paused = $state(false);
	let slideOut = $state(false);
	let exiting = false;

	const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	onMount(() => {
		window.scrollTo(0, 0);
		setTimeout(() => window.scrollTo(0, 0), 0);
	});

	$effect(() => {
		if (!ready) {
			let shouldSkip = false;
			const unsub = skipNextLoader.subscribe((v) => (shouldSkip = v));
			unsub();

			if (shouldSkip) {
				skipNextLoader.set(false); 
				visible = false;
				loaderDone.set(true);
				return;
			}

			visible = true;
			paused = false;
			slideOut = false;
			exiting = false;
			loaderDone.set(false);
			window.scrollTo(0, 0);
		}
	});

	async function handleIteration() {
		if (!ready || exiting) return;

		exiting = true;

		// wait until logo fully filled
		await sleep(1650);
		paused = true;

		// hold completed logo
		await sleep(500);
		slideOut = true;

		// wait slide transition
		await sleep(1000);
		visible = false;
		
		loaderDone.set(true);
	}
</script>

{#if visible}
	<div class="overlay" class:slide-out={slideOut}>
		<svg
			width="216"
			height="150"
			viewBox="0 0 36 25"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class:paused
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
	.overlay.slide-out {
		transform: translateY(-100%);
		pointer-events: none;
	}
	.paused :global(.fill-circle),
	.paused :global(.fill-bar) {
		animation-play-state: paused;
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