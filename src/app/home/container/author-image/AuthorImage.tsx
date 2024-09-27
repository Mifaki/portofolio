import AuthorIcon from "@/shared/container/icon/AuthorIcon";
import Image, { type StaticImageData } from "next/image";

interface IAuthorImage {
    image: StaticImageData;
}

const AuthorImage = ({ image }: IAuthorImage) => (
    <div className="col-span-4 row-span-7 overflow-hidden relative">
        <Image
            src={image}
            alt="Author"
            className="w-full h-full object-cover rounded-3xl brightness-[0.7]"
        />
        <AuthorIcon className="absolute top-8 right-8" />
    </div>
);

export default AuthorImage