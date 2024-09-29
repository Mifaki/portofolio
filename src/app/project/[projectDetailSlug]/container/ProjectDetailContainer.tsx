import ArrowButton from "@/shared/container/arrow-button/ArrowButon"
import Image from "next/image"

const ProjectDetailContainer = () => {
    return (
        <>
            <div className="bg-porto-primary col-span-8 row-span-6 rounded-3xl">
                <video autoPlay muted preload="none" className="w-full h-full object-cover rounded-3xl" loop playsInline>
                    <source src="https://utfs.io/f/a76Xht1N2JVkBZh2LWP7TxpLZqdN3CtAPr8Es9e6kRIcDK1Y" type="video/mp4" />
                    <span className="flex items-center justify-center">
                        Your browser does not support the video tag.
                    </span>
                </video>
            </div>
            <div className="flex flex-col justify-between bg-porto-primary col-span-4 row-span-6 rounded-3xl p-6" >
                <h1 className="font-libre text-[64px] leading-tight font-semibold italic">SIMABA <br />2023</h1>
                <div className="flex w-full justify-end">
                    <ArrowButton text="Web Development" />
                </div>
            </div>
            <div className="bg-porto-primary col-span-3 row-span-5 rounded-3xl p-6" >
                <h2 className="font-libre text-[48px] leading-tight font-semibold italic mb-4">About Project</h2>
                <desc className="text-justify">Lorem ipsum dolor sit amet consectetur. Sapien scelerisque semper enim consequat. Diam odio fringilla volutpat vitae urna turpis. Lorem ipsum dolor sit amet consectetur. Sapien scelerisque semper enim consequat. Diam odio fringilla volutpat vitae urna turpis. Lorem ipsum dolor sit amet  volutpat vitae urna turpis. </desc>
            </div>
            <div className="bg-porto-primary col-span-9 row-span-7 rounded-3xl relative" >
                <Image
                    src={'https://utfs.io/f/a76Xht1N2JVkMsRzQSdmXsMLZCBjpWho3ySt2uqHrFP54liD'}
                    alt="Simaba 1"
                    objectFit="cover"
                    fill
                    style={{ width: '100%', height: '100%' }}
                    className="rounded-3xl"
                />
            </div>
            <div className="bg-porto-primary col-span-3 row-span-7 rounded-3xl relative" >
                <Image
                    src={'https://utfs.io/f/a76Xht1N2JVkPdxfhsy6EpK8DvIiU4gXwBLaJGzol3Fsn2mV'}
                    alt="Simaba 2"
                    objectFit="cover"
                    fill
                    style={{ width: '100%', height: '100%' }}
                    className="rounded-3xl"
                />
            </div>
            <div className="bg-porto-primary col-span-4 row-span-5 rounded-3xl relative" >
                <Image
                    src={'https://utfs.io/f/a76Xht1N2JVkU3lJf1Hxt4NO1MwHpSg6VfhQqP5rAvLoeKcJ'}
                    alt="Simaba 3"
                    objectFit="cover"
                    fill
                    style={{ width: '100%', height: '100%' }}
                    className="rounded-3xl"
                />
            </div>
            <div className="bg-porto-primary col-span-5 row-span-5 rounded-3xl relative" >
                <Image
                    src={'https://utfs.io/f/a76Xht1N2JVkrXGZcwFisHdgKkSzUwLRY73E8B2CX69Wonvj'}
                    alt="Simaba 4"
                    objectFit="cover"
                    fill
                    style={{ width: '100%', height: '100%' }}
                    className="rounded-3xl"
                />
            </div>
            <div className="bg-porto-primary col-span-9 row-span-9 rounded-3xl relative" >
                <Image
                    src={'https://utfs.io/f/a76Xht1N2JVkbNpmnvXfVZa2gDkNLH6ORtKuUMTGvzSd4cyP'}
                    alt="Simaba 5"
                    objectFit="cover"
                    fill
                    style={{ width: '100%', height: '100%' }}
                    className="rounded-3xl"
                />
            </div>
            <div className="flex flex-col justify-between bg-porto-primary col-span-3 row-span-9 rounded-3xl p-6" >
                <h3 className="font-libre text-[64px] leading-tight font-semibold italic">Want to see other things?</h3>
                <div className="flex w-full justify-end">
                    <ArrowButton text="Nikahyook" href="/project/nikayook" />
                </div>
            </div>
        </>
    )
}

export default ProjectDetailContainer