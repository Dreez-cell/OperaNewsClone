export const theme = {
  colors: {
    // Readit brand color (orange-red)
    primary: '#FF4500',
    secondary: '#0079D3',
    
    // Upvote/Downvote
    upvote: '#FF4500',
    downvote: '#7193FF',
    
    // Action colors
    join: '#0079D3',
    success: '#46D160',
    error: '#EA0027',
    warning: '#FFB000',
    
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
        dark: '#474748',
      },
    },
    
    // Borders
    border: {
      light: '#EDEFF1',
      dark: '#343536',
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    base: 16,
    md: 12,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    full: 9999,
  },
  
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    fontWeight: {
      regular: '400' as const,
      medium: '500' as const,
      semiBold: '600' as const,
      bold: '700' as const,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.7,
    },
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
  },
};
