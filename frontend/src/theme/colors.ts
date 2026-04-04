/**
 * TURUT Design System — Color Tokens
 * Identical to the PWA's turut.css :root variables
 */

export const colors = {
  // Core Palette (Nightlife Experience)
  primary: '#A020F0',
  primaryContainer: '#7E15C2',
  primarySoft: 'rgba(160, 32, 240, 0.15)',
  primaryGlow: 'rgba(160, 32, 240, 0.4)',
  onPrimary: '#FFFFFF',

  secondary: '#FFD700', // Dorado / Call to actions
  secondarySoft: 'rgba(255, 215, 0, 0.15)',
  secondaryGlow: 'rgba(255, 215, 0, 0.4)',
  onSecondary: '#000000',

  tertiary: '#4D8DFF', // Electric Blue
  accentUrgent: '#F97066',
  accentGold: '#FFD700',

  // Surfaces — Immersive Black Space
  background: '#050505',
  surface: '#0a0a0a',
  surfaceSunken: '#020202',
  surfaceContainerLowest: '#000000',
  surfaceContainerLow: '#080808',
  surfaceContainer: '#0C0C0C',
  surfaceContainerHigh: '#121212',
  surfaceContainerHighest: '#1A1A1A',
  surfaceElevated: '#161616',
  surfaceBright: '#202020',
  surfaceVariant: '#0F0F0F',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#E5E7EB',
  textMuted: '#9CA3AF',
  onSurface: '#FFFFFF',
  onSurfaceVariant: '#E5E7EB',
  onBackground: '#FFFFFF',

  // Borders (Innovative ultra-thin)
  outline: 'rgba(255, 255, 255, 0.08)',
  outlineVariant: 'rgba(255, 255, 255, 0.04)',

  // Category Colors
  catAventura: '#3B82F6',
  catRelax: '#EC4899',
  catGastro: '#F59E0B',
  catCultura: '#A855F7',
  catCoffee: '#92400E',
  catCoffeeText: '#D97706',

  // Error
  error: '#F97066',

  // Header date
  dateGold: '#D6A848',

  // Transparent
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

/** Map category name → color token */
export const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Aventura: {
    bg: 'rgba(59,130,246,0.15)',
    text: colors.catAventura,
    border: 'rgba(59,130,246,0.2)',
  },
  Relax: {
    bg: 'rgba(236,72,153,0.15)',
    text: colors.catRelax,
    border: 'rgba(236,72,153,0.2)',
  },
  Gastronomía: {
    bg: 'rgba(245,158,11,0.15)',
    text: colors.catGastro,
    border: 'rgba(245,158,11,0.2)',
  },
  Cultura: {
    bg: 'rgba(168,85,247,0.15)',
    text: colors.catCultura,
    border: 'rgba(168,85,247,0.2)',
  },
  Coffee: {
    bg: 'rgba(146,64,14,0.25)',
    text: colors.catCoffeeText,
    border: 'rgba(146,64,14,0.3)',
  },
};

export type CategoryName = keyof typeof categoryColors;
