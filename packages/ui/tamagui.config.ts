import { createTamagui, createTokens } from '@tamagui/core'
import { themes as baseThemes, tokens as defaultTokens } from '@tamagui/theme-base'

// Enhanced tokens for beautiful UI
const tokens = createTokens({
  ...defaultTokens,
  color: {
    ...defaultTokens.color,
    // Light theme colors - Clean and modern
    lightBackground: '#FFFFFF',
    lightSurface: '#F8F9FA',
    lightSurfaceVariant: '#E9ECEF',
    lightPrimary: '#6366F1', // Indigo
    lightPrimaryVariant: '#4F46E5',
    lightSecondary: '#EC4899', // Pink
    lightText: '#1F2937',
    lightTextSecondary: '#6B7280',
    lightBorder: '#E5E7EB',
    lightSuccess: '#10B981',
    lightWarning: '#F59E0B',
    lightError: '#EF4444',
    
    // Dark theme colors - Eye-friendly and modern
    darkBackground: '#0F172A', // Slate 900
    darkSurface: '#1E293B', // Slate 800
    darkSurfaceVariant: '#334155', // Slate 700
    darkPrimary: '#818CF8', // Lighter indigo for dark
    darkPrimaryVariant: '#6366F1',
    darkSecondary: '#F472B6', // Lighter pink for dark
    darkText: '#F1F5F9',
    darkTextSecondary: '#CBD5E1',
    darkBorder: '#475569',
    darkSuccess: '#34D399',
    darkWarning: '#FBBF24',
    darkError: '#F87171',
  },
  space: {
    ...defaultTokens.space,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
  },
  radius: {
    ...defaultTokens.radius,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
})

// Light theme
const lightTheme = {
  background: tokens.color.lightBackground,
  surface: tokens.color.lightSurface,
  surfaceVariant: tokens.color.lightSurfaceVariant,
  primary: tokens.color.lightPrimary,
  primaryVariant: tokens.color.lightPrimaryVariant,
  secondary: tokens.color.lightSecondary,
  text: tokens.color.lightText,
  textSecondary: tokens.color.lightTextSecondary,
  border: tokens.color.lightBorder,
  success: tokens.color.lightSuccess,
  warning: tokens.color.lightWarning,
  error: tokens.color.lightError,
  cardBackground: '#FFFFFF',
  cardShadow: 'rgba(0, 0, 0, 0.05)',
}

// Dark theme
const darkTheme = {
  background: tokens.color.darkBackground,
  surface: tokens.color.darkSurface,
  surfaceVariant: tokens.color.darkSurfaceVariant,
  primary: tokens.color.darkPrimary,
  primaryVariant: tokens.color.darkPrimaryVariant,
  secondary: tokens.color.darkSecondary,
  text: tokens.color.darkText,
  textSecondary: tokens.color.darkTextSecondary,
  border: tokens.color.darkBorder,
  success: tokens.color.darkSuccess,
  warning: tokens.color.darkWarning,
  error: tokens.color.darkError,
  cardBackground: '#1E293B',
  cardShadow: 'rgba(0, 0, 0, 0.3)',
}

export const config = createTamagui({
  tokens,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  media: {
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  },
})

export type AppConfig = typeof config

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config
