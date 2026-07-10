export interface ProjectImage {
	id: string;
	type: 'thumbnail' | 'normal';
	orientation: 'landscape' | 'portrait';
	imageUrl: string;
}

export interface ProjectText {
	id: string;
	type: 'regular' | string;
	content: string;
}

export interface NextProject {
	id: string;
	title: string;
	thumbnailUrl: string | null;
	visibility?: 'public' | 'private';
	blur?: boolean;
}

export interface Project {
	id: string;
	position: number;
	title: string;
	category: string;
	type: string;
	visibility: 'public' | 'private';
	blur: boolean;
	year: string;
	createdAt: string;
	modifiedAt: string;
	texts: ProjectText[];
	images: ProjectImage[];
	nextProject?: NextProject | null;
}
