"use client"

import { useAnimatePageIn } from "@/shared/usecase/usePageTransition"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

export default function Template({ children }: { children: React.ReactNode }) {

  const pathname = usePathname()
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (!isFirstRender.current) {
      useAnimatePageIn()
    } else {
      isFirstRender.current = false
    }
  }, [pathname])

  return (
    <>
      <div
        id="banner-1"
        className="min-h-screen bg-porto-accent z-10 fixed top-0 left-0 w-screen lg:w-1/4"
      />
      <div
        id="banner-2"
        className="hidden lg:block min-h-screen bg-porto-accent z-10 fixed top-0 left-1/4 w-1/4"
      />
      <div
        id="banner-3"
        className="hidden lg:block min-h-screen bg-porto-accent z-10 fixed top-0 left-2/4 w-1/4"
      />
      <div
        id="banner-4"
        className="hidden lg:block min-h-screen bg-porto-accent z-10 fixed top-0 left-3/4 w-1/4"
      />
      {children}
    </>
  )
}