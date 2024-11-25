import React, { forwardRef } from 'react';

const ArrowIcon = forwardRef<SVGSVGElement, React.SVGProps<SVGSVGElement>>((props, ref) => {
    return (
        <svg
            width="14"
            height="13"
            viewBox="0 0 14 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            ref={ref}
            {...props}
        >
            <path
                d="M13.9961 1.94486C14.0442 1.39467 13.6372 0.909641 13.087 0.861507L4.12128 0.0771051C3.5711 0.0289703 3.08606 0.435961 3.03793 0.986144C2.98979 1.53633 3.39678 2.02136 3.94697 2.06949L11.9165 2.76674L11.2193 10.7363C11.1711 11.2865 11.5781 11.7715 12.1283 11.8196C12.6785 11.8678 13.1635 11.4608 13.2117 10.9106L13.9961 1.94486ZM1.38595 12.9083L13.6427 2.62375L12.3571 1.09166L0.100376 11.3763L1.38595 12.9083Z"
                fill="#677487"
            />
        </svg>
    );
});

ArrowIcon.displayName = 'ArrowIcon';

export default ArrowIcon;