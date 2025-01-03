import AngularIcon from "@/shared/container/icon/AngularIcon";
import ArrowButton from "@/shared/container/arrow-button/ArrowButon";
import AuthorImage from '../author-image/AuthorImage';
import AuthorIMG from '@/assets/author_picture.png';
import ContactButton from '../contact-button/ContactButton';
import GithubIcon from "@/shared/container/icon/GithubIcon";
import GmailIcon from "@/shared/container/icon/GmailIcon";
import Image from "next/image";
import KambudHome from '@/assets/kambud_home.png'
import LinkedinIcon from "@/shared/container/icon/Linkedin";
import NextJSIcon from "@/shared/container/icon/NextJSIcon";
import NikahyookHome from '@/assets/nikahyook_home.png'
import OutlineCircle from '@/assets/background-outline-circle.png'
import ProjectCard from '../project-card/ProjectCard';
import ReactIcon from "@/shared/container/icon/ReactIcon";
import SIMABAHome from '@/assets/simaba_home.png'
import TechCard from '../tech-card/TechCard';
import VueIcon from "@/shared/container/icon/VueIcon";
import TEDHome from "@/assets/ted_home_mobile.png"
import MIIHome from "@/assets/mii_home.png"
import HarverseHome from "@/assets/harverse_home.png"

const HomeMobile = () => {
    return (
        <>
            <AuthorImage image={AuthorIMG} />
            <div className="flex flex-col justify-between bg-porto-primary col-span-12 row-span-2 rounded-3xl p-6">
                <div>
                    <h1 className="font-libre italic text-[42px] leading-[120%] font-semibold mb-2 xl:mb-4">Ahmad Faiz <br /> Agustianto</h1>
                    <desc className="text-[14px]">
                        Information Technology student and frontend developer with expertise in modern JavaScript frameworks. Experienced in leading development teams and delivering <strong>high-impact web applications</strong> across multiple successful projects.
                    </desc>
                </div>
                <div className="flex w-full justify-end">
                    <ArrowButton text="Fron-End Developer" />
                </div>
            </div>
            <div className="bg-porto-primary col-span-12 row-span-2 rounded-3xl p-6 relative overflow-hidden" >
                <p className="mb-2 relative">Here&apos;s the list of technology i&apos;ve used for entire my <strong>2 Year</strong> career as frontend developer</p>
                <Image
                    src={OutlineCircle}
                    alt="Outline Circle"
                    className="absolute bottom-0 right-0 rounded-br-3xl z-0"
                    style={{ width: '60%', height: '60%' }}
                />
                <div className="w-[90%] xl:h-[80%] grid grid-cols-4 grid-rows-4 gap-4 relative">
                    <TechCard
                        icon={<NextJSIcon />}
                        name="Next.Js"
                        percentage={60}
                    />
                    <TechCard
                        icon={<ReactIcon />}
                        name="React.Js"
                        percentage={20}
                    />
                    <TechCard
                        icon={<VueIcon />}
                        name="Vue.Js"
                        percentage={15}
                    />
                    <TechCard
                        icon={<AngularIcon />}
                        name="Angular.Js"
                        percentage={5}
                    />
                </div>
            </div>
            <ProjectCard
                name="TEDxUB 2025"
                redirectUrl="/project/ted-x-ub-2025"
                image={TEDHome}
                className="col-span-12 row-span-2"
                imageHeight={80}
            />
            <ProjectCard
                name="MII"
                redirectUrl="/project/mii"
                image={MIIHome}
                className="col-span-12 row-span-2"
                imageHeight={80}
            />
            <ProjectCard
                name="Nikahyook"
                redirectUrl="/project/nikahyook"
                image={NikahyookHome}
                className="col-span-12 row-span-2"
                imageHeight={80}
            />
            <ProjectCard
                name="Harverse"
                redirectUrl="/project/harverse"
                image={HarverseHome}
                className="col-span-12 row-span-2"
                imageHeight={80}
            />
            <ProjectCard
                name="SIMABA 2023"
                redirectUrl="/project/simaba"
                image={SIMABAHome}
                className="col-span-12 row-span-2"
                imageHeight={80}
            />
            <ProjectCard
                name="Kampung Budaya"
                redirectUrl="/project/kampung-budaya"
                image={KambudHome}
                className="col-span-12 row-span-2"
                imageHeight={80}
            />
            <div className="flex flex-col justify-between bg-porto-primary col-span-12 row-span-2 rounded-3xl p-6" >
                <div>
                    <h2 className="font-libre italic text-4xl leading-[100%] font-semibold mb-3">Interested?</h2>
                    <p>You already know that what you do is game changing, but I can help others to understand that</p>
                </div>
                <div className="w-full flex items-center justify-end gap-4">
                    <ContactButton redirectUrl="https://github.com/Mifaki">
                        <GithubIcon />
                    </ContactButton>
                    <ContactButton redirectUrl="mailto:agustianto.d19@gmail.com">
                        <GmailIcon />
                    </ContactButton>
                    <ContactButton redirectUrl="https://www.linkedin.com/in/ahmad-faiz-agustianto/">
                        <LinkedinIcon />
                    </ContactButton>
                </div>
            </div>
        </>
    )
}

export default HomeMobile