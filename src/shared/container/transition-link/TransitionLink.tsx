"use client"

import { useAnimatePageOut } from "@/shared/usecase/usePageTransition"
import { usePathname, useRouter } from "next/navigation"
import React from "react"

interface ITransitionLink extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string
    children: React.ReactNode
    openInNewTab?: boolean
}

const TransitionLink = ({
    href,
    children,
    openInNewTab = false,
    ...props
}: ITransitionLink) => {
    const router = useRouter()
    const pathname = usePathname()

    const isExternalLink = href.startsWith('http') || href.startsWith('mailto:')

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (href === "#") {
            e.preventDefault()
            return
        }

        if (isExternalLink || openInNewTab) {
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
            target={openInNewTab || isExternalLink ? "_blank" : undefined}
            rel={openInNewTab || isExternalLink ? "noopener noreferrer" : undefined}
            {...props}
        >
            {children}
        </a>
    )
}

export default TransitionLink