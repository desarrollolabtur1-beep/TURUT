/**
 * TURUT Design System — Typography
 * Font families and text style presets
 */
import { Platform, TextStyle } from 'react-native';

/** Font family names used with expo-font */
export const fontFamilies = {
  // Body text
  inter: 'Inter',
  interMedium: 'Inter-Medium',
  interSemiBold: 'Inter-SemiBold',
  interBold: 'Inter-Bold',

  // Headlines
  montserratBold: 'Montserrat-Bold',
  montserratExtraBold: 'Montserrat-ExtraBold',
  montserratBlack: 'Montserrat-Black',

  // Logo / Tech
  orbitronBold: 'Orbitron-Bold',
  orbitronBlack: 'Orbitron-Black',

  // Monospace (timers)
  jetBrainsMono: 'JetBrainsMono-Bold',

  // Decorative (logo 's')
  greatVibes: 'GreatVibes-Regular',
} as const;

/** Fallback for web where custom fonts may not load */
const webFallback = (family: string, fallback: string): string => {
  if (Platform.OS === 'web') {
    return `${family}, ${fallback}`;
  }
  return family;
};

/** Pre-built text styles */
export const textStyles: Record<string, TextStyle> = {
  // Body
  body: {
    fontFamily: webFallback('Inter', 'system-ui, -apple-system, sans-serif'),
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '400',
  },
  bodyMedium: {
    fontFamily: webFallback('Inter-Medium', 'system-ui, sans-serif'),
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  bodySemiBold: {
    fontFamily: webFallback('Inter-SemiBold', 'system-ui, sans-serif'),
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '600',
  },
  bodyBold: {
    fontFamily: webFallback('Inter-Bold', 'system-ui, sans-serif'),
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '700',
  },

  // Headlines
  headline: {
    fontFamily: webFallback('Montserrat-ExtraBold', 'Montserrat, sans-serif'),
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headlineLarge: {
    fontFamily: webFallback('Montserrat-ExtraBold', 'Montserrat, sans-serif'),
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headlineMedium: {
    fontFamily: webFallback('Montserrat-ExtraBold', 'Montserrat, sans-serif'),
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headlineSmall: {
    fontFamily: webFallback('Montserrat-Bold', 'Montserrat, sans-serif'),
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
  },

  // Specialized
  logo: {
    fontFamily: webFallback('Orbitron-Black', 'Orbitron, sans-serif'),
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  logoSymbol: {
    fontFamily: webFallback('GreatVibes-Regular', 'Great Vibes, cursive'),
    fontSize: 28,
    fontWeight: '400',
  },
  timer: {
    fontFamily: webFallback('JetBrainsMono-Bold', 'JetBrains Mono, monospace'),
    fontSize: 48,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  timerSmall: {
    fontFamily: webFallback('JetBrainsMono-Bold', 'JetBrains Mono, monospace'),
    fontSize: 12.8,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },

  // Labels
  chipLabel: {
    fontFamily: webFallback('Inter-Bold', 'system-ui, sans-serif'),
    fontSize: 10.4,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
  navLabel: {
    fontFamily: webFallback('Inter-SemiBold', 'system-ui, sans-serif'),
    fontSize: 9.6,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  meta: {
    fontFamily: webFallback('Inter-SemiBold', 'system-ui, sans-serif'),
    fontSize: 12.8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
};
