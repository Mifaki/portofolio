<script lang="ts">
	import '../app.css';
	import PageLoader from '$lib/components/PageLoader.svelte';
	import { navigating } from '$app/state';
	import { afterNavigate, goto } from '$app/navigation';
	import Navbar from '$lib/components/Navbar.svelte';
	import { loaderDone } from '$lib/stores/loader';
	import { lenisInstance } from '$lib/stores/lenis';
	import { ENV } from '$lib/config/env';
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

		lenisInstance.set(lenis);
		lenis.stop();
		const unsub = loaderDone.subscribe((done) => {
			if (done) lenis.start();
		});

		return () => {
			unsub();
			lenisInstance.set(null);
			lenis.destroy();
		};
	});

	onMount(() => {
		if (window.parent === window) return;

		function handleMessage(event: MessageEvent) {
			if (event.origin !== ENV.dashboardOrigin) return;
			if (event.data?.type !== 'preview:control') return;
			if (event.data.action === 'back') history.back();
			else if (event.data.action === 'forward') history.forward();
			else if (event.data.action === 'reload') location.reload();
			else if (
				event.data.action === 'navigate' &&
				typeof event.data.path === 'string' &&
				event.data.path.startsWith('/')
			) {
				goto(event.data.path);
			}
		}

		window.addEventListener('message', handleMessage);
		return () => window.removeEventListener('message', handleMessage);
	});

	afterNavigate(() => {
		if (window.parent === window) return;
		const nav = (window as { navigation?: { canGoBack: boolean; canGoForward: boolean } })
			.navigation;
		window.parent.postMessage(
			{
				type: 'preview:location',
				path: location.pathname,
				canGoBack: nav ? nav.canGoBack : true,
				canGoForward: nav ? nav.canGoForward : true
			},
			ENV.dashboardOrigin
		);
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
