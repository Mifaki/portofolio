<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<svelte:head>
	<title>Ahmad Faiz</title>
	<meta name="description" content="Ahmad Faiz Portofolio" />
</svelte:head>

<section>
	<h1 class="font-satoshi text-center text-4xl font-bold">Faiz's Portofolio</h1>

	<div class="projects">
		{#each data.projects as project}
			{@const thumbnail = project.images.find(
				(img: { type: string; imageUrl: string }) => img.type === 'thumbnail'
			)}
			{#if thumbnail}
				<div class="project-card">
					<img src={thumbnail.imageUrl} alt={project.title} />
					<p>{project.title}</p>
				</div>
			{/if}
		{/each}
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}

	h1 {
		width: 100%;
	}

	.projects {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		margin-top: 2rem;
		flex-wrap: wrap;
		justify-content: center;
	}

	.project-card img {
		width: 200px;
		aspect-ratio: 16 / 9;
		object-fit: cover;
		border-radius: 4px;
	}

	.project-card p {
		margin-top: 0.5rem;
		font-size: 0.875rem;
		text-align: center;
	}
</style>
