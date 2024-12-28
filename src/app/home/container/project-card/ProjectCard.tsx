import React from 'react';
import Image, { StaticImageData } from "next/image";
import ArrowButton from "@/shared/container/arrow-button/ArrowButon";

interface IProjectCard extends React.HTMLAttributes<HTMLDivElement> {
    name: string;
    redirectUrl: string;
    image: StaticImageData;
    imageHeight: 80 | 100;
}

const ProjectCard = ({
    name,
    redirectUrl,
    image,
    imageHeight,
    ...containerProps
}: IProjectCard) => {
    return (
        <div
            className={`bg-porto-primary rounded-3xl p-6 relative space-y-2 ${containerProps.className} overflow-hidden`}
        >
            <h2 className="font-libre italic text-3xl lg:text-4xl lg:leading-[100%] font-semibold mb-2">
                {name.split(' ').map((word, index) => (
                    <React.Fragment key={index}>
                        {word}
                        {index !== name.split(' ').length - 1 && <br />}
                    </React.Fragment>
                ))}
            </h2>
            <ArrowButton href={redirectUrl} />
            <Image
                src={image}
                alt={name}
                className="hidden lg:block absolute bottom-0 right-0 object-cover rounded-br-3xl"
                style={{ width: '74%', height: `${imageHeight}%` }}
                draggable={false}
            />
            <Image
                src={image}
                alt={name}
                className="block lg:hidden absolute -bottom-4 right-0 object-cover rounded-br-3xl"
                style={{ width: '100%', height: `79%` }}
                draggable={false}
            />
        </div>
    );
};

export default ProjectCard;