import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/shared/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			'porto-primary': '#F3F1EB',
  			'porto-accent': '#F3F3F0',
  			'porto-text': '#393D4E',
  			'porto-text-secondary': '#677487',
  			background: 'var(--background)',
  			foreground: 'var(--foreground)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		gridTemplateRows: {
			'24': 'repeat(24, minmax(0, 1fr))',
		},
		  fontFamily: {
			'libre': ['libre-caslon-text']
		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
