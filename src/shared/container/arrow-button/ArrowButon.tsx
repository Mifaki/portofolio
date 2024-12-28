'use client'

import React, {
    useRef,
    useEffect,
} from 'react';
import { gsap } from 'gsap';
import ArrowIcon from "@/shared/container/icon/ArrowIcon";
import Link from 'next/link';
import TransitionLink from '../transition-link/TransitionLink';

interface IArrowButton {
    href?: string;
    text?: string;
    openInNewTab?: boolean;
}

const ArrowButton: React.FC<IArrowButton> = ({
    href,
    text = "Explore More",
    openInNewTab = false
}) => {

    const underlineRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const arrowRef = useRef<SVGSVGElement>(null);

    useEffect(() => {

        const underline = underlineRef.current;
        const container = containerRef.current;
        const arrow = arrowRef.current;

        if (!underline || !container || !arrow) {
            throw Error('One or more refs are null, aborting effect');
        }

        gsap.set(underline, { width: 0 });
        gsap.set(arrow, { x: 0 });

        const handleMouseEnter = () => {
            gsap.to(underline, { width: '100%', duration: 0.3, ease: 'power2.out' });
            gsap.to(arrow, { x: 5, duration: 0.3, ease: 'power2.out' });
        };

        const handleMouseLeave = () => {
            gsap.to(underline, { width: 0, duration: 0.3, ease: 'power2.in' });
            gsap.to(arrow, { x: 0, duration: 0.3, ease: 'power2.in' });
        };

        const handleTouchStart = () => {
            gsap.to(underline, { width: '100%', duration: 0.3, ease: 'power2.out' });
            gsap.to(arrow, { x: 5, duration: 0.3, ease: 'power2.out' });
        };

        const handleTouchEnd = () => {
            gsap.to(underline, { width: 0, duration: 0.3, ease: 'power2.in' });
            gsap.to(arrow, { x: 0, duration: 0.3, ease: 'power2.in' });
        };

        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);
        container.addEventListener('touchstart', handleTouchStart);
        container.addEventListener('touchend', handleTouchEnd);
    

        return () => {
            container.removeEventListener('mouseenter', handleMouseEnter);
            container.removeEventListener('mouseleave', handleMouseLeave);
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    return (
        <TransitionLink
            href={href ?? '#'}
            openInNewTab={openInNewTab}
        >
            <div 
                ref={containerRef} 
                className="inline-flex items-center gap-4 group cursor-pointer"
            >
                <div className="relative">
                    <ArrowIcon ref={arrowRef} />
                </div>
                <div className="relative">
                    <span className="text-porto-text-secondary">{text}</span>
                    <span
                        ref={underlineRef}
                        className="absolute bottom-0 left-0 h-0.5 bg-porto-text-secondary"
                        style={{ width: 0 }}
                    />
                </div>
            </div>
        </TransitionLink>
    );
};

export default ArrowButton;