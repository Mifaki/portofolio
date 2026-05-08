<script lang="ts">
  import '../app.css';
  import PageLoader from '$lib/components/PageLoader.svelte';
  import { navigating } from '$app/state';

  let { children } = $props();

  let ready = $derived(!navigating.to);
</script>

<PageLoader {ready} />

<div class="app">
	<main>
		{@render children()}
	</main>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}
</style>
