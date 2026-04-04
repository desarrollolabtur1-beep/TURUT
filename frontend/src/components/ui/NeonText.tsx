/**
 * NeonText — Text with glowing shadow effect
 */
import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { colors, textStyles } from '../../theme';

interface NeonTextProps {
  children: React.ReactNode;
  color?: string;
  glowColor?: string;
  style?: TextStyle;
}

export const NeonText: React.FC<NeonTextProps> = ({
  children,
  color = colors.textPrimary,
  glowColor = colors.primaryGlow,
  style,
}) => {
  return (
    <Text
      style={[
        styles.text,
        {
          color,
          textShadowColor: glowColor,
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 20,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    ...textStyles.headline,
  },
});
