export interface ToolImage {
	id: string;
	type: 'thumbnail' | 'normal';
	orientation: 'landscape' | 'portrait';
	imageUrl: string;
}

export interface ToolText {
	id: string;
	type: 'regular' | string;
	position: number;
	content: string;
}

export interface NextTool {
	id: string;
	title: string;
	thumbnailUrl: string | null;
}

export interface Tool {
	id: string;
	position: number;
	title: string;
	url: string | null;
	repoUrl: string | null;
	createdAt: string;
	modifiedAt: string;
	texts: ToolText[];
	images: ToolImage[];
	nextTool?: NextTool | null;
}
