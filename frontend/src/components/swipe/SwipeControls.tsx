/**
 * SwipeControls — "Paso" and "Me interesa" action buttons
 */
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Line, Polygon } from 'react-native-svg';
import { colors } from '../../theme';

interface SwipeControlsProps {
  onReject: () => void;
  onMatch: () => void;
}

const XIcon = () => (
  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Line x1={18} y1={6} x2={6} y2={18} />
    <Line x1={6} y1={6} x2={18} y2={18} />
  </Svg>
);

const StarIcon = () => (
  <Svg width={28} height={28} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </Svg>
);

export const SwipeControls: React.FC<SwipeControlsProps> = ({ onReject, onMatch }) => {
  return (
    <View style={styles.controls}>
      {/* Reject */}
      <TouchableOpacity style={styles.btn} onPress={onReject} activeOpacity={0.8}>
        <View style={[styles.iconWrapper, styles.rejectIcon]}>
          <View style={{ color: colors.primary } as any}>
            <XIcon />
          </View>
        </View>
        <Text style={[styles.label, styles.rejectLabel]}>Paso</Text>
      </TouchableOpacity>

      {/* Match */}
      <TouchableOpacity style={styles.btn} onPress={onMatch} activeOpacity={0.8}>
        <View style={[styles.iconWrapper, styles.matchIcon]}>
          <View style={{ color: colors.secondary } as any}>
            <StarIcon />
          </View>
        </View>
        <Text style={[styles.label, styles.matchLabel]}>Me interesa</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 36,
    marginTop: 6,
  },
  btn: {
    alignItems: 'center',
    gap: 6,
    position: 'relative',
    zIndex: 100,
    top: -8,
  },
  iconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectIcon: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(160, 32, 240, 0.05)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  matchIcon: {
    borderColor: colors.secondary,
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  label: {
    fontSize: 14.4,
    fontWeight: '600',
    letterSpacing: 0.3,
    opacity: 1,
    position: 'relative',
    zIndex: 100,
  },
  rejectLabel: {
    color: colors.primary,
    textShadowColor: 'rgba(160, 32, 240, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  matchLabel: {
    color: colors.secondary,
    fontWeight: '700',
    textShadowColor: 'rgba(255, 215, 0, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});
