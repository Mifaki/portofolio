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

export type SoloLandscape = { type: 'solo-landscape'; img: ProjectImage; side: 'left' | 'right' };
export type SoloPortrait = { type: 'solo-portrait'; img: ProjectImage; side: 'left' | 'right' };
export type PortraitPair = { type: 'portrait-pair'; imgs: ProjectImage[] };
export type PortraitTriple = {
	type: 'portrait-triple';
	imgs: ProjectImage[];
	variant: 'wide-left' | 'wide-mid';
};
export type LandscapePortrait = {
	type: 'landscape-portrait';
	landscape: ProjectImage;
	portrait: ProjectImage;
};

export type ImageScene =
	| SoloLandscape
	| SoloPortrait
	| PortraitPair
	| PortraitTriple
	| LandscapePortrait;

export type TextBlock = { kind: 'text'; content: string; align: 'left' | 'right' };
export type SceneBlock = { kind: 'scene'; scene: ImageScene };
export type Block = SceneBlock | TextBlock;
