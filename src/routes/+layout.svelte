<script lang="ts">
	import '../app.css';
	import PageLoader from '$lib/components/PageLoader.svelte';
	import { navigating } from '$app/state';
	import Navbar from '$lib/components/Navbar.svelte';
	import { loaderDone } from '$lib/stores/loader';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';

	let { children } = $props();
	let ready = $derived(!navigating.to);

	onMount(() => {
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			orientation: 'vertical',
			smoothWheel: true
		});

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}
		requestAnimationFrame(raf);

		lenis.stop();
		const unsub = loaderDone.subscribe((done) => {
			if (done) lenis.start();
		});

		return () => {
			unsub();
			lenis.destroy();
		};
	});
</script>

<PageLoader {ready} />
<div class="app">
	<Navbar />
	<main>
		{@render children()}
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		overflow: hidden;
	}
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		box-sizing: border-box;
	}
</style>
