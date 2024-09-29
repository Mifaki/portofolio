export interface IProject {
    title: string;
    slug: string;
    desc: string;
    videoUrl?: string;
    images: IProjectImage[];
    nextProject: INextProject
}

export interface IProjectImage {
    position: number;
    imageUrl: string;
    alt: string;
}

export interface INextProject {
    title: string;
    redirectUrl: string;
}

export interface IProcessedImage extends IProjectImage {
    className: string;
}