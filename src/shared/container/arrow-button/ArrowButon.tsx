'use client'

import {
    useRef,
    useEffect
} from 'react';
import { gsap } from 'gsap';
import ArrowIcon from "@/shared/container/icon/ArrowIcon";
import Link from 'next/link';

interface IArrowButton {
    href?: string;
    text?: string;
}

const ArrowButton = ({
    href,
    text = "Explore More"
}: IArrowButton) => {
    const underlineRef = useRef<HTMLSpanElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const underline = underlineRef.current;
        const container = containerRef.current;

        if (underline && container) {
            gsap.set(underline, { width: 0 });

            container.addEventListener('mouseenter', () => {
                gsap.to(underline, { width: '100%', duration: 0.3, ease: 'power2.out' });
            });

            container.addEventListener('mouseleave', () => {
                gsap.to(underline, { width: 0, duration: 0.3, ease: 'power2.in' });
            });
        }
    }, []);

    return (
        <Link
            href={href ?? '#'}
            passHref
        >
            <div ref={containerRef} className="inline-flex items-center gap-4 group cursor-pointer">
                <ArrowIcon />
                <div className="relative">
                    <span className="text-porto-text-secondary">{text}</span>
                    <span
                        ref={underlineRef}
                        className="absolute bottom-0 left-0 h-0.5 bg-porto-text-secondary"
                        style={{ width: 0 }}
                    />
                </div>
            </div>
        </Link>
    );
};

export default ArrowButton;