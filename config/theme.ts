/**
 * System Color Palette - Based on Emergency Services Logo
 * Logo Colors: Orange-Red gradient, Blue wings, White accents
 */

export const theme = {
  // Primary Emergency Colors (Orange-Red from logo)
  primary: {
    light: '#FF6B35', // Vibrant orange
    main: '#FF4500', // Orange-red
    dark: '#E63900', // Deeper red
    gradient: 'linear-gradient(90deg, #FF6B35 0%, #E63900 100%)',
  },
  
  // Secondary Colors (Blue from logo wings)
  secondary: {
    light: '#4A90E2', // Sky blue
    main: '#2563EB', // Royal blue
    dark: '#1E40AF', // Deep blue
    gradient: 'linear-gradient(135deg, #4A90E2 0%, #1E40AF 100%)',
  },
  
  // Accent Colors
  accent: {
    white: '#FFFFFF',
    lightGray: '#F5F5F5',
    gray: '#E5E7EB',
    darkGray: '#6B7280',
  },
  
  // Status Colors (using logo palette)
  success: '#22C55E', // Keep green for safe zones
  warning: '#F59E0B', // Amber/orange
  error: '#E63900', // Use logo red
  info: '#2563EB', // Use logo blue
  
  // Emergency specific
  emergency: '#E63900', // Logo red
  safe: '#22C55E', // Green for safe zones
};

// Tailwind color classes for NativeWind
export const tailwindColors = {
  primary: {
    50: '#FFF4F0',
    100: '#FFE5D9',
    200: '#FFC7B3',
    300: '#FF9F7F',
    400: '#FF6B35',
    500: '#FF4500',
    600: '#E63900',
    700: '#CC2E00',
    800: '#B32600',
    900: '#991F00',
  },
  secondary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#2563EB',
    600: '#1E40AF',
    700: '#1E3A8A',
    800: '#1E293B',
    900: '#0F172A',
  },
};

