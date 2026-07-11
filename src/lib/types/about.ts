export interface AboutDescription {
	id: string;
	content: string;
	position: number;
}

export interface AboutTechStack {
	id: string;
	name: string;
	category: { id: string; name: string };
	percentage: number;
	position: number;
}

export interface AboutImage {
	id: string;
	imageUrl: string;
	position: number;
}

export interface WorkExperience {
	id: string;
	company: string;
	role: string;
	description: string | null;
	location: string | null;
	startMonth: number;
	startYear: number;
	endMonth: number | null;
	endYear: number | null;
	position: number;
}

export interface About {
	id: string;
	name: string;
	instagram: string | null;
	github: string | null;
	linkedin: string | null;
	resumeUrl: string | null;
	createdAt: string;
	modifiedAt: string;
	descriptions: AboutDescription[];
	techStacks: AboutTechStack[];
	images: AboutImage[];
	workExperiences: WorkExperience[];
}
