/**
 * ProfileChipSelector — Multi-select chips for profile preferences
 * Uses TURUT design system (Andina Neón)
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, textStyles, radii, spacing } from '../../theme';

interface ChipOption {
  value: string;
  label: string;
  emoji: string;
}

interface ProfileChipSelectorProps {
  options: ChipOption[];
  selected: string[];
  onToggle: (value: string) => void;
  multiSelect?: boolean;
}

const ProfileChipSelector: React.FC<ProfileChipSelectorProps> = ({
  options,
  selected,
  onToggle,
  multiSelect = true,
}) => {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.chip, isSelected && styles.chipSelected]}
            onPress={() => onToggle(option.value)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{option.emoji}</Text>
            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  chipSelected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  emoji: {
    fontSize: 14,
  },
  label: {
    ...textStyles.bodySemiBold,
    fontSize: 12,
    color: colors.textMuted,
  },
  labelSelected: {
    color: colors.primary,
  },
});

export default ProfileChipSelector;
