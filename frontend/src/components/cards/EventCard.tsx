/**
 * EventCard — Event item in the "Radar" view
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { GlassCard } from '../ui/GlassCard';
import { LiveBadge } from '../ui/LiveBadge';
import { colors, radii } from '../../theme';
import { getEventStatus } from '../../data/events';
import type { TurutEvent } from '../../data/events';
import type { Destination } from '../../data/destinations';

interface EventCardProps {
  event: TurutEvent;
  destination: Destination;
  index: number;
  onPress: () => void;
}

/** Simple emoji icons for event types */
const EVENT_ICONS: Record<string, string> = {
  'music-note': '🎵',
  'flame': '🔥',
  'utensils': '🍽️',
  'coffee': '☕',
  'store': '🏪',
};

export const EventCard: React.FC<EventCardProps> = ({ event, destination, index, onPress }) => {
  const status = getEventStatus(event.time);

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(450).springify()}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
        <GlassCard style={styles.card}>
          {/* Icon */}
          <View style={styles.iconBox}>
            <Text style={styles.iconEmoji}>{EVENT_ICONS[event.icon] || '🔥'}</Text>
          </View>

          {/* Info */}
          <View style={styles.info}>
            <Text style={styles.meta} numberOfLines={1}>
              {destination.name} · {event.time}
            </Text>
            <Text style={styles.name} numberOfLines={1}>
              {event.name}
            </Text>
          </View>

          {/* Badge */}
          <LiveBadge status={status} />

          {/* Button */}
          <TouchableOpacity style={styles.btn} onPress={onPress}>
            <Text style={styles.btnText}>Ver</Text>
          </TouchableOpacity>
        </GlassCard>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    borderRadius: 20,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },
  iconEmoji: {
    fontSize: 20,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  meta: {
    fontSize: 10.4,
    color: colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  name: {
    fontSize: 15.2,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    minHeight: 40,
    minWidth: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
});
