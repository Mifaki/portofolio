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
            ease: "power2.out",
            roundProps: "innerHTML"
        });
    }, [percentage]);

    return (
        <div className='flex flex-col justify-between bg-porto-accent py-2 px-3 col-span-2 row-span-1'>
            <div className='flex items-center gap-2'>
                {icon}
                <p>{name}</p>
            </div> 
            <p className='font-libre text-3xl font-semibold text-right'>
                <span ref={percentageRef}>0</span>%
            </p>
        </div>
    );
};

export default TechCard;