/**
 * RadarScreen — "¿Qué está pasando ahora?" events view
 *
 * Enhanced with:
 * - Animated radar scanning visual (rotating sweep)
 * - Status-based urgency indicators (NOW / SOON / LATER)
 * - Pulsing ring animation behind live dot
 * - Section headers for event grouping
 * - Premium empty state
 */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Circle as SvgCircle, Path, Line } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  FadeInDown,
  interpolate,
} from 'react-native-reanimated';
import { TurutHeader } from '../components/header/TurutHeader';
import { EventCard } from '../components/cards/EventCard';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { events, getEventStatus, type TurutEvent } from '../data/events';
import { destinations } from '../data/destinations';
import { colors, layout, textStyles } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const RADAR_SIZE = 160;

// ── Animated Radar Visual ──
const RadarVisual: React.FC = () => {
  const rotation = useSharedValue(0);
  const pulse1 = useSharedValue(0);
  const pulse2 = useSharedValue(0);

  useEffect(() => {
    // Continuous rotation for the sweep line
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false
    );
    // Pulse ring 1
    pulse1.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
    // Pulse ring 2 (delayed effect via separate starting value)
    setTimeout(() => {
      pulse2.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
        -1,
        false
      );
    }, 1000);
  }, []);

  const sweepStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const pulse1Style = useAnimatedStyle(() => ({
    opacity: interpolate(pulse1.value, [0, 0.5, 1], [0.4, 0.1, 0]),
    transform: [{ scale: interpolate(pulse1.value, [0, 1], [0.6, 1.3]) }],
  }));

  const pulse2Style = useAnimatedStyle(() => ({
    opacity: interpolate(pulse2.value, [0, 0.5, 1], [0.3, 0.08, 0]),
    transform: [{ scale: interpolate(pulse2.value, [0, 1], [0.5, 1.2]) }],
  }));

  const liveCount = events.filter(e => getEventStatus(e.time) === 'now').length;
  const soonCount = events.filter(e => getEventStatus(e.time) === 'soon').length;

  return (
    <Animated.View entering={FadeInDown.duration(600).springify()} style={styles.radarContainer}>
      {/* Pulse rings */}
      <Animated.View style={[styles.pulseRing, pulse1Style]} />
      <Animated.View style={[styles.pulseRing, pulse2Style]} />

      {/* Radar SVG */}
      <View style={styles.radarSvgContainer}>
        <Svg width={RADAR_SIZE} height={RADAR_SIZE} viewBox="0 0 160 160">
          {/* Outer ring */}
          <SvgCircle cx={80} cy={80} r={72} stroke="rgba(160, 32, 240, 0.15)" strokeWidth={1} fill="none" />
          {/* Middle ring */}
          <SvgCircle cx={80} cy={80} r={48} stroke="rgba(160, 32, 240, 0.12)" strokeWidth={0.8} fill="none" />
          {/* Inner ring */}
          <SvgCircle cx={80} cy={80} r={24} stroke="rgba(160, 32, 240, 0.1)" strokeWidth={0.5} fill="none" />
          {/* Cross lines */}
          <Line x1={80} y1={8} x2={80} y2={152} stroke="rgba(160, 32, 240, 0.06)" strokeWidth={0.5} />
          <Line x1={8} y1={80} x2={152} y2={80} stroke="rgba(160, 32, 240, 0.06)" strokeWidth={0.5} />
          {/* Center dot */}
          <SvgCircle cx={80} cy={80} r={4} fill={colors.primary} opacity={0.8} />
          {/* Event blips */}
          {liveCount > 0 && <SvgCircle cx={110} cy={50} r={5} fill={colors.secondary} opacity={0.9} />}
          {soonCount > 0 && <SvgCircle cx={45} cy={100} r={4} fill={colors.primary} opacity={0.7} />}
          <SvgCircle cx={95} cy={115} r={3} fill="rgba(255,255,255,0.3)" />
        </Svg>

        {/* Rotating sweep overlay */}
        <Animated.View style={[styles.sweepContainer, sweepStyle]}>
          <Svg width={RADAR_SIZE} height={RADAR_SIZE} viewBox="0 0 160 160">
            <Path
              d="M 80 80 L 152 80 A 72 72 0 0 0 128 28 Z"
              fill="rgba(160, 32, 240, 0.15)"
            />
            <Line x1={80} y1={80} x2={152} y2={80} stroke={colors.primary} strokeWidth={1.5} opacity={0.6} />
          </Svg>
        </Animated.View>
      </View>

      {/* Live counters */}
      <View style={styles.radarStats}>
        <View style={styles.radarStat}>
          <View style={[styles.statusDot, { backgroundColor: colors.secondary }]} />
          <Text style={styles.radarStatText}>
            <Text style={styles.radarStatCount}>{liveCount}</Text> en vivo
          </Text>
        </View>
        <View style={styles.radarStatDivider} />
        <View style={styles.radarStat}>
          <View style={[styles.statusDot, { backgroundColor: colors.primary }]} />
          <Text style={styles.radarStatText}>
            <Text style={styles.radarStatCount}>{soonCount}</Text> próximos
          </Text>
        </View>
        <View style={styles.radarStatDivider} />
        <View style={styles.radarStat}>
          <View style={[styles.statusDot, { backgroundColor: 'rgba(255,255,255,0.3)' }]} />
          <Text style={styles.radarStatText}>
            <Text style={styles.radarStatCount}>{events.length}</Text> total
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

// ── Enhanced LiveDot with pulsing ring ──
const LiveDot: React.FC = () => {
  const opacity = useSharedValue(1);
  const ringScale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.4, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    ringScale.value = withRepeat(
      withTiming(2.2, { duration: 1500, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: 0.7 + opacity.value * 0.6 }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: interpolate(ringScale.value, [1, 2.2], [0.4, 0]),
    transform: [{ scale: ringScale.value }],
  }));

  return (
    <View style={styles.liveDotWrapper}>
      <Animated.View style={[styles.liveRing, ringStyle]} />
      <Animated.View style={[styles.liveDot, dotStyle]} />
    </View>
  );
};

// ── Section Header ──
const SectionHeader: React.FC<{ title: string; count: number; color: string }> = ({ title, count, color }) => (
  <Animated.View entering={FadeInDown.duration(400)} style={styles.sectionHeader}>
    <View style={[styles.sectionDot, { backgroundColor: color }]} />
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={[styles.sectionBadge, { backgroundColor: `${color}20` }]}>
      <Text style={[styles.sectionBadgeText, { color }]}>{count}</Text>
    </View>
  </Animated.View>
);

// ── Main Screen ──
const RadarScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleEventPress = (destIndex: number) => {
    navigation.navigate('Landing', { destIndex });
  };

  // Group events by status
  const liveEvents = events.filter(e => getEventStatus(e.time) === 'now');
  const soonEvents = events.filter(e => getEventStatus(e.time) === 'soon');
  const laterEvents = events.filter(e => getEventStatus(e.time) === 'later');

  // Build sections for FlatList
  type ListItem =
    | { type: 'header'; title: string; count: number; color: string; key: string }
    | { type: 'event'; event: TurutEvent; key: string };

  const listData: ListItem[] = [];
  if (liveEvents.length > 0) {
    listData.push({ type: 'header', title: 'EN VIVO AHORA', count: liveEvents.length, color: colors.secondary, key: 'h-live' });
    liveEvents.forEach((e, i) => listData.push({ type: 'event', event: e, key: `live-${i}` }));
  }
  if (soonEvents.length > 0) {
    listData.push({ type: 'header', title: 'MUY PRONTO', count: soonEvents.length, color: colors.primary, key: 'h-soon' });
    soonEvents.forEach((e, i) => listData.push({ type: 'event', event: e, key: `soon-${i}` }));
  }
  if (laterEvents.length > 0) {
    listData.push({ type: 'header', title: 'PRÓXIMAMENTE', count: laterEvents.length, color: 'rgba(255,255,255,0.4)', key: 'h-later' });
    laterEvents.forEach((e, i) => listData.push({ type: 'event', event: e, key: `later-${i}` }));
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={loading ? [] : listData}
        keyExtractor={(item) => item.key}
        ListHeaderComponent={
          <>
            <TurutHeader />
            <View style={styles.headerRow}>
              <LiveDot />
              <Text style={[textStyles.headlineLarge, styles.title]}>¿Qué está pasando ahora?</Text>
            </View>
            {/* Radar Visual */}
            <RadarVisual />
          </>
        }
        renderItem={({ item, index }) => {
          if (item.type === 'header') {
            return (
              <View style={styles.sectionPadding}>
                <SectionHeader title={item.title} count={item.count} color={item.color} />
              </View>
            );
          }
          return (
            <View style={styles.cardPadding}>
              <EventCard
                event={item.event}
                destination={destinations[item.event.destIndex]}
                index={index}
                onPress={() => handleEventPress(item.event.destIndex)}
              />
            </View>
          );
        }}
        ListEmptyComponent={
          loading ? (
            <View style={styles.skeletonList}>
              {[0, 1, 2, 3].map((i) => (
                <View key={i} style={styles.cardPadding}>
                  <SkeletonCard type="event" />
                </View>
              ))}
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingTop: 16,
    marginBottom: 8,
  },
  liveDotWrapper: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  liveRing: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: colors.secondary,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  title: {
    color: colors.textPrimary,
    textShadowColor: colors.primaryGlow,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },

  // ── Radar Visual ──
  radarContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 8,
  },
  pulseRing: {
    position: 'absolute',
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    borderRadius: RADAR_SIZE / 2,
    borderWidth: 1,
    borderColor: colors.primary,
    top: 20,
  },
  radarSvgContainer: {
    width: RADAR_SIZE,
    height: RADAR_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sweepContainer: {
    position: 'absolute',
    width: RADAR_SIZE,
    height: RADAR_SIZE,
  },
  radarStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 16,
  },
  radarStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  radarStatText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  radarStatCount: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  radarStatDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  // ── Section Headers ──
  sectionPadding: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    flex: 1,
  },
  sectionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sectionBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },

  // ── Cards ──
  cardPadding: {
    paddingHorizontal: layout.screenPadding,
  },
  listContent: {
    paddingBottom: layout.bottomNavHeight + 32,
  },
  skeletonList: {
    gap: 12,
  },
});

export default RadarScreen;
