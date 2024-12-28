import {
    IProcessedImage,
    IProject
} from "@/models/projectinterfaces"
import { useSortImage } from "../../usecase/useSortImage"
import ArrowButton from "@/shared/container/arrow-button/ArrowButon"
import FilledCircle from '@/assets/background-filled-circle.png'
import Image from "next/image"

const ProjectMobile = ({ project }: { project: IProject }) => {

    const {
        mainImage,
        additionalImages,
        hasVideo
    } = useSortImage(project);

    const renderImage = (image: IProcessedImage) => (
        <div className={`bg-porto-primary rounded-3xl relative ${image.className}`}>
            <Image
                src={image.imageUrl}
                alt={image.alt}
                objectFit="cover"
                fill
                style={{ width: '100%', height: '100%' }}
                className="rounded-3xl"
            />
        </div>
    );

    return (
        <>
            <div className="flex flex-col justify-between bg-porto-primary col-span-12 row-span-3 rounded-3xl p-6 relative">
                <div className="space-y-3">
                    <h1 className="font-libre text-[42px] leading-tight font-semibold italic">{project.title}</h1>
                    <desc className="text-justify">{project.desc}</desc>
                </div>
                <div className="flex w-full justify-end">
                    <ArrowButton text="Web Development" />
                </div>
            </div>
            <div className="bg-porto-primary col-span-12 row-span-3 rounded-3xl relative">
                {hasVideo ? (
                    <video autoPlay muted preload="none" className="w-full h-full object-cover rounded-3xl" loop playsInline>
                        <source src={project.videoUrl} type="video/mp4" />
                        <span className="flex items-center justify-center">
                            Your browser does not support the video tag.
                        </span>
                    </video>
                ) : mainImage && (
                    <Image
                        src={mainImage.imageUrl}
                        alt={mainImage.alt}
                        objectFit="cover"
                        fill
                        style={{ width: '100%', height: '100%' }}
                        className="rounded-3xl"
                    />
                )}
            </div>
            <div className="bg-porto-primary col-span-12 row-span-3 rounded-3xl p-6">
                <h2 className="font-libre text-[38px] leading-tight font-semibold italic mb-4">Tech Stack</h2>
                <div className="grid grid-cols-3 gap-2">
                    {project.techStack.map((dx, idx) => (
                        <div
                            key={idx * 101}
                            className="w-full flex flex-col items-center gap-1 text-center"
                        >
                            <div className="p-3 bg-white bg-opacity-70 rounded-xl">
                                <Image
                                    src={dx.imageUrl}
                                    alt={dx.name}
                                    width={32}
                                    height={32}
                                />
                            </div>
                            <p className="font-libre text-xs">{dx.name}</p>
                        </div>
                    ))}
                </div>
            </div>
            {additionalImages.map((image: IProcessedImage) => renderImage(image))}
            <div className="flex flex-col justify-between bg-porto-primary col-span-12 row-span-3 rounded-3xl p-6 relative">
                <h3 className="font-libre text-[48px] leading-tight font-semibold italic">Want to see other things?</h3>
                <div className="flex w-full justify-end">
                    <ArrowButton text={project.nextProject.title} href={project.nextProject.redirectUrl} />
                </div>
                <Image
                    src={FilledCircle}
                    alt="Background Circle"
                    style={{ width: '50%', height: '60%' }}
                    className="absolute bottom-0 left-0"
                />
            </div>
        </>
    )
}

export default ProjectMobile