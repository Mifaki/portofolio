import React from 'react';
import Image, { StaticImageData } from "next/image";
import ArrowButton from "@/shared/container/arrow-button/ArrowButon";

interface IProjectCard extends React.HTMLAttributes<HTMLDivElement> {
    name: string;
    redirectUrl: string;
    image: StaticImageData;
    imageHeight: 85 | 100; 
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
            className={`bg-porto-primary rounded-3xl p-6 relative space-y-2 ${containerProps.className}`}
        >
            <h2 className="font-libre italic text-4xl leading-[100%] font-semibold mb-2">
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
                className="absolute bottom-0 right-0 object-cover rounded-br-3xl"
                style={{ width: '60%', height: `${imageHeight}%` }}
            />
        </div>
    );
};

export default ProjectCard;