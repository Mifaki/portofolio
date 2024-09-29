import { IGeneralMockFetchResponse } from "@/models/generalinterfaces";
import { projects } from "@/models/projectdata";
import { IProject } from "@/models/projectinterfaces";

export function getProjectBySlug(slug: string): IGeneralMockFetchResponse<IProject | null> {

    const project = projects.find(x => x.slug === slug);

    if (project) {
        return {
            data: project,
            status: true,
            message: "Project found successfully"
        };
    } else {
        return {
            data: null,
            status: false,
            message: "Project not found"
        };
    }

}