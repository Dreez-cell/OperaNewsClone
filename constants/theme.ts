export const theme = {
  colors: {
    // Reddit Brand Colors
    primary: '#FF4500', // Reddit Orange
    primaryDark: '#CC3700',
    primaryLight: '#FF6A33',
    
    // Backgrounds
    background: {
      light: '#DAE0E6',
      dark: '#030303',
      card: {
        light: '#FFFFFF',
        dark: '#1A1A1B',
      },
      secondary: {
        light: '#F6F7F8',
        dark: '#272729',
      },
    },
    
    // Text
    text: {
      primary: {
        light: '#1C1C1C',
        dark: '#D7DADC',
      },
      secondary: {
        light: '#7C7C7C',
        dark: '#818384',
      },
      tertiary: {
        light: '#A8A8A8',
        dark: '#6A6A6A',
      },
    },
    
    // Borders
    border: {
      light: '#EDEFF1',
      dark: '#343536',
    },
    
    // Upvote/Downvote
    upvote: '#FF4500',
    downvote: '#7193FF',
    
    // Join Button
    join: '#0079D3',
    
    // Status
    success: '#46D160',
    warning: '#FFB000',
    error: '#EA0027',
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.5)',
  },
  
  typography: {
    // Font Families
    fontFamily: {
      regular: 'System',
      medium: 'System',
      semiBold: 'System',
      bold: 'System',
    },
    
    // Font Sizes
    fontSize: {
      xs: 11,
      sm: 13,
      base: 15,
      lg: 17,
      xl: 20,
      xxl: 24,
      xxxl: 28,
      headline: 34,
    },
    
    // Line Heights
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.7,
    },
    
    // Font Weights
    fontWeight: {
      regular: '400' as const,
      medium: '500' as const,
      semiBold: '600' as const,
      bold: '700' as const,
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  
  borderRadius: {
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};

export type Theme = typeof theme;
