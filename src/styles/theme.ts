export const theme = {
  colors: {
    // Primary Colors
    primary: {
      teal: '#1A7A77',
      lavender: '#ACBCF4',
      sage: '#C2D6C5',
    },
    // Secondary Colors
    secondary: {
      peach: '#FFBC97',
      mauve: '#D4ADCF',
    },
    // Neutral Colors
    neutral: {
      white: '#F8FAFC',
      gray: '#E2E8F0',
      blue: '#334155',
    },
    // Functional Colors
    functional: {
      success: '#4AD295',
      alert: '#F9B44A',
      focus: '#8B5CF6',
    },
  },
  typography: {
    fontFamily: {
      primary: 'Lexend, sans-serif',
      accent: 'Martel Sans, sans-serif',
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
  },
  transitions: {
    default: '300ms ease-in-out',
    slow: '400ms ease-in-out',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #1A7A77 0%, #ACBCF4 100%)',
    secondary: 'linear-gradient(135deg, #C2D6C5 0%, #FFBC97 100%)',
    accent: 'linear-gradient(135deg, #D4ADCF 0%, #8B5CF6 100%)',
  },
};

export type Theme = typeof theme; 