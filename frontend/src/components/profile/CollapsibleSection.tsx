/**
 * CollapsibleSection — Expandable/collapsible card for Profile grouping
 * 
 * Features:
 * - Animated height transition (spring-based)
 * - SVG chevron that rotates on expand/collapse
 * - Completion indicator dot (green if section is complete)
 * - GlassCard-style container
 */
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { colors, textStyles, radii, spacing, shadows } from '../../theme';

const ChevronIcon = ({ size = 18 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M6 9l6 6 6-6" />
  </Svg>
);

interface CollapsibleSectionProps {
  title: string;
  icon?: string;
  children: React.ReactNode;
  /** Whether section data is completed (shows green dot) */
  isComplete?: boolean;
  /** Start expanded */
  defaultExpanded?: boolean;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  children,
  isComplete = false,
  defaultExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [contentHeight, setContentHeight] = useState(0);

  const chevronRotation = useSharedValue(defaultExpanded ? 180 : 0);
  const heightAnim = useSharedValue(defaultExpanded ? 1 : 0);

  const toggleExpanded = useCallback(() => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    chevronRotation.value = withTiming(newExpanded ? 180 : 0, {
      duration: 250,
      easing: Easing.out(Easing.ease),
    });
    heightAnim.value = withTiming(newExpanded ? 1 : 0, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
  }, [expanded]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${chevronRotation.value}deg` }],
  }));

  const contentStyle = useAnimatedStyle(() => ({
    height: heightAnim.value * contentHeight,
    opacity: heightAnim.value,
    overflow: 'hidden' as const,
  }));

  return (
    <View style={styles.container}>
      {/* Header (always visible) */}
      <TouchableOpacity
        style={styles.header}
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          {/* Completion indicator */}
          <View style={[
            styles.completionDot,
            isComplete ? styles.completionDotDone : styles.completionDotPending,
          ]} />
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text style={styles.title}>{title}</Text>
        </View>
        <Animated.View style={chevronStyle}>
          <ChevronIcon />
        </Animated.View>
      </TouchableOpacity>

      {/* Content (collapsible) */}
      <Animated.View style={contentStyle}>
        <View style={styles.content}>
          {children}
        </View>
      </Animated.View>

      {/* Hidden measurer — renders offscreen to get real height */}
      <View
        style={styles.measurer}
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          if (h > 0 && h !== contentHeight) {
            setContentHeight(h);
            // If initially expanded, set height immediately
            if (defaultExpanded) {
              heightAnim.value = 1;
            }
          }
        }}
      >
        <View style={styles.content}>
          {children}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.md,
    backgroundColor: 'rgba(10, 10, 15, 0.6)',
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadows.glass,
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(40px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
        } as any)
      : {}),
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  completionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  completionDotDone: {
    backgroundColor: '#34C759',
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  completionDotPending: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  icon: {
    fontSize: 16,
  },
  title: {
    ...textStyles.headlineSmall,
    color: colors.textPrimary,
    fontSize: 15,
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  // Offscreen measurer to get content height
  measurer: {
    position: 'absolute',
    top: -9999,
    left: 0,
    right: 0,
    opacity: 0,
  },
});
