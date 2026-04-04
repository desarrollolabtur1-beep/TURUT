/**
 * SkeletonCard — Shimmer loading placeholder
 */
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { colors, radii } from '../../theme';

interface SkeletonCardProps {
  type: 'dest' | 'event';
}

const ShimmerLine: React.FC<{ width: string | number; height?: number }> = ({
  width,
  height = 12,
}) => {
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.3, 0.7, 0.3]),
  }));

  return (
    <Animated.View
      style={[
        styles.line,
        animatedStyle,
        { width: width as any, height },
      ]}
    />
  );
};

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ type }) => {
  if (type === 'event') {
    return (
      <View style={styles.eventContainer}>
        <ShimmerLine width={44} height={44} />
        <View style={styles.lines}>
          <ShimmerLine width="70%" />
          <ShimmerLine width="50%" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.destContainer}>
      <ShimmerLine width={72} height={72} />
      <View style={styles.lines}>
        <ShimmerLine width="70%" />
        <ShimmerLine width="50%" />
        <ShimmerLine width="35%" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  destContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 12,
    borderRadius: radii.xl,
    backgroundColor: colors.surfaceContainer,
  },
  eventContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    borderRadius: radii.xl,
    backgroundColor: colors.surfaceContainer,
  },
  lines: {
    flex: 1,
    gap: 8,
  },
  line: {
    borderRadius: 6,
    backgroundColor: colors.surfaceContainerHigh,
  },
});
