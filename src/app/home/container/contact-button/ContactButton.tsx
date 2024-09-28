interface IContactButton {
    children: React.ReactNode;
    redirectUrl: string;
}

const ContactButton = ({
    children,
    redirectUrl
}: IContactButton) => {
    return (
        <a
            target="_blank"
            href={redirectUrl}
            className="flex items-center justify-center bg-white p-2 rounded-full size-12"
        >
            {children}
        </a>
    )
}

export default ContactButton