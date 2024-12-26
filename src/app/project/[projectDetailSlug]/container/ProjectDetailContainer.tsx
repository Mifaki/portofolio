'use client'

import { IProject } from "@/models/projectinterfaces"
import MediaQuerySwitcher from "@/shared/container/media-query-switcher/MediaQuerySwitcher"
import ProjectDesktop from "./screens/desktop"
import ProjectMobile from "./screens/mobile"

const ProjectDetailContainer = ({ project }: { project: IProject }) => {

    return (
        <MediaQuerySwitcher
            screenWidth={1024}
            mobile={<ProjectMobile project={project} />}
            desktop={<ProjectDesktop project={project} />}
        />
    )
}

export default ProjectDetailContainer