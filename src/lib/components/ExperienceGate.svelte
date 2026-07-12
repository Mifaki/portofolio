<script lang="ts" module>
	let gateChecked = false;
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { loaderHold, skipNextLoader } from '$lib/stores/loader';
	import { getExperience, setExperience } from '$lib/utils/experience';

	let visible = $state(true);
	let showChoice = $state(false);
	let closing = $state(false);

	onMount(() => {
		if (gateChecked || window.parent !== window) {
			visible = false;
			return;
		}
		gateChecked = true;

		const preference = getExperience();
		if (preference === 'rich') {
			visible = false;
			return;
		}
		if (preference === 'simple') {
			skipNextLoader.set(true);
			goto('/simple', { replaceState: true });
			return;
		}

		loaderHold.set(true);
		showChoice = true;
	});

	function chooseRich() {
		setExperience('rich');
		closing = true;
		loaderHold.set(false);
		setTimeout(() => (visible = false), 500);
	}

	function chooseSimple() {
		setExperience('simple');
		loaderHold.set(false);
		skipNextLoader.set(true);
		goto('/simple');
	}
</script>

{#if visible}
	<div
		class="fixed inset-0 z-[10000] grid place-items-center bg-white transition-opacity duration-500"
		class:opacity-0={closing}
		class:pointer-events-none={closing}
	>
		{#if showChoice}
			<div class="flex flex-col items-center gap-10 px-8 text-center">
				<div class="flex flex-col gap-4">
					<p class="text-xs tracking-[0.4em] uppercase opacity-40">Before you enter</p>
					<h1 class="font-clash text-3xl font-semibold md:text-4xl">
						How would you like to browse?
					</h1>
				</div>
				<div class="flex flex-col gap-4 md:flex-row md:gap-6">
					<button
						onclick={chooseRich}
						class="cursor-pointer border border-black px-10 py-5 text-left transition-colors duration-300 hover:bg-black hover:text-white"
					>
						<span class="font-clash block text-lg font-semibold">Full experience</span>
						<span class="mt-1 block text-xs tracking-[0.2em] uppercase opacity-50">
							Animations and transitions
						</span>
					</button>
					<button
						onclick={chooseSimple}
						class="cursor-pointer border border-black px-10 py-5 text-left transition-colors duration-300 hover:bg-black hover:text-white"
					>
						<span class="font-clash block text-lg font-semibold">Simple version</span>
						<span class="mt-1 block text-xs tracking-[0.2em] uppercase opacity-50">
							Just the content
						</span>
					</button>
				</div>
				<p class="text-xs tracking-[0.2em] uppercase opacity-40">You can switch anytime</p>
			</div>
		{/if}
	</div>
{/if}
