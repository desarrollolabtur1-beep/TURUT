/**
 * GoldenButton — Premium CTA with pulse animation
 */
import React, { useEffect } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors, radii } from '../../theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface GoldenButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'default' | 'success';
}

export const GoldenButton: React.FC<GoldenButtonProps> = ({
  label,
  onPress,
  disabled,
  variant = 'default',
}) => {
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    if (variant === 'default') {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }
  }, [variant]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const isSuccess = variant === 'success';

  return (
    <AnimatedTouchable
      style={[
        styles.btn,
        isSuccess && styles.btnSuccess,
        animStyle,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled}
    >
      <Text style={[styles.label, isSuccess && styles.labelSuccess]}>{label}</Text>
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    height: 56,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 32,
    elevation: 8,
  },
  btnSuccess: {
    backgroundColor: '#34D399',
    shadowColor: '#34D399',
  },
  label: {
    fontFamily: 'Montserrat-ExtraBold',
    fontWeight: '800',
    fontSize: 17.6,
    color: colors.onSecondary,
    textTransform: 'uppercase',
    letterSpacing: -0.16,
  },
  labelSuccess: {
    color: '#004828',
  },
});
