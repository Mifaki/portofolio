<script lang="ts">
	import '../app.css';
	import PageLoader from '$lib/components/PageLoader.svelte';
	import { navigating } from '$app/state';
	import { writable } from 'svelte/store';
	import Navbar from '$lib/components/Navbar.svelte';

	let { children } = $props();
	let ready = $derived(!navigating.to);

	export const loaderDone = writable(false);
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
