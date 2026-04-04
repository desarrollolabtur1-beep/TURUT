/**
 * LiveBadge — "Ahora" / "Hoy" status badge with pulse animation
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '../../theme';
import type { EventStatus } from '../../data/events';

interface LiveBadgeProps {
  status: EventStatus;
}

export const LiveBadge: React.FC<LiveBadgeProps> = ({ status }) => {
  if (status === 'later') return null;

  const isNow = status === 'now';
  const label = isNow ? 'Ahora' : 'Hoy';
  const dotOpacity = useSharedValue(1);

  useEffect(() => {
    dotOpacity.value = withRepeat(
      withTiming(0.4, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: dotOpacity.value,
    transform: [{ scale: 0.8 + dotOpacity.value * 0.5 }],
  }));

  return (
    <View
      style={[
        styles.badge,
        isNow ? styles.badgeNow : styles.badgeSoon,
      ]}
    >
      {isNow && <Animated.View style={[styles.dot, dotStyle]} />}
      <Text
        style={[
          styles.label,
          { color: isNow ? colors.secondary : colors.accentGold },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 9999,
    borderWidth: 1,
  },
  badgeNow: {
    backgroundColor: colors.secondarySoft,
    borderColor: 'rgba(52,211,153,0.15)',
  },
  badgeSoon: {
    backgroundColor: 'rgba(251,191,36,0.1)',
    borderColor: 'rgba(251,191,36,0.15)',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.secondary,
  },
  label: {
    fontSize: 9.6,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.3,
  },
});
