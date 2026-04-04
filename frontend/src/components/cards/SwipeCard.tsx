/**
 * SwipeCard — Card displayed in the swipe/discover view
 */
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { GlassCard } from '../ui/GlassCard';
import { CategoryChip } from '../ui/CategoryChip';
import { colors, radii, shadows, textStyles } from '../../theme';
import type { Destination } from '../../data/destinations';

const MapPinSmall = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth={2}>
    <Path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <Circle cx={12} cy={10} r={3} />
  </Svg>
);

interface SwipeCardProps {
  destination: Destination;
  timerText?: string;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ destination, timerText = '04:59' }) => {
  return (
    <View style={styles.card}>
      <Image source={destination.img} style={styles.image} resizeMode="cover" />

      {/* Timer chip */}
      <GlassCard style={styles.timerChip}>
        <Text style={styles.timerText}>{timerText}</Text>
      </GlassCard>

      {/* Bottom overlay */}
      <View style={styles.overlay}>
        <CategoryChip category={destination.category} />
        <Text style={styles.title}>{destination.name}</Text>
        <View style={styles.locationRow}>
          <MapPinSmall />
          <Text style={styles.locationText}>
            {destination.distance} · Ibagué
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: '100%',
    borderRadius: radii.xxl,
    overflow: 'hidden',
    ...shadows.glass,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  timerChip: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12.8,
    paddingVertical: 6.4,
    borderRadius: radii.full,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6.4,
  },
  timerText: {
    ...textStyles.timerSmall,
    color: colors.secondary,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: 'rgba(10,10,11,0.8)',
  },
  title: {
    ...textStyles.headlineMedium,
    color: colors.white,
    marginVertical: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5.6,
  },
  locationText: {
    color: colors.textSecondary,
    fontSize: 13.6,
  },
});
