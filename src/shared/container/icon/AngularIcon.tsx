function AngularIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            {...props}
        >
            <path
                fill="#dd0031"
                d="M16 2L2.966 6.648l1.988 17.234L16 30l11.046-6.118l1.988-17.234z" />
            <path
                fill="#c3002f"
                d="M16 2v3.108v-.014V30l11.046-6.118l1.988-17.234z" />
            <path
                fill="#fff"
                d="m16 5.094l-8.148 18.27h3.038l1.638-4.088h6.916l1.638 4.088h3.038zm2.38 11.662h-4.76L16 11.03Z" />
        </svg>
    );
}

export default AngularIcon;