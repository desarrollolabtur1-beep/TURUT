/**
 * OnboardingScreen — 3-slide swipeable welcome for new users
 *
 * Slides:
 * 1. "Descubre destinos únicos" — with card animation
 * 2. "Personaliza tu experiencia" — filters preview
 * 3. "Activa bonos exclusivos" — golden CTA
 *
 * Uses AsyncStorage to only show once.
 */
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { colors, textStyles, radii, shadows } from '../../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ── SVG Illustrations ──
const DiscoverIllustration = () => {
  const float = useSharedValue(0);
  useEffect(() => {
    float.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: interpolate(float.value, [0, 1], [0, -12]) }],
  }));

  return (
    <Animated.View style={[styles.illustration, floatStyle]}>
      <Svg width={200} height={160} viewBox="0 0 200 160">
        {/* Card stack */}
        <G>
          {/* Back card */}
          <Rect x={55} y={20} width={100} height={130} rx={16} fill="rgba(160, 32, 240, 0.15)" stroke={colors.primary} strokeWidth={1} />
          {/* Middle card */}
          <Rect x={42} y={12} width={100} height={130} rx={16} fill="rgba(160, 32, 240, 0.25)" stroke={colors.primary} strokeWidth={1.5} />
          {/* Front card */}
          <Rect x={28} y={4} width={100} height={130} rx={16} fill="rgba(5,5,5,0.9)" stroke={colors.primary} strokeWidth={2} />
          {/* Card content lines */}
          <Rect x={40} y={85} width={60} height={4} rx={2} fill="rgba(255,255,255,0.3)" />
          <Rect x={40} y={95} width={40} height={3} rx={1.5} fill="rgba(255,255,255,0.15)" />
          {/* Star on card */}
          <Path d="M78 40 l5.5 11 12 1.7-8.7 8.5 2 12L78 67l-10.8 5.7 2-12-8.7-8.5 12-1.7z" fill={colors.secondary} opacity={0.8} />
        </G>
        {/* Sparkles */}
        <Circle cx={155} cy={30} r={3} fill={colors.secondary} opacity={0.6} />
        <Circle cx={20} cy={60} r={2} fill={colors.primary} opacity={0.5} />
        <Circle cx={170} cy={100} r={2.5} fill={colors.primary} opacity={0.4} />
      </Svg>
    </Animated.View>
  );
};

const PersonalizeIllustration = () => {
  const pulse = useSharedValue(0);
  useEffect(() => {
    pulse.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: interpolate(pulse.value, [0, 1], [0.6, 1]),
    transform: [{ scale: interpolate(pulse.value, [0, 1], [0.95, 1.05]) }],
  }));

  return (
    <Animated.View style={[styles.illustration, pulseStyle]}>
      <Svg width={200} height={160} viewBox="0 0 200 160">
        {/* Filter chips */}
        <Rect x={20} y={50} width={70} height={28} rx={14} fill="rgba(160, 32, 240, 0.3)" stroke={colors.primary} strokeWidth={1.5} />
        <Rect x={100} y={50} width={80} height={28} rx={14} fill="rgba(255, 215, 0, 0.2)" stroke={colors.secondary} strokeWidth={1} />
        <Rect x={40} y={90} width={60} height={28} rx={14} fill="rgba(160, 32, 240, 0.2)" stroke={colors.primary} strokeWidth={1} />
        <Rect x={110} y={90} width={55} height={28} rx={14} fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
        {/* Checkmark on first chip */}
        <Path d="M40 64 L48 72 L60 56" stroke={colors.primary} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        {/* Compass */}
        <Circle cx={100} cy={30} r={18} stroke="rgba(255,255,255,0.2)" strokeWidth={1} fill="none" />
        <Path d="M100 16 L100 22 M100 38 L100 44 M86 30 L92 30 M108 30 L114 30" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
        <Path d="M96 26 L104 34 L96 34 L104 26 Z" fill={colors.primary} opacity={0.6} />
      </Svg>
    </Animated.View>
  );
};

const BonusIllustration = () => {
  const glow = useSharedValue(0);
  useEffect(() => {
    glow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500, easing: Easing.out(Easing.ease) }),
        withTiming(0.3, { duration: 1500, easing: Easing.in(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
    transform: [{ scale: interpolate(glow.value, [0.3, 1], [0.9, 1.1]) }],
  }));

  return (
    <Animated.View style={[styles.illustration, glowStyle]}>
      <Svg width={200} height={160} viewBox="0 0 200 160">
        {/* Gift box */}
        <Rect x={60} y={60} width={80} height={60} rx={8} fill="rgba(255, 215, 0, 0.15)" stroke={colors.secondary} strokeWidth={2} />
        <Rect x={55} y={50} width={90} height={16} rx={4} fill="rgba(255, 215, 0, 0.2)" stroke={colors.secondary} strokeWidth={2} />
        {/* Ribbon */}
        <Rect x={96} y={50} width={8} height={70} fill="rgba(255, 215, 0, 0.3)" />
        {/* Bow */}
        <Path d="M100 50 Q85 30 90 20 Q95 30 100 40 Q105 30 110 20 Q115 30 100 50" fill={colors.secondary} opacity={0.7} />
        {/* Percentage */}
        <G>
          <Circle cx={85} cy={90} r={8} stroke={colors.secondary} strokeWidth={1.5} fill="none" />
          <Circle cx={115} cy={80} r={8} stroke={colors.secondary} strokeWidth={1.5} fill="none" />
          <Path d="M80 95 L120 75" stroke={colors.secondary} strokeWidth={1.5} />
        </G>
        {/* Sparkles */}
        <Circle cx={40} cy={40} r={3} fill={colors.secondary} opacity={0.5} />
        <Circle cx={160} cy={50} r={2.5} fill={colors.secondary} opacity={0.4} />
        <Circle cx={150} cy={110} r={2} fill={colors.primary} opacity={0.3} />
      </Svg>
    </Animated.View>
  );
};

// ── Slide data ──
const slides = [
  {
    id: '1',
    title: 'Descubre destinos\núnicos',
    description: 'Explora experiencias locales increíbles cerca de ti. Naturaleza, café, gastronomía y aventura.',
    Illustration: DiscoverIllustration,
    accentColor: colors.primary,
  },
  {
    id: '2',
    title: 'Personaliza tu\nexperiencia',
    description: 'Desliza, filtra y encuentra los destinos que van contigo. La app aprende de tus gustos.',
    Illustration: PersonalizeIllustration,
    accentColor: colors.primary,
  },
  {
    id: '3',
    title: 'Activa bonos\nexclusivos',
    description: 'Descuentos únicos y beneficios especiales en cada destino. Solo para usuarios TURUT.',
    Illustration: BonusIllustration,
    accentColor: colors.secondary,
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / SCREEN_WIDTH);
    if (idx >= 0 && idx < slides.length) {
      setActiveIndex(idx);
    }
  }, []);

  const handleNext = useCallback(() => {
    if (activeIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
    } else {
      onComplete();
    }
  }, [activeIndex, onComplete]);

  const handleSkip = useCallback(() => {
    onComplete();
  }, [onComplete]);

  const isLastSlide = activeIndex === slides.length - 1;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(15,0,25,1)', 'rgba(5,5,5,1)']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Skip button */}
      <SafeAreaView edges={['top']} style={styles.skipContainer}>
        {!isLastSlide && (
          <Animated.View entering={FadeIn.duration(400)}>
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={styles.skipText}>Saltar</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </SafeAreaView>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.slide}>
            <View style={styles.slideContent}>
              <item.Illustration />
              <Animated.Text
                entering={FadeInUp.delay(200).duration(500)}
                style={styles.slideTitle}
              >
                {item.title}
              </Animated.Text>
              <Animated.Text
                entering={FadeInUp.delay(400).duration(500)}
                style={styles.slideDescription}
              >
                {item.description}
              </Animated.Text>
            </View>
          </View>
        )}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      {/* Bottom controls */}
      <SafeAreaView edges={['bottom']} style={styles.bottomContainer}>
        {/* Dots */}
        <View style={styles.dotsContainer}>
          {slides.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === activeIndex && [
                  styles.dotActive,
                  { backgroundColor: slides[activeIndex].accentColor },
                  {
                    shadowColor: slides[activeIndex].accentColor,
                  },
                ],
              ]}
            />
          ))}
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.85}
          style={[
            styles.ctaButton,
            isLastSlide && styles.ctaButtonGolden,
          ]}
        >
          <Text style={[styles.ctaText, isLastSlide && styles.ctaTextGolden]}>
            {isLastSlide ? '¡Empezar!' : 'Siguiente'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  skipContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
  },
  skipButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  skipText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  slide: {
    width: SCREEN_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 24,
  },
  illustration: {
    marginBottom: 8,
  },
  slideTitle: {
    ...textStyles.headlineLarge,
    color: colors.textPrimary,
    textAlign: 'center',
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  slideDescription: {
    ...textStyles.body,
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    maxWidth: 300,
  },
  bottomContainer: {
    paddingHorizontal: 40,
    paddingBottom: 20,
    gap: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  dotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 6,
  },
  ctaButtonGolden: {
    backgroundColor: colors.secondary,
    shadowColor: colors.secondary,
  },
  ctaText: {
    ...textStyles.bodyBold,
    color: colors.onPrimary,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  ctaTextGolden: {
    color: colors.onSecondary,
  },
});

export default OnboardingScreen;
