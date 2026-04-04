/**
 * ImperdibleCard — Hero backdrop card for "Imperdibles" view
 * Full-width card with background image, gradient overlay, bookmark, and metadata
 */
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, shadows, radii } from '../../theme';
import type { Destination } from '../../data/destinations';

const MapPinSmall = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <Circle cx={12} cy={10} r={3} />
  </Svg>
);

interface ImperdibleCardProps {
  destination: Destination;
  index: number;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
}

export const ImperdibleCard: React.FC<ImperdibleCardProps> = ({
  destination,
  index,
  isFavorite,
  onPress,
  onToggleFavorite,
}) => {
  return (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(450).springify()}>
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.95}>
        {/* Background Image */}
        <View style={styles.bgImg}>
          <Image source={destination.img} style={styles.img} resizeMode="cover" />
          {/* Gradient Overlay */}
          <View style={styles.gradient} />
        </View>

        {/* Bookmark */}
        <TouchableOpacity
          style={[
            styles.bookmark,
            isFavorite && styles.bookmarkActive,
          ]}
          onPress={(e) => {
            e.stopPropagation?.();
            onToggleFavorite();
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={[styles.bookmarkIcon, isFavorite && styles.bookmarkIconActive]}>
            ⭐
          </Text>
        </TouchableOpacity>

        {/* Content */}
        <LinearGradient 
          colors={['transparent', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.95)']} 
          style={styles.content}
        >
          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>
                {destination.name}
              </Text>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>★ {destination.rating}</Text>
              </View>
            </View>
            <Text style={styles.meta}>
              {destination.category} · {destination.distance}
            </Text>
          </View>
          <View style={styles.pinBtn}>
            <MapPinSmall />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    ...shadows.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  bgImg: {
    ...StyleSheet.absoluteFillObject,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    // Simulated gradient overlay using multiple layers
    // RN doesn't support CSS gradients natively, so we use a semi-transparent overlay
    // A LinearGradient could be used here for better results
    opacity: 1,
    // Fallback: dark overlay from bottom
    borderRadius: 0,
  },
  bookmark: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    backgroundColor: 'rgba(160, 32, 240, 0.2)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  bookmarkActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: colors.secondary,
  },
  bookmarkIcon: {
    fontSize: 14,
    opacity: 0.5,
  },
  bookmarkIconActive: {
    opacity: 1,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  info: {
    flex: 1,
    paddingRight: 16,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  name: {
    color: colors.white,
    fontSize: 18.4,
    fontWeight: '700',
    flexShrink: 1,
  },
  ratingBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '600',
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 12.8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '600',
  },
  pinBtn: {
    width: 36,
    height: 36,
    backgroundColor: colors.secondary,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
});
