/**
 * ProfileCompletionBar — Animated progress bar showing profile completion
 * Uses TURUT design system (Andina Neón)
 */
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Platform } from 'react-native';
import { colors, textStyles, radii, spacing, shadows } from '../../theme';
import { UserProfile } from '../../context/AuthContext';

/**
 * Calcula el porcentaje de completado del perfil basándose en las secciones.
 * 5 secciones = 20% cada una:
 *   1. Datos demográficos (city, birthDate, gender)
 *   2. Preferencias café (coffeeExperience, coffeeInterests)
 *   3. Preferencias exploración (experienceTypes, travelCompany, naturePreferences)
 *   4. Estilo de viaje (lodgingStyle, connectivityPreference, escapeTime)
 *   5. Necesidades especiales + canal de adquisición
 */
export const calculateProfileCompletion = (user: UserProfile | null): number => {
  if (!user) return 0;

  let completed = 0;
  const totalSections = 5;

  // Sección 1: Datos demográficos
  const hasDemographics = !!(user.city && user.birthDate && user.gender);
  if (hasDemographics) completed++;

  // Sección 2: Preferencias café
  const hasCoffee = !!(
    user.preferences?.coffeeExperience &&
    user.preferences?.coffeeInterests &&
    user.preferences.coffeeInterests.length > 0
  );
  if (hasCoffee) completed++;

  // Sección 3: Preferencias exploración
  const hasExploration = !!(
    user.preferences?.experienceTypes &&
    user.preferences.experienceTypes.length > 0 &&
    user.preferences?.travelCompany &&
    user.preferences?.naturePreferences &&
    user.preferences.naturePreferences.length > 0
  );
  if (hasExploration) completed++;

  // Sección 4: Estilo de viaje
  const hasTravelStyle = !!(
    user.preferences?.lodgingStyle &&
    user.preferences?.connectivityPreference &&
    user.preferences?.escapeTime
  );
  if (hasTravelStyle) completed++;

  // Sección 5: Necesidades + adquisición
  const hasExtras = !!(
    user.specialNeeds &&
    user.specialNeeds.length > 0 &&
    user.acquisitionSource
  );
  if (hasExtras) completed++;

  return Math.round((completed / totalSections) * 100);
};

interface ProfileCompletionBarProps {
  user: UserProfile | null;
}

const ProfileCompletionBar: React.FC<ProfileCompletionBarProps> = ({ user }) => {
  const percentage = calculateProfileCompletion(user);
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: percentage,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  // Don't show if profile is complete
  if (percentage >= 100) {
    return (
      <View style={[styles.container, styles.containerComplete]}>
        <Text style={styles.completeText}>🎉 ¡Perfil completo!</Text>
        <Text style={styles.completeSubtext}>
          Tus recomendaciones están personalizadas
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Completa tu perfil</Text>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>

      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              width: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      <Text style={styles.subtitle}>
        🎯 Completa tu perfil para recomendaciones personalizadas
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.xxl,
    padding: spacing.lg,
    borderRadius: radii.lg,
    backgroundColor: colors.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  containerComplete: {
    borderColor: 'rgba(34, 197, 94, 0.3)',
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    ...textStyles.bodySemiBold,
    color: colors.textPrimary,
    fontSize: 13,
  },
  percentage: {
    ...textStyles.bodyBold,
    color: colors.primary,
    fontSize: 13,
  },
  track: {
    height: 6,
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
    ...(Platform.OS === 'web'
      ? ({
          background: 'linear-gradient(90deg, #A020F0, #C084FC)',
        } as any)
      : {}),
  },
  subtitle: {
    ...textStyles.body,
    color: colors.textMuted,
    fontSize: 11,
  },
  completeText: {
    ...textStyles.bodySemiBold,
    color: '#22C55E',
    fontSize: 14,
    textAlign: 'center',
  },
  completeSubtext: {
    ...textStyles.body,
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
});

export default ProfileCompletionBar;
