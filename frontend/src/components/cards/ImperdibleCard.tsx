/**
 * ImperdibleCard — Hero backdrop card for "Imperdibles" view
 * Full-width card with background image, gradient overlay, bookmark, and metadata
 *
 * Enhancements:
 * - First card rendered as "Hero" (taller, with tagline)
 * - Category color chip overlay
 * - SVG bookmark icon instead of emoji
 * - Press-in scale feedback (0.97)
 * - Review count next to rating
 * - Animated "pop" when toggling favorite
 */
import React, { useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, shadows, radii } from '../../theme';
import { categoryColors } from '../../theme/colors';
import type { Destination } from '../../data/destinations';

const MapPinSmall = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <Circle cx={12} cy={10} r={3} />
  </Svg>
);

/** SVG Bookmark / Star icon — filled when active */
const BookmarkIcon = ({ filled }: { filled: boolean }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill={filled ? '#FFD700' : 'none'} stroke={filled ? '#FFD700' : 'rgba(255,255,255,0.7)'} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
  </Svg>
);

interface ImperdibleCardProps {
  destination: Destination;
  index: number;
  isFavorite: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
  /** If true, renders as a larger hero card */
  isHero?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ImperdibleCard: React.FC<ImperdibleCardProps> = ({
  destination,
  index,
  isFavorite,
  onPress,
  onToggleFavorite,
  isHero = false,
}) => {
  // ── Press feedback animation ──
  const pressScale = useSharedValue(1);
  const pressAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
  }));

  const handlePressIn = useCallback(() => {
    pressScale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
  }, []);

  const handlePressOut = useCallback(() => {
    // Bounce up slightly before navigating — creates a "launch" feel
    pressScale.value = withSequence(
      withSpring(1.02, { damping: 12, stiffness: 250 }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );
  }, []);

  // ── Favorite "pop" animation ──
  const favScale = useSharedValue(1);
  const favAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: favScale.value }],
  }));

  const handleToggleFavorite = useCallback(() => {
    favScale.value = withSequence(
      withSpring(1.4, { damping: 4, stiffness: 300 }),
      withSpring(1, { damping: 8, stiffness: 200 })
    );
    onToggleFavorite();
  }, [onToggleFavorite]);

  // ── Category chip colors ──
  const catColors = categoryColors[destination.category] ?? {
    bg: 'rgba(255,255,255,0.15)',
    text: '#FFFFFF',
    border: 'rgba(255,255,255,0.2)',
  };

  const cardHeight = isHero ? 280 : 200;

  return (
    <Animated.View entering={FadeInDown.delay(index * 80).duration(450).springify()}>
      <AnimatedPressable
        style={[styles.card, { height: cardHeight }, pressAnimStyle]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        {/* Background Image */}
        <View style={styles.bgImg}>
          <Image source={destination.img} style={styles.img} resizeMode="cover" resizeMethod="resize" />
        </View>

        {/* ── Category Chip (top-left) ── */}
        <View
          style={[
            styles.categoryChip,
            {
              backgroundColor: catColors.bg,
              borderColor: catColors.border,
            },
          ]}
        >
          <Text style={[styles.categoryText, { color: catColors.text }]}>
            {destination.category}
          </Text>
        </View>

        {/* ── Discount Badge (if discount > 0 and hero) ── */}
        {isHero && destination.discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{destination.discount}%</Text>
          </View>
        )}

        {/* ── Bookmark (SVG, animated pop) ── */}
        <Animated.View style={[styles.bookmarkContainer, favAnimStyle]}>
          <TouchableOpacity
            style={[
              styles.bookmark,
              isFavorite && styles.bookmarkActive,
            ]}
            onPress={(e) => {
              e.stopPropagation?.();
              handleToggleFavorite();
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <BookmarkIcon filled={isFavorite} />
          </TouchableOpacity>
        </Animated.View>

        {/* Content */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.95)']}
          style={styles.content}
        >
          <View style={styles.info}>
            {/* Tagline (hero only) */}
            {isHero && destination.tagline && (
              <Text style={styles.tagline} numberOfLines={1}>
                {destination.tagline}
              </Text>
            )}
            <View style={styles.nameRow}>
              <Text style={[styles.name, isHero && styles.nameHero]} numberOfLines={1}>
                {destination.name}
              </Text>
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingText}>★ {destination.rating}</Text>
                {destination.reviewCount && (
                  <Text style={styles.reviewCount}>({destination.reviewCount})</Text>
                )}
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
      </AnimatedPressable>
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
  // ── Category chip ──
  categoryChip: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    zIndex: 10,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  // ── Discount Badge ──
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 'auto' as any,
    right: 64,
    backgroundColor: colors.accentUrgent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  // ── Bookmark ──
  bookmarkContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  bookmark: {
    width: 38,
    height: 38,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkActive: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: 'rgba(255, 215, 0, 0.5)',
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
  tagline: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
    opacity: 0.9,
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
  nameHero: {
    fontSize: 22,
    fontWeight: '800',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '600',
  },
  reviewCount: {
    fontSize: 10,
    color: 'rgba(255, 215, 0, 0.6)',
    fontWeight: '500',
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
