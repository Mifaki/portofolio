'use client'

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ITechCard {
    name: string;
    icon: React.ReactNode;
    percentage: number;
}

const TechCard = ({
    icon,
    name,
    percentage
}: ITechCard) => {
    const percentageRef = useRef(null);
    const tl = useRef(gsap.timeline());

    useEffect(() => {
        tl.current.to(percentageRef.current, {
            innerHTML: percentage,
            duration: 6,
            ease: "power2.in",
            roundProps: "innerHTML"
        });
    }, [percentage]);

    return (
        <div className='flex flex-col justify-between bg-porto-accent py-3 px-4 col-span-2 row-span-2'>
            <div className='flex items-center gap-2'>
                {icon}
                <p className='text-[14px] md:text-base'>{name}</p>
            </div> 
            <p className='mt-2 lg:mt-0 font-libre text-2xl lg:text-4xl font-semibold text-right'>
                <span ref={percentageRef}>0</span>%
            </p>
        </div>
    );
};

export default TechCard;