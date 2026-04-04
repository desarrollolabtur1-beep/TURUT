/**
 * SegmentControl — Top 5 Imperdibles / Tus Matches toggle
 * Animated sliding background indicator
 */
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors, radii } from '../../theme';

interface SegmentControlProps {
  activeTab: 'top5' | 'miruta';
  onTabChange: (tab: 'top5' | 'miruta') => void;
}

export const SegmentControl: React.FC<SegmentControlProps> = ({ activeTab, onTabChange }) => {
  const containerWidth = useSharedValue(0);

  const bgStyle = useAnimatedStyle(() => {
    const segmentWidth = (containerWidth.value - 8) / 2;
    return {
      width: segmentWidth,
      transform: [
        {
          translateX: withSpring(activeTab === 'top5' ? 0 : segmentWidth, {
            damping: 15,
            stiffness: 200,
          }),
        },
      ],
    };
  });

  const handleLayout = (e: LayoutChangeEvent) => {
    containerWidth.value = e.nativeEvent.layout.width;
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container} onLayout={handleLayout}>
        <Animated.View style={[styles.bg, bgStyle]} />
        <TouchableOpacity
          style={styles.btn}
          onPress={() => onTabChange('top5')}
          activeOpacity={0.7}
        >
          <Text style={[styles.btnText, activeTab === 'top5' && styles.btnTextActive]}>
            🔥 Top 5 Imperdibles
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => onTabChange('miruta')}
          activeOpacity={0.7}
        >
          <Text style={[styles.btnText, activeTab === 'miruta' && styles.btnTextActive]}>
            💛 Tus Matches
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(20, 20, 20, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(214, 168, 72, 0.35)',
    borderRadius: radii.full,
    padding: 4,
    position: 'relative',
  },
  bg: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    backgroundColor: colors.primary,
    borderRadius: radii.full,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 8,
  },
  btn: {
    flex: 1,
    paddingVertical: 9.6,
    paddingHorizontal: 3.2,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  btnText: {
    color: colors.dateGold,
    fontWeight: '600',
    fontSize: 12,
  },
  btnTextActive: {
    color: colors.white,
    textShadowColor: 'rgba(255,255,255,0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});
