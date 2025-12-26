export const theme = {
  colors: {
    // Brand Colors
    primary: '#FF1B2D',
    primaryDark: '#D91625',
    primaryLight: '#FF4757',
    
    // Backgrounds
    background: {
      light: '#FFFFFF',
      dark: '#000000',
      card: {
        light: '#FFFFFF',
        dark: '#1C1C1E',
      },
      secondary: {
        light: '#F2F2F7',
        dark: '#2C2C2E',
      },
    },
    
    // Text
    text: {
      primary: {
        light: '#000000',
        dark: '#FFFFFF',
      },
      secondary: {
        light: '#6E6E73',
        dark: '#98989D',
      },
      tertiary: {
        light: '#8E8E93',
        dark: '#6E6E73',
      },
    },
    
    // Borders
    border: {
      light: '#E5E5EA',
      dark: '#38383A',
    },
    
    // Status
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    
    // Overlay
    overlay: 'rgba(0, 0, 0, 0.4)',
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
