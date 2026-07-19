<script lang="ts">
	import { page } from '$app/state';
	import { SITE } from '$lib/utils/seo';

	interface Props {
		title: string;
		description?: string;
		image?: string;
		type?: string;
		jsonLd?: Record<string, unknown> | Record<string, unknown>[];
	}

	let { title, description = SITE.description, image, type = 'website', jsonLd }: Props = $props();

	let canonical = $derived(page.url.origin + page.url.pathname);
	let jsonLdTag = $derived(
		jsonLd
			? '<scr' +
					`ipt type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</scr` +
					'ipt>'
			: ''
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content={type} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:site_name" content={SITE.name} />
	{#if image}
		<meta property="og:image" content={image} />
	{/if}
	<meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	{#if image}
		<meta name="twitter:image" content={image} />
	{/if}
	{#if jsonLdTag}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html jsonLdTag}
	{/if}
</svelte:head>
