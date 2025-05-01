import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				'deep-ocean': {
					DEFAULT: '#1A365D',
					50: '#E9EDF3',
					100: '#D3DBE7',
					200: '#A7B7CF',
					300: '#7B93B7',
					400: '#4F6F9F',
					500: '#1A365D',
					600: '#152C4A',
					700: '#102138',
					800: '#0A1625',
					900: '#050B13',
					950: '#020509',
				},
				'sage': {
					DEFAULT: '#7C9A92',
					50: '#F2F5F4',
					100: '#E5EBE9',
					200: '#CBD7D3',
					300: '#B1C3BD',
					400: '#97AFA7',
					500: '#7C9A92',
					600: '#637B74',
					700: '#4A5C57',
					800: '#323E3A',
					900: '#191F1D',
					950: '#0D100F',
				},
				'terracotta': {
					DEFAULT: '#CF5C36',
					50: '#F9E6E0',
					100: '#F4CEC1',
					200: '#EB9E83',
					300: '#E26E45',
					400: '#D96536',
					500: '#CF5C36',
					600: '#A6492B',
					700: '#7D3721',
					800: '#532416',
					900: '#2A120B',
					950: '#150906',
				},
				'lavender': {
					DEFAULT: '#9A8FB8',
					50: '#F5F4F8',
					100: '#EBE9F1',
					200: '#D7D3E3',
					300: '#C3BDD5',
					400: '#AEA6C7',
					500: '#9A8FB8',
					600: '#7B6DA3',
					700: '#625587',
					800: '#493F65',
					900: '#312A43',
					950: '#231E32',
				},
				'gold': {
					DEFAULT: '#D4B483',
					50: '#FAF6F0',
					100: '#F5EDE1',
					200: '#EBDBC3',
					300: '#E0C9A5',
					400: '#DAC194',
					500: '#D4B483',
					600: '#C79A5A',
					700: '#B88237',
					800: '#8F652B',
					900: '#67491F',
					950: '#533A19',
				},
				wellness: {
					teal: "hsl(var(--wellness-teal))",
					sage: "hsl(var(--wellness-sage))",
					lavender: "hsl(var(--wellness-lavender))",
					blue: "hsl(var(--wellness-blue))",
					"soft-coral": "hsl(var(--wellness-soft-coral))",
					amber: "hsl(var(--wellness-amber))",
					purple: "hsl(var(--wellness-purple))",
					"pale-yellow": "hsl(var(--wellness-pale-yellow))",
				}
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-out': {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' }
				},
				'breathing': {
					'0%, 100%': {
						transform: 'scale(1)',
						opacity: '1',
					},
					'50%': {
						transform: 'scale(1.05)',
						opacity: '0.9',
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 5px rgba(26, 54, 93, 0.5)',
					},
					'50%': {
						boxShadow: '0 0 20px rgba(26, 54, 93, 0.8)',
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'expand': {
					'0%': { transform: 'scale(0.8)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'wave': {
					'0%, 100%': { transform: 'translateX(0) translateY(0)' },
					'25%': { transform: 'translateX(-5px) translateY(5px)' },
					'50%': { transform: 'translateX(0) translateY(10px)' },
					'75%': { transform: 'translateX(5px) translateY(5px)' }
				},
				'bounce-gentle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.8' }
				}
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				'fade-in': 'fade-in 0.5s ease-out',
				'fade-out': 'fade-out 0.5s ease-out',
				'breathing': 'breathing 4s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'shimmer': 'shimmer 2.5s infinite',
				'expand': 'expand 0.4s cubic-bezier(0.26, 0.54, 0.32, 1) forwards',
				'wave': 'wave 3s ease-in-out infinite',
				'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
				'pulse-slow': 'pulse-slow 3s ease-in-out infinite'
			},
			fontFamily: {
				body: ['Inter', 'system-ui', 'sans-serif'],
				heading: ['Playfair Display', 'serif'],
				accent: ['Cormorant Garamond', 'serif'],
				sans: ['Inter', 'system-ui', 'sans-serif'],
				serif: ['Playfair Display', 'serif'],
				mono: ['JetBrains Mono', 'monospace'],
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'gradient-primary': 'linear-gradient(135deg, #1A365D 0%, #7C9A92 100%)',
				'gradient-secondary': 'linear-gradient(135deg, #CF5C36 0%, #D4B483 100%)',
				'gradient-accent': 'linear-gradient(135deg, #9A8FB8 0%, #D4B483 100%)',
				'gradient-calm': 'linear-gradient(135deg, #1A365D 0%, #9A8FB8 100%)',
				'gradient-warm': 'linear-gradient(135deg, #CF5C36 0%, #D4B483 100%)',
				'gradient-natural': 'linear-gradient(135deg, #7C9A92 0%, #D4B483 100%)',
				'pattern-dots': 'radial-gradient(circle, currentColor 1px, transparent 1px)',
				'pattern-lines': 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
				'pattern-waves': "url('/patterns/waves.svg')",
				'pattern-leaves': "url('/patterns/leaves.svg')",
				'pattern-mountains': "url('/patterns/mountains.svg')",
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;