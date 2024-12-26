'use client'

import HomeMobile from "./screens/mobile";
import HomeDesktop from "./screens/desktop";
import MediaQuerySwitcher from "@/shared/container/media-query-switcher/MediaQuerySwitcher";

export default function HomeContainer() {

    return (
        <MediaQuerySwitcher
            screenWidth={1024}
            mobile={<HomeMobile />}
            desktop={<HomeDesktop />}
        />
    )
} 