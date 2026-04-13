/**
 * DiscoverScreen — "Tu Ruta" swipe view
 * 3-state flow: Filters → Loading (TURUT animation) → Cards
 */
import React, { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent, Platform, Animated as RNAnimated, Easing, Dimensions, TouchableOpacity } from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { TurutHeader } from '../components/header/TurutHeader';
import { SwipeContainer } from '../components/swipe/SwipeContainer';
import { SwipeControls } from '../components/swipe/SwipeControls';
import { StyleChip } from '../components/ui/StyleChip';
import { GoldenButton } from '../components/ui/GoldenButton';
import { GlassCard } from '../components/ui/GlassCard';
import { destinations } from '../data/destinations';
import { useFavorites } from '../store/useFavorites';
import { colors, textStyles, layout, radii, shadows } from '../theme';

// ── Filter Options ──
const FILTER_OPTIONS = {
  experiencia: ['Naturaleza', 'Gastronomía', 'Cultura', 'Diversión'],
  nivel: ['Bajo', 'Medio', 'Alto'],
  presupuesto: ['$', '$$', '$$$'],
  tiempo: ['3 Horas', 'Fin de Semana', 'Noche'],
  quien: ['Solo', 'Pareja', 'Familia', 'Amigos'],
} as const;

type FilterKey = keyof typeof FILTER_OPTIONS;

interface FilterState {
  experiencia: string | null;
  nivel: string | null;
  presupuesto: string | null;
  tiempo: string | null;
  quien: string | null;
}

// ── TURUT Letter Reveal Animation Component ──
const TurutLoadingAnimation: React.FC<{ onComplete: () => void; duration?: number }> = ({ onComplete, duration = 3500 }) => {
  const letters = ['T', 'U', 'R', 'U', 'T'];
  const letterAnims = useRef(letters.map(() => new RNAnimated.Value(0))).current;
  const glowAnim = useRef(new RNAnimated.Value(0)).current;
  const containerScale = useRef(new RNAnimated.Value(0.9)).current;
  const messageOpacity = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    // Scale in the container
    RNAnimated.timing(containerScale, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start();

    // Sequentially reveal each letter
    const letterSequence = letterAnims.map((anim, i) =>
      RNAnimated.timing(anim, {
        toValue: 1,
        duration: 350,
        delay: i * 100,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    );

    // Message fade in
    const messageFade = RNAnimated.timing(messageOpacity, {
      toValue: 1,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    });

    // Glow pulse
    const glowPulse = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(glowAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        RNAnimated.timing(glowAnim, {
          toValue: 0.4,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    RNAnimated.stagger(80, letterSequence).start(() => {
      messageFade.start();
      glowPulse.start();
    });

    // Complete after duration
    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearTimeout(completeTimer);
    };
  }, []);

  const containerOpacity = glowAnim.interpolate({
    inputRange: [0.4, 1],
    outputRange: [0.8, 1],
  });

  return (
    <View style={loadingStyles.container}>
      <RNAnimated.View
        style={[
          loadingStyles.logoContainer,
          {
            transform: [{ scale: containerScale }],
            opacity: containerOpacity,
          },
        ]}
      >
        <View style={loadingStyles.letterRow}>
          {letters.map((letter, i) => {
            const scale = letterAnims[i].interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.3, 1.15, 1],
            });
            const opacity = letterAnims[i].interpolate({
              inputRange: [0, 0.3, 1],
              outputRange: [0, 0.6, 1],
            });
            const translateY = letterAnims[i].interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            });

            return (
              <RNAnimated.Text
                key={i}
                style={[
                  loadingStyles.letter,
                  {
                    opacity,
                    transform: [{ scale }, { translateY }],
                  },
                ]}
              >
                {letter}
              </RNAnimated.Text>
            );
          })}
        </View>
      </RNAnimated.View>

      <RNAnimated.Text
        style={[
          loadingStyles.message,
          { opacity: messageOpacity },
        ]}
      >
        ¿A dónde vamos?
      </RNAnimated.Text>

      {/* Decorative glowing ring */}
      <RNAnimated.View
        style={[
          loadingStyles.glowRing,
          {
            opacity: glowAnim.interpolate({
              inputRange: [0.4, 1],
              outputRange: [0.15, 0.4],
            }),
            transform: [{
              scale: glowAnim.interpolate({
                inputRange: [0.4, 1],
                outputRange: [0.95, 1.05],
              }),
            }],
          },
        ]}
      />
    </View>
  );
};

// ── Filter Section Component ──
const FilterSection: React.FC<{
  title: string;
  emoji: string;
  options: readonly string[];
  selected: string | null;
  onSelect: (value: string) => void;
}> = ({ title, emoji, options, selected, onSelect }) => (
  <View style={filterStyles.section}>
    <Text style={filterStyles.sectionTitle}>
      {emoji} {title}
    </Text>
    <View style={filterStyles.chipRow}>
      {options.map((option) => (
        <StyleChip
          key={option}
          label={option}
          active={selected === option}
          onPress={() => onSelect(option)}
        />
      ))}
    </View>
  </View>
);

// ── Main Screen ──
const DiscoverScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { swipePosition, advanceSwipe, addMatch } = useFavorites();
  const scrollRef = useRef<ScrollView>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  // ── 4-State Flow: Intro → Filters → Loading → Cards ──
  const [showIntro, setShowIntro] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // ── Filter State ──
  const [filters, setFilters] = useState<FilterState>({
    experiencia: null,
    nivel: null,
    presupuesto: null,
    tiempo: null,
    quien: null,
  });

  // Fade animation for transitions
  const fadeAnim = useRef(new RNAnimated.Value(1)).current;

  const currentIndex = swipePosition % destinations.length;
  const currentDest = destinations[currentIndex];

  const handleHeaderLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && height !== headerHeight) {
      setHeaderHeight(height);
    }
  };

  useEffect(() => {
    if (headerHeight > 0 && scrollRef.current) {
      const timer = setTimeout(() => {
        scrollRef.current?.scrollTo({ y: headerHeight, animated: true });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [headerHeight]);

  const handleSwipeLeft = useCallback(() => {
    advanceSwipe();
  }, [advanceSwipe]);

  const handleSwipeRight = useCallback(() => {
    addMatch(currentIndex);
    navigation.navigate('Landing', { destIndex: currentIndex });
    advanceSwipe();
  }, [addMatch, advanceSwipe, currentIndex, navigation]);

  // ── Filter Handlers ──
  const updateFilter = useCallback((key: FilterKey, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key] === value ? null : value,  // Toggle behavior
    }));
  }, []);

  const handleSearch = useCallback(() => {
    // Fade out filters
    RNAnimated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsLoading(true);
      fadeAnim.setValue(1);
    });
  }, [fadeAnim]);

  const handleLoadingComplete = useCallback(() => {
    // Fade out loading
    RNAnimated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setIsLoading(false);
      setShowResults(true);
      fadeAnim.setValue(1);
    });
  }, [fadeAnim]);

  const handleBackToFilters = useCallback(() => {
    RNAnimated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowResults(false);
      setIsLoading(false);
      fadeAnim.setValue(1);
    });
  }, [fadeAnim]);

  const hasAnyFilter = useMemo(() =>
    Object.values(filters).some(v => v !== null),
    [filters]
  );

  // ── Render: Intro Splash ──
  if (showIntro) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <RNAnimated.View style={[styles.loadingWrapper, { opacity: fadeAnim }]}>
          <TurutLoadingAnimation
            duration={4000}
            onComplete={() => {
              RNAnimated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }).start(() => {
                setShowIntro(false);
                fadeAnim.setValue(1);
              });
            }}
          />
        </RNAnimated.View>
      </SafeAreaView>
    );
  }

  // ── Render: Loading State (after Buscar) ──
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <RNAnimated.View style={[styles.loadingWrapper, { opacity: fadeAnim }]}>
          <TurutLoadingAnimation duration={2500} onComplete={handleLoadingComplete} />
        </RNAnimated.View>
      </SafeAreaView>
    );
  }

  // ── Render: Results (Cards) ──
  if (showResults) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <RNAnimated.View style={{ flex: 1, opacity: fadeAnim }}>
          <ScrollView
            ref={scrollRef}
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
            nestedScrollEnabled={true}
            keyboardShouldPersistTaps="handled"
            {...(Platform.OS === 'web' ? {
              dataSet: { testid: 'discover-scroll' },
            } : {})}
          >
            <View onLayout={handleHeaderLayout}>
              <TurutHeader />
            </View>

            <View style={styles.titleContainer}>
              <Text style={[textStyles.headlineLarge, styles.titleText]}>
                ¿A dónde vamos?
              </Text>
              {/* Back to filters button */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBackToFilters}
                activeOpacity={0.7}
              >
                <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <Line x1="4" y1="21" x2="4" y2="14" />
                  <Line x1="4" y1="10" x2="4" y2="3" />
                  <Line x1="12" y1="21" x2="12" y2="12" />
                  <Line x1="12" y1="8" x2="12" y2="3" />
                  <Line x1="20" y1="21" x2="20" y2="16" />
                  <Line x1="20" y1="12" x2="20" y2="3" />
                  <Line x1="1" y1="14" x2="7" y2="14" />
                  <Line x1="9" y1="8" x2="15" y2="8" />
                  <Line x1="17" y1="16" x2="23" y2="16" />
                </Svg>
                <Text style={styles.backButtonText}>Cambiar filtros</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              <SwipeContainer
                destination={currentDest}
                currentIndex={currentIndex}
                total={destinations.length}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
              />
              <SwipeControls
                onReject={handleSwipeLeft}
                onMatch={handleSwipeRight}
              />
            </View>
          </ScrollView>
        </RNAnimated.View>
      </SafeAreaView>
    );
  }

  // ── Render: Filters ──
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <RNAnimated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.filterScrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
          keyboardShouldPersistTaps="handled"
          {...(Platform.OS === 'web' ? {
            dataSet: { testid: 'discover-filters-scroll' },
          } : {})}
        >
          <View onLayout={handleHeaderLayout}>
            <TurutHeader />
          </View>

          <View style={styles.titleContainer}>
            <Text style={[textStyles.headlineLarge, styles.titleText]}>
              ¿A dónde vamos?
            </Text>
            <Text style={styles.subtitle}>
              Personaliza tu experiencia
            </Text>
          </View>

          {/* Filters Card */}
          <GlassCard style={filterStyles.card} neon="primary">
            <FilterSection
              title="Experiencia"
              emoji="🌿"
              options={FILTER_OPTIONS.experiencia}
              selected={filters.experiencia}
              onSelect={(v) => updateFilter('experiencia', v)}
            />

            <View style={filterStyles.divider} />

            <FilterSection
              title="Nivel Físico"
              emoji="⚡"
              options={FILTER_OPTIONS.nivel}
              selected={filters.nivel}
              onSelect={(v) => updateFilter('nivel', v)}
            />

            <View style={filterStyles.divider} />

            <FilterSection
              title="Presupuesto"
              emoji="💰"
              options={FILTER_OPTIONS.presupuesto}
              selected={filters.presupuesto}
              onSelect={(v) => updateFilter('presupuesto', v)}
            />

            <View style={filterStyles.divider} />

            <FilterSection
              title="Tiempo"
              emoji="⏱"
              options={FILTER_OPTIONS.tiempo}
              selected={filters.tiempo}
              onSelect={(v) => updateFilter('tiempo', v)}
            />

            <View style={filterStyles.divider} />

            <FilterSection
              title="¿Quién va?"
              emoji="👥"
              options={FILTER_OPTIONS.quien}
              selected={filters.quien}
              onSelect={(v) => updateFilter('quien', v)}
            />
          </GlassCard>

          {/* Search Button */}
          <View style={filterStyles.buttonContainer}>
            <GoldenButton
              label="Buscar"
              onPress={handleSearch}
            />
          </View>
        </ScrollView>
      </RNAnimated.View>
    </SafeAreaView>
  );
};

// ── Filter Styles ──
const filterStyles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    padding: 20,
    gap: 4,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    ...textStyles.bodySemiBold,
    color: colors.textSecondary,
    fontSize: 13,
    letterSpacing: 0.3,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  divider: {
    height: 1,
    backgroundColor: colors.outlineVariant,
    marginVertical: 8,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: layout.bottomNavHeight + 40,
  },
});

// ── Loading Styles ──
const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontFamily: Platform.OS === 'web' ? "'Orbitron', sans-serif" : 'Orbitron-Black',
    fontWeight: '900',
    fontSize: 48,
    color: '#F8F0FF',
    letterSpacing: 6,
    ...Platform.select({
      web: {
        textShadow: `
          0 0 5px #fff,
          0 0 10px #fff,
          0 0 20px #B026FF,
          0 0 40px #A020F0,
          0 0 80px #A020F0
        `,
      } as any,
      default: {
        textShadowColor: colors.primary,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 18,
      },
    }),
  },
  message: {
    ...textStyles.headlineMedium,
    color: colors.textPrimary,
    marginTop: 32,
    textShadowColor: colors.primaryGlow,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  glowRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
    ...shadows.neonPrimary,
  },
});

// ── Main Styles ──
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#050505',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: layout.bottomNavHeight + 24,
    minHeight: '100%' as any,
  },
  filterScrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
    minHeight: '100%' as any,
  },
  loadingWrapper: {
    flex: 1,
  },
  titleContainer: {
    marginTop: 8,
    marginBottom: 16,
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 60,
  },
  titleText: {
    color: colors.textPrimary,
    textAlign: 'center',
    textShadowColor: colors.primaryGlow,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  subtitle: {
    ...textStyles.body,
    color: colors.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: radii.full,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: 'rgba(160, 32, 240, 0.08)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 4,
  },
  backButtonText: {
    ...textStyles.bodySemiBold,
    color: colors.primary,
    fontSize: 13,
    letterSpacing: 0.3,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    ...(Platform.OS === 'web' ? { touchAction: 'pan-y' } as any : {}),
  },
});

export default DiscoverScreen;
