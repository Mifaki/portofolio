function AuthorIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            width="36"
            height="25"
            viewBox="0 0 36 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <circle
                cx="12.2474"
                cy="12.2474"
                r="10.1856"
                fill="white"
                stroke="white"
                strokeWidth="4.12371"
            />
            <rect
                x="31.5461"
                y="1.48454"
                width="2.96907"
                height="21.5258"
                fill="white"
                stroke="white"
                strokeWidth="2.96907"
            />
        </svg>
    );
}

export default AuthorIcon;
