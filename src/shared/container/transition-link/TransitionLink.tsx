"use client"

import { useAnimatePageOut } from "@/shared/usecase/usePageTransition"
import { usePathname, useRouter } from "next/navigation"
import React from "react"

interface ITransitionLink extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string
    children: React.ReactNode
}

const TransitionLink = ({
    href,
    children,
    ...props
}: ITransitionLink) => {
    const router = useRouter()
    const pathname = usePathname()

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (href === "#") {
            e.preventDefault()
            return
        }

        if (pathname !== href) {
            e.preventDefault()
            useAnimatePageOut(href, router)
        }
    }


    return (
        <a
            onClick={handleClick}
            href={href}
            {...props}
        >
            {children}
        </a>
    )
}

export default TransitionLink
