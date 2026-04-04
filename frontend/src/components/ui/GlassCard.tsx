/**
 * GlassCard — Glassmorphism container
 * Simulates backdrop-filter with semi-transparent backgrounds
 */
import React from 'react';
import { View, ViewStyle, StyleSheet, Platform } from 'react-native';
import { colors, radii, shadows } from '../../theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  neon?: 'primary' | 'secondary';
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, neon }) => {
  return (
    <View
      style={[
        styles.card,
        neon === 'primary' && shadows.neonPrimary,
        neon === 'secondary' && shadows.neonSecondary,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(10, 10, 15, 0.6)',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderTopColor: colors.outline,
    borderRadius: radii.xl,
    ...shadows.glass,
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(40px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
        } as any)
      : {}),
  },
});
