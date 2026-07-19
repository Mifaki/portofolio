import type { About } from '$lib/types/about';
import type { Project } from '$lib/types/project';
import type { Tool } from '$lib/types/tool';

export const SITE = {
	name: 'Ahmad Faiz Agustianto',
	role: 'Software Engineer',
	description:
		'Portfolio of Ahmad Faiz Agustianto, a software engineer building web products with SvelteKit, Vue, and TypeScript.'
};

export function descriptionFromTexts(texts: { content: string }[], fallback = SITE.description) {
	const content = texts
		.map((t) => t.content)
		.join(' ')
		.replace(/<[^>]+>/g, '')
		.replace(/\s+/g, ' ')
		.trim();
	if (!content) return fallback;
	return content.length > 160 ? `${content.slice(0, 157).trimEnd()}...` : content;
}

export function personJsonLd(origin: string, about?: About) {
	const sameAs = about ? [about.github, about.linkedin, about.instagram].filter(Boolean) : [];
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: about?.name ?? SITE.name,
		jobTitle: SITE.role,
		url: origin,
		...(sameAs.length ? { sameAs } : {})
	};
}

export function projectJsonLd(project: Project, url: string) {
	const thumbnail = project.images.find((img) => img.type === 'thumbnail');
	return {
		'@context': 'https://schema.org',
		'@type': 'CreativeWork',
		name: project.title,
		url,
		genre: project.category,
		dateCreated: project.year,
		author: { '@type': 'Person', name: SITE.name },
		...(thumbnail ? { image: thumbnail.imageUrl } : {})
	};
}

export function toolJsonLd(tool: Tool, url: string) {
	return {
		'@context': 'https://schema.org',
		'@type': 'SoftwareSourceCode',
		name: tool.title,
		url: tool.url ?? url,
		author: { '@type': 'Person', name: SITE.name },
		...(tool.repoUrl ? { codeRepository: tool.repoUrl } : {})
	};
}
