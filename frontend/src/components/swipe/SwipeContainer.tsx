/**
 * SwipeContainer — Swipeable card container with gesture handling
 * Uses react-native-gesture-handler + reanimated for smooth swipe physics
 */
import React, { useCallback } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { SwipeCard } from '../cards/SwipeCard';
import { colors } from '../../theme';
import type { Destination } from '../../data/destinations';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = 80;

const CARD_WIDTH = Math.min(SCREEN_WIDTH * 0.85, 360);
const AVAILABLE_HEIGHT = SCREEN_HEIGHT - 400;
const CARD_HEIGHT = Math.min(CARD_WIDTH * 1.05, Math.max(AVAILABLE_HEIGHT, 300));

interface SwipeContainerProps {
  destination: Destination;
  currentIndex: number;
  total: number;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
}

export const SwipeContainer: React.FC<SwipeContainerProps> = ({
  destination,
  currentIndex,
  total,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const translateX = useSharedValue(0);
  const isActive = useSharedValue(false);

  const handleSwipeComplete = useCallback(
    (direction: 'left' | 'right') => {
      if (direction === 'left') {
        onSwipeLeft();
      } else {
        onSwipeRight();
      }
    },
    [onSwipeLeft, onSwipeRight]
  );

  const gesture = Gesture.Pan()
    // HYBRID FIX: Only activate on horizontal swipes, let vertical scroll through
    .activeOffsetX([-15, 15])
    .failOffsetY([-10, 10])
    .onStart(() => {
      isActive.value = true;
    })
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      isActive.value = false;
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        const direction = event.translationX < 0 ? 'left' : 'right';
        translateX.value = withTiming(
          direction === 'left' ? -SCREEN_WIDTH * 1.2 : SCREEN_WIDTH * 1.2,
          { duration: 400 },
          () => {
            runOnJS(handleSwipeComplete)(direction);
            translateX.value = 0;
          }
        );
      } else {
        translateX.value = withSpring(0, { damping: 15, stiffness: 200 });
      }
    });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      [-15, 0, 15],
      Extrapolation.CLAMP
    );

    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotation}deg` },
      ],
    };
  });

  // Hint overlays
  const leftHintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD, 0],
      [0.35, 0],
      Extrapolation.CLAMP
    ),
  }));

  const rightHintStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD],
      [0, 0.35],
      Extrapolation.CLAMP
    ),
  }));

  return (
    <View style={styles.container}>
      {/* Card */}
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.cardWrapper, cardAnimatedStyle]}>
          <SwipeCard destination={destination} />
          {/* Swipe hint overlays */}
          <Animated.View style={[styles.hintOverlay, styles.hintLeft, leftHintStyle]} />
          <Animated.View style={[styles.hintOverlay, styles.hintRight, rightHintStyle]} />
        </Animated.View>
      </GestureDetector>

      {/* Progress dots */}
      <View style={styles.dotsRow}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === currentIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 8,
    // HYBRID: Let vertical touch events pass through to parent ScrollView
    ...(Platform.OS === 'web' ? { touchAction: 'pan-y' } as any : {}),
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 24,
    overflow: 'hidden',
  },
  hintOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 2,
  },
  hintLeft: {
    borderColor: colors.accentUrgent,
    shadowColor: colors.accentUrgent,
    shadowOpacity: 0.35,
    shadowRadius: 30,
  },
  hintRight: {
    borderColor: '#34D399',
    shadowColor: '#34D399',
    shadowOpacity: 0.35,
    shadowRadius: 30,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.textMuted,
    opacity: 0.3,
  },
  dotActive: {
    width: 20,
    borderRadius: 3,
    backgroundColor: colors.primary,
    opacity: 1,
  },
});
