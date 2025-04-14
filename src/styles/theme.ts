// Nature Bloom Theme
export const theme = {
  colors: {
    // Primary Colors - Nature-inspired palette
    primary: {
      sage: '#7C9A92',       // Soft sage green - primary brand color
      moss: '#5F7A6B',       // Deeper moss green for contrast
      leaf: '#A4C3A2',       // Light leaf green for highlights
      bark: '#8D7667',       // Warm brown bark color
      stone: '#9EAEB3',      // Cool stone gray
    },
    // Secondary Colors - Seasonal accents
    secondary: {
      blossom: '#F4C0C0',    // Spring cherry blossom pink
      sunlight: '#F9D56E',   // Summer sunlight yellow
      amber: '#E8985E',      // Autumn amber orange
      frost: '#D1E5F0',      // Winter frost blue
    },
    // Neutral Colors
    neutral: {
      cloud: '#F8FAFC',      // Light cloud white
      mist: '#E2E8F0',       // Soft mist gray
      shadow: '#64748B',     // Medium shadow gray
      night: '#334155',      // Deep night blue-gray
    },
    // Functional Colors
    functional: {
      growth: '#4AD295',     // Growth/success green
      energy: '#F9B44A',     // Energy/warning amber
      calm: '#8B5CF6',       // Calm/focus purple
      passion: '#F87171',    // Passion/error red
    },
    // Mood Colors - For mood tracking
    mood: {
      joy: '#FFD166',        // Joy - bright yellow
      calm: '#118AB2',       // Calm - serene blue
      content: '#06D6A0',    // Content - teal green
      sad: '#7678ED',        // Sad - soft purple
      anxious: '#EF476F',    // Anxious - rose pink
      tired: '#9D8189',      // Tired - muted mauve
    },
    // Seasonal Theme Variations
    seasonal: {
      spring: {
        primary: '#7EB77F',  // Fresh spring green
        accent: '#F4B3C2',   // Cherry blossom pink
        background: '#F9FBF2' // Light spring background
      },
      summer: {
        primary: '#5AAA95',  // Vibrant summer teal
        accent: '#F9D56E',   // Bright summer yellow
        background: '#F5FBFF' // Clear summer sky background
      },
      autumn: {
        primary: '#D08C60',  // Warm autumn orange
        accent: '#8F3B1B',   // Deep autumn red
        background: '#FFFAF0' // Warm autumn background
      },
      winter: {
        primary: '#7D98A1',  // Cool winter blue-gray
        accent: '#A9C0D9',   // Winter sky blue
        background: '#F7FAFC' // Crisp winter background
      }
    }
  },
  typography: {
    fontFamily: {
      primary: 'Poppins, sans-serif',     // Clean, modern font for body text
      accent: 'Montserrat, sans-serif',   // Elegant font for headings
      handwritten: 'Caveat, cursive',     // Handwritten style for journal entries
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
    glow: '0 0 15px rgba(124, 154, 146, 0.4)',
  },
  transitions: {
    default: '300ms ease-in-out',
    slow: '400ms ease-in-out',
    bounce: '300ms cubic-bezier(0.68, -0.55, 0.27, 1.55)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #7C9A92 0%, #A4C3A2 100%)',
    secondary: 'linear-gradient(135deg, #F4C0C0 0%, #F9D56E 100%)',
    calm: 'linear-gradient(135deg, #118AB2 0%, #8B5CF6 100%)',
    sunset: 'linear-gradient(135deg, #E8985E 0%, #F87171 100%)',
    dawn: 'linear-gradient(135deg, #F9D56E 0%, #F4C0C0 100%)',
    forest: 'linear-gradient(135deg, #5F7A6B 0%, #7EB77F 100%)',
  },
  animations: {
    breathe: 'breathe 4s ease-in-out infinite',
    float: 'float 6s ease-in-out infinite',
    pulse: 'pulse 2s ease-in-out infinite',
    fadeIn: 'fadeIn 0.5s ease-out',
    slideUp: 'slideUp 0.5s ease-out',
  },
  patterns: {
    dots: "url('/patterns/dots.svg')",
    leaves: "url('/patterns/leaves.svg')",
    waves: "url('/patterns/waves.svg')",
    mountains: "url('/patterns/mountains.svg')",
  },
  // Nature-inspired component styles
  components: {
    card: {
      default: 'bg-white rounded-lg shadow-sm border border-neutral-mist/30 overflow-hidden transition-all duration-300 hover:shadow-md',
      glass: 'bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-white/20 overflow-hidden',
      paper: 'bg-white rounded-lg shadow-sm border border-neutral-mist/30 overflow-hidden paper-texture',
    },
    button: {
      primary: 'bg-primary-sage text-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-primary-sage/90',
      secondary: 'bg-secondary-blossom text-white rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-secondary-blossom/90',
      outline: 'bg-transparent border border-primary-sage text-primary-sage rounded-full px-4 py-2 hover:bg-primary-sage/10 transition-all duration-300',
      ghost: 'bg-transparent text-primary-sage rounded-full px-4 py-2 hover:bg-primary-sage/10 transition-all duration-300',
    },
    input: {
      default: 'rounded-md border border-neutral-mist px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-sage/50 transition-all duration-300',
      search: 'rounded-full border border-neutral-mist px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-sage/50 transition-all duration-300',
    }
  }
};

// Current season detection
export const getCurrentSeason = () => {
  const month = new Date().getMonth();
  
  // Northern hemisphere seasons
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'autumn';
  return 'winter';
};

// Get current seasonal theme
export const getSeasonalTheme = () => {
  const season = getCurrentSeason();
  return theme.colors.seasonal[season as keyof typeof theme.colors.seasonal];
};

export type Theme = typeof theme; 