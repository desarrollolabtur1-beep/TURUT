/**
 * ProfileSingleSelector — Radio-style single-select for profile preferences
 * Uses TURUT design system (Andina Neón)
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, textStyles, radii, spacing } from '../../theme';

interface SelectorOption {
  value: string;
  label: string;
  emoji: string;
}

interface ProfileSingleSelectorProps {
  options: SelectorOption[];
  selected: string;
  onSelect: (value: string) => void;
}

const ProfileSingleSelector: React.FC<ProfileSingleSelectorProps> = ({
  options,
  selected,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selected === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[styles.option, isSelected && styles.optionSelected]}
            onPress={() => onSelect(option.value)}
            activeOpacity={0.7}
          >
            {/* Radio circle */}
            <View style={[styles.radio, isSelected && styles.radioSelected]}>
              {isSelected && <View style={styles.radioDot} />}
            </View>
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
    gap: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  optionSelected: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  emoji: {
    fontSize: 16,
  },
  label: {
    ...textStyles.bodyMedium,
    fontSize: 13,
    color: colors.textSecondary,
    flex: 1,
  },
  labelSelected: {
    color: colors.textPrimary,
  },
});

export default ProfileSingleSelector;
