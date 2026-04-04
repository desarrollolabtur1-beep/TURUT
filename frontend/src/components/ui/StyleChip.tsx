/**
 * StyleChip — Horizontal filter chip for categories
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radii } from '../../theme';

interface StyleChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}

export const StyleChip: React.FC<StyleChipProps> = ({ label, active, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 14.4,
    paddingVertical: 7.2,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.transparent,
    minHeight: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 4,
    transform: [{ translateY: -2 }],
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  labelActive: {
    color: colors.primary,
  },
});
