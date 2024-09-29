import ProjectDetailContainer from "./container/ProjectDetailContainer";
import { useGetProjectBySlug } from "./usecase/useGetProjectBySlug";

export default async function ProjectDetail({ params }: { params: { projectDetailSlug: string } }) {

    const slug = params.projectDetailSlug.replace("/projec/", "")

    const response = await useGetProjectBySlug(slug);

    if (!response.status || response.data === null) {
        // TODO: Make Not Found Component
        throw Error(response.message as string);
    }

    return (
        <ProjectDetailContainer project={response.data} />
    )
}