function VueIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="24"
            height="21"
            viewBox="0 0 24 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M19.2 0H24L12 20.7L0 0H9.18L12 4.8L14.76 0H19.2Z"
                fill="#41B883"
            />
            <path
                d="M0 0L12 20.7L24 0H19.2L12 12.42L4.74 0H0Z"
                fill="#41B883"
            />
            <path
                d="M4.74023 0L12.0002 12.48L19.2002 0H14.7602L12.0002 4.8L9.18023 0H4.74023Z"
                fill="#35495E"
            />
        </svg>
    );
}

export default VueIcon;
