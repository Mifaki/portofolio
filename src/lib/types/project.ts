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

export interface Project {
	id: string;
	position: number;
	title: string;
	category: string;
	type: string;
	year: string;
	createdAt: string;
	modifiedAt: string;
	texts: ProjectText[];
	images: ProjectImage[];
}
