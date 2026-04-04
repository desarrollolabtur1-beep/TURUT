/**
 * CategoryChip — Colored category badge
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { categoryColors, colors } from '../../theme';
import { textStyles } from '../../theme';

interface CategoryChipProps {
  category: string;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({ category }) => {
  const scheme = categoryColors[category] || {
    bg: 'rgba(255,255,255,0.1)',
    text: colors.textSecondary,
    border: colors.outline,
  };

  return (
    <View style={[styles.chip, { backgroundColor: scheme.bg, borderColor: scheme.border }]}>
      <Text style={[styles.label, { color: scheme.text }]}>{category}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 9999,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  label: {
    ...textStyles.chipLabel,
    fontSize: 10.4,
    letterSpacing: 1.6,
  },
});
