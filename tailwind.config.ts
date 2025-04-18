import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ["class"],
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx,mdx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				'wellness-mist': '#E2E8F0', // Mist color
				'wellness-teal': '#167D7F', // Deep teal (primary)
				'wellness-green': '#88B28A', // Sage green for nature elements
				'wellness-amber': '#F9BC9F', // Warm peach (accent)
				'wellness-error': '#F87171', // Error color
				'wellness-white': '#F8FAFC', // White color
				'wellness-light-shadow': '#64748B', // Light shadow
				'wellness-night': '#334155', // Night color
				'wellness-deep-teal': '#0E6163', // Darker teal for hover states
				'wellness-shadow': '#64748B', // Shadow color
				'wellness-light-teal': '#4AACAE', // Lighter teal for accents
				'wellness-deep-lavender': '#7A70A1', // Darker lavender for hover states
				'wellness-light-lavender': '#BDB5D9', // Lighter lavender for accents
				'wellness-peach': '#F9BC9F', // Warm peach
				'wellness-deep-peach': '#F7A07A', // Darker peach for hover states
				'wellness-light-peach': '#FBDAC7', // Lighter peach for accents
				'wellness-sage': '#88B28A', // Sage green
				'neutral-white': '#F8FAFC', // Neutral white
				'neutral-mist': '#E2E8F0', // Neutral mist
				'neutral-shadow': '#64748B', // Neutral shadow
				'neutral-night': '#334155', // Neutral night
				'from-wellness-light-blue': '#B3E5FC', // Light blue gradient start
			},
			boxShadow: {
				'blue-glow': '0 0 15px rgba(74, 144, 226, 0.5)',
				'purple-glow': '0 0 15px rgba(139, 92, 246, 0.5)',
				'soft-glow': '0 0 20px rgba(255, 255, 255, 0.8)',
			},
			borderRadius: {
				sm: '0.5rem',      // Slightly more rounded
				md: '0.875rem',    // Medium roundness
				lg: '1.25rem',     // Large roundness
				xl: '1.75rem',     // Extra large roundness
				'2xl': '2rem',     // Very large roundness
				full: '9999px',    // Fully rounded (circles)
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
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
						boxShadow: '0 0 5px rgba(74, 144, 226, 0.5)',
					},
					'50%': {
						boxShadow: '0 0 20px rgba(74, 144, 226, 0.8)',
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
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'fade-out': 'fade-out 0.5s ease-out',
				'breathing': 'breathing 4s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'float': 'float 6s ease-in-out infinite',
				'shimmer': 'shimmer 2.5s infinite',
				'expand': 'expand 0.4s cubic-bezier(0.26, 0.54, 0.32, 1) forwards',
				'wave': 'wave 3s ease-in-out infinite'
			},
			fontFamily: {
				sans: ['Nunito', 'Quicksand', 'sans-serif'],
				accent: ['Quicksand', 'sans-serif'],
				handwritten: ['Caveat', 'cursive'],
				mono: ["monospace"],
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'gradient-primary': 'linear-gradient(135deg, #4A90E2 0%, #8B5CF6 100%)',
				'gradient-secondary': 'linear-gradient(135deg, #F8A97D 0%, #FFD166 100%)',
				'gradient-calm': 'linear-gradient(135deg, #4A90E2 0%, #A78BFA 100%)',
				'gradient-energy': 'linear-gradient(135deg, #F8A97D 0%, #FF8882 100%)',
				'gradient-growth': 'linear-gradient(135deg, #4AD295 0%, #A4E8C9 100%)',
				'leaf-pattern': "url('/patterns/leaf-pattern.svg')",
				'wave-pattern': "url('/patterns/wave-pattern.svg')",
				'circles-pattern': "url('/patterns/circles.svg')",
				'bubbles-pattern': "url('/patterns/bubbles.svg')"
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
