import AuthorIMG from '@/assets/author_picture.png';
import GithubIcon from "@/shared/container/icon/GithubIcon";
import GmailIcon from "@/shared/container/icon/GmailIcon";
import Image from "next/image";
import KambudHome from '@/assets/kambud_home.png'
import LinkedinIcon from "@/shared/container/icon/Linkedin";
import NextJSIcon from "@/shared/container/icon/NextJSIcon";
import NikahyookHome from '@/assets/nikahyook_home.png'
import OutlineCircle from '@/assets/background-outline-circle.png'
import SIMABAHome from '@/assets/simaba_home.png'
import ArrowButton from "@/shared/container/arrow-button/ArrowButon";
import TechCard from '../tech-card/TechCard';
import ContactButton from '../contact-button/ContactButton';
import AuthorImage from '../author-image/AuthorImage';
import ProjectCard from '../project-card/ProjectCard';

type Props = {}

const HomeDesktop = (props: Props) => {
    return (
        <>
            <div className="bg-porto-primary col-span-5 row-span-5 rounded-3xl p-6 relative overflow-hidden" >
                <p className="mb-2 relative">Here&apos;s the list of technology i&apos;ve used for entire my 1 Year career as frontend developer</p>
                <Image
                    src={OutlineCircle}
                    alt="Outline Circle"
                    className="absolute bottom-0 right-0 rounded-br-3xl z-0"
                    style={{ width: '40%', height: '60%' }}
                />
                <div className="w-[80%] xl:h-[80%] grid grid-cols-4 grid-rows-4 gap-4 relative">
                    <TechCard
                        icon={<NextJSIcon />}
                        name="Next.Js"
                        percentage={60}
                    />
                    <TechCard
                        icon={<NextJSIcon />}
                        name="Next.Js"
                        percentage={20}
                    />
                    <TechCard
                        icon={<NextJSIcon />}
                        name="Next.Js"
                        percentage={15}
                    />
                    <TechCard
                        icon={<NextJSIcon />}
                        name="Next.Js"
                        percentage={5}
                    />
                </div>
            </div>
            <div className="flex flex-col justify-between bg-porto-primary col-span-3 row-span-5 rounded-3xl p-6" >
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
            <AuthorImage image={AuthorIMG} />
            <ProjectCard
                name="TEDxUb 2025"
                redirectUrl="/project/nikahyook"
                image={NikahyookHome}
                className="col-span-8 row-span-3"
                imageHeight={100}
            />
            <div className="flex flex-col justify-between bg-porto-primary col-span-4 row-span-5 rounded-3xl p-6">
                <div>
                    <h1 className="font-libre italic text-[48px] leading-[120%] font-semibold mb-2 xl:mb-4">Ahmad Faiz <br /> Agustianto</h1>
                    <desc>
                        Lorem ipsum dolor sit amet consectetur. Sapien scelerisque semper enim consequat. Nec suspendisse <strong>porttitor massa accumsan</strong> sed dictum velit tortor.
                    </desc>
                </div>
                <div className="flex w-full justify-end">
                    <ArrowButton text="Fron-End Developer" />
                </div>
            </div>
            <ProjectCard
                name="MII"
                redirectUrl="/project/simaba"
                image={SIMABAHome}
                className="col-span-4 row-span-4"
                imageHeight={80}
            />
            <ProjectCard
                name="Nikahyook"
                redirectUrl="/project/kampung-budaya"
                image={KambudHome}
                className="col-span-4 row-span-4"
                imageHeight={80}
            />
            <ProjectCard
                name="Harverse"
                redirectUrl="/project/simaba"
                image={SIMABAHome}
                className="col-span-4 row-span-4"
                imageHeight={80}
            />
            <ProjectCard
                name="SIMABA 2023"
                redirectUrl="/project/simaba"
                image={SIMABAHome}
                className="col-span-4 row-span-4"
                imageHeight={80}
            />
            <ProjectCard
                name="Kampung Budaya"
                redirectUrl="/project/kampung-budaya"
                image={KambudHome}
                className="col-span-4 row-span-4"
                imageHeight={80}
            />
        </>
    )
}

export default HomeDesktop