/**
 * HomeScreen — "Imperdibles" main view
 * Enhanced with:
 * - Hero Carousel (auto-scroll featured destinations)
 * - Stories row (destination circles with neon border)
 * - First card as "Hero" variant
 * - Premium empty state with CTA
 */
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  FlatList as RNFlatList,
  Platform,
  Modal,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  withRepeat,
  withTiming,
  Easing,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';
import { TurutHeader } from '../components/header/TurutHeader';
import { SegmentControl } from '../components/ui/SegmentControl';
import { StyleChip } from '../components/ui/StyleChip';
import { ImperdibleCard } from '../components/cards/ImperdibleCard';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { destinations, categories, type Destination } from '../data/destinations';
import { useFavorites } from '../store/useFavorites';
import { colors, layout, textStyles } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CONTAINER_WIDTH = Platform.OS === 'web' ? Math.min(SCREEN_WIDTH, layout.mobileMaxWidth) : SCREEN_WIDTH;
const CAROUSEL_HEIGHT = 220;
const STORY_SIZE = 68;

const AnimatedFlatList = Animated.createAnimatedComponent(RNFlatList);

type SegmentTab = 'top5' | 'miruta';

// ── Compass SVG for empty state ──
const CompassIcon = ({ size = 64 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round" opacity={0.4}>
    <Circle cx={12} cy={12} r={10} />
    <Path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
  </Svg>
);

const ChevronLeftIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="m15 18-6-6 6-6" />
  </Svg>
);

const ChevronRightIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="m9 18 6-6-6-6" />
  </Svg>
);

const CloseIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 6 6 18" />
    <Path d="m6 6 12 12" />
  </Svg>
);

// ── Story Circle Component ──
const StoryCircle: React.FC<{
  destination: (typeof destinations)[0];
  index: number;
  onPress: () => void;
}> = ({ destination, index, onPress }) => {
  const borderGlow = useSharedValue(0.5);

  useEffect(() => {
    borderGlow.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    borderColor: `rgba(160, 32, 240, ${0.4 + borderGlow.value * 0.4})`,
    shadowOpacity: borderGlow.value * 0.6,
  }));

  return (
    <Animated.View entering={FadeIn.delay(index * 100).duration(400)}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.storyWrapper}
      >
        <Animated.View style={[styles.storyRing, glowStyle]}>
          <Image
            source={destination.img}
            style={styles.storyImage}
            resizeMode="cover"
            resizeMethod="resize"
          />
        </Animated.View>
        <Text style={styles.storyLabel} numberOfLines={1}>
          {destination.name.split(' ')[0]}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ── Hero Carousel Component ──
const HeroCarousel: React.FC<{
  featuredDestinations: (typeof destinations);
  onPress: (destIndex: number) => void;
}> = ({ featuredDestinations, onPress }) => {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (featuredDestinations.length <= 1) return;
    autoScrollTimer.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % featuredDestinations.length;
        scrollRef.current?.scrollTo({
          x: next * (CONTAINER_WIDTH - 48),
          animated: true,
        });
        return next;
      });
    }, 4000);
    return () => {
      if (autoScrollTimer.current) clearInterval(autoScrollTimer.current);
    };
  }, [featuredDestinations.length]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const idx = Math.round(x / (CONTAINER_WIDTH - 48));
      if (idx !== activeIndex && idx >= 0 && idx < featuredDestinations.length) {
        setActiveIndex(idx);
      }
    },
    [activeIndex, featuredDestinations.length]
  );

  return (
    <Animated.View
      entering={FadeInDown.duration(600).springify()}
      style={styles.carouselContainer}
    >
      <ScrollView
        ref={scrollRef as any}
        horizontal
        pagingEnabled={false}
        decelerationRate="fast"
        snapToInterval={CONTAINER_WIDTH - 48}
        snapToAlignment="start"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselScroll}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {featuredDestinations.map((dest, idx) => {
          const globalIndex = destinations.indexOf(dest);
          return (
            <TouchableOpacity
              key={dest.id}
              activeOpacity={0.9}
              onPress={() => onPress(globalIndex)}
              style={styles.carouselCard}
            >
              <Image
                source={dest.img}
                style={styles.carouselImage}
                resizeMode="cover"
                resizeMethod="resize"
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.85)']}
                style={styles.carouselGradient}
              >
                {dest.discount > 0 && (
                  <View style={styles.carouselDiscountBadge}>
                    <Text style={styles.carouselDiscountText}>
                      -{dest.discount}% BONO
                    </Text>
                  </View>
                )}
                <View style={styles.carouselInfo}>
                  {dest.tagline && (
                    <Text style={styles.carouselTagline}>{dest.tagline}</Text>
                  )}
                  <Text style={styles.carouselName} numberOfLines={1}>
                    {dest.name}
                  </Text>
                  <View style={styles.carouselMeta}>
                    <Text style={styles.carouselRating}>
                      ★ {dest.rating}
                    </Text>
                    <Text style={styles.carouselDistance}>
                      · {dest.distance}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Dots indicator */}
      {featuredDestinations.length > 1 && (
        <View style={styles.dotsContainer}>
          {featuredDestinations.map((_, idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                idx === activeIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>
      )}
    </Animated.View>
  );
};

// ── Main Screen ──
const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { isFavorite, toggleFavorite, getCombinedIds, loaded } = useFavorites();

  const [activeTab, setActiveTab] = useState<SegmentTab>('top5');
  const [activeFilter, setActiveFilter] = useState('all');

  // Fullscreen gallery modal state
  const [galleryModalVisible, setGalleryModalVisible] = useState(false);
  const [selectedDestIndex, setSelectedDestIndex] = useState<number | null>(null);
  const [modalGalleryIndex, setModalGalleryIndex] = useState(0);
  const modalFlatListRef = useRef<RNFlatList>(null);

  // Featured destinations for carousel
  const featuredDests = useMemo(
    () => destinations.filter((d) => d.featured),
    []
  );

  const filteredData = useMemo(() => {
    let source = destinations;

    // If "Tus Matches" tab, only show favorites + matches
    if (activeTab === 'miruta') {
      const ids = getCombinedIds();
      source = destinations.filter((_, i) => ids.includes(i));
    }

    // Apply category filter
    if (activeFilter && activeFilter !== 'all') {
      source = source.filter((d) => d.category === activeFilter);
    }

    return source;
  }, [activeTab, activeFilter, getCombinedIds]);

  const selectedDestination = selectedDestIndex !== null ? destinations[selectedDestIndex] : null;

  const modalImages = useMemo(() => {
    if (!selectedDestination) return [];
    if (selectedDestination.imperdiblesGallery && selectedDestination.imperdiblesGallery.length > 0) {
      return selectedDestination.imperdiblesGallery;
    }
    if (selectedDestination.gallery && selectedDestination.gallery.length > 0) {
      return selectedDestination.gallery;
    }
    return [selectedDestination.img];
  }, [selectedDestination]);

  const handleCardPress = useCallback(
    (destIndex: number) => {
      setSelectedDestIndex(destIndex);
      setModalGalleryIndex(0);
      setGalleryModalVisible(true);
    },
    []
  );

  const filterChips = useMemo(
    () => [{ label: 'Todos', filter: 'all' }, ...categories.map((c) => ({ label: c === 'Gastronomía' ? 'Gastro' : c, filter: c }))],
    []
  );

  // ── Parallax scroll tracking ──
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, 120],
      [1, 0.92],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.7],
      Extrapolation.CLAMP
    );
    const translateY = interpolate(
      scrollY.value,
      [0, 150],
      [0, -20],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ scale }, { translateY }],
      opacity,
    };
  });

  const titleAnimatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [0, 100],
      [0, -10],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.9],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ translateY }, { scale }],
    };
  });

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <CompassIcon />
      <Text style={styles.emptyTitle}>Tu ruta está vacía</Text>
      <Text style={styles.emptyText}>
        Desliza en "Tu Ruta" para descubrir{'\n'}experiencias increíbles cerca de ti
      </Text>
      <TouchableOpacity
        style={styles.emptyCta}
        onPress={() => navigation.navigate('Tu Ruta')}
        activeOpacity={0.8}
      >
        <Text style={styles.emptyCtaText}>Explorar destinos</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <AnimatedFlatList
        data={loaded ? filteredData : []}
        keyExtractor={(item: any) => item.id.toString()}
        ListHeaderComponent={
          <>
            {/* Header with parallax */}
            <Animated.View style={headerAnimatedStyle}>
              <TurutHeader />
            </Animated.View>

            {/* Title with parallax */}
            <Animated.Text style={[textStyles.headlineLarge, styles.titleText, titleAnimatedStyle]}>Imperdibles</Animated.Text>

            {/* ── Hero Carousel ── */}
            {activeTab === 'top5' && featuredDests.length > 0 && (
              <HeroCarousel
                featuredDestinations={featuredDests}
                onPress={handleCardPress}
              />
            )}

            {/* ── Stories Row ── */}
            {activeTab === 'top5' && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.storiesRow}
                style={styles.storiesContainer}
              >
                {destinations.map((dest, idx) => (
                  <StoryCircle
                    key={dest.id}
                    destination={dest}
                    index={idx}
                    onPress={() => handleCardPress(idx)}
                  />
                ))}
              </ScrollView>
            )}

            {/* Segmented Control */}
            <SegmentControl activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Filter Chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsRow}
              style={styles.chipsContainer}
            >
              {filterChips.map((chip) => (
                <StyleChip
                  key={chip.filter}
                  label={chip.label}
                  active={activeFilter === chip.filter}
                  onPress={() => setActiveFilter(chip.filter)}
                />
              ))}
            </ScrollView>
          </>
        }
        renderItem={({ item, index }: any) => {
          const dest = item as Destination;
          const destIndex = destinations.indexOf(dest);
          return (
            <View style={styles.cardPadding}>
              <ImperdibleCard
                destination={dest}
                index={index}
                isFavorite={isFavorite(destIndex)}
                onPress={() => handleCardPress(destIndex)}
                onToggleFavorite={() => toggleFavorite(destIndex)}
                isHero={index === 0}
              />
            </View>
          );
        }}
        ListEmptyComponent={
          loaded ? (
            renderEmpty()
          ) : (
            <View style={styles.skeletonList}>
              {[0, 1, 2, 3, 4].map((i) => (
                <View key={i} style={styles.cardPadding}>
                  <SkeletonCard type="dest" />
                </View>
              ))}
            </View>
          )
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />

      {/* Fullscreen Interactive Gallery Modal */}
      <Modal
        visible={galleryModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setGalleryModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalSafeArea} edges={['top', 'bottom', 'left', 'right']}>
            <View style={styles.modalContainer}>
              
              {/* Header: Title and Close button */}
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderTitleContainer}>
                  <Text style={styles.modalDestCategory}>
                    {selectedDestination?.category.toUpperCase()} Y PAISAJE
                  </Text>
                  <Text style={styles.modalDestName} numberOfLines={1}>
                    {selectedDestination?.name}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setGalleryModalVisible(false)}
                  activeOpacity={0.8}
                >
                  <CloseIcon />
                </TouchableOpacity>
              </View>

              {/* Core Image Carousel */}
              <View style={styles.modalCarouselContainer}>
                {modalImages.length > 0 ? (
                  <RNFlatList
                    ref={modalFlatListRef}
                    data={modalImages}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(_, i) => `modal-gallery-${i}`}
                    style={styles.modalFlatList}
                    contentContainerStyle={styles.modalFlatListContent}
                    onScroll={useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
                      const x = e.nativeEvent.contentOffset.x;
                      const idx = Math.round(x / CONTAINER_WIDTH);
                      if (idx >= 0 && idx < modalImages.length && idx !== modalGalleryIndex) {
                        setModalGalleryIndex(idx);
                      }
                    }, [modalImages.length, modalGalleryIndex])}
                    scrollEventThrottle={16}
                    getItemLayout={(_, index) => ({
                      length: CONTAINER_WIDTH,
                      offset: CONTAINER_WIDTH * index,
                      index,
                    })}
                    renderItem={({ item }) => (
                      <View style={styles.modalCell}>
                        <Image
                          source={item}
                          style={styles.modalImage}
                          resizeMode="contain"
                          resizeMethod="resize"
                        />
                      </View>
                    )}
                  />
                ) : (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#fff' }}>No hay imágenes disponibles</Text>
                  </View>
                )}

                {/* Left Navigation Chevron */}
                {modalImages.length > 1 && (
                  <TouchableOpacity
                    style={[styles.modalNavArrow, styles.modalNavArrowLeft]}
                    onPress={useCallback(() => {
                      const next = (modalGalleryIndex - 1 + modalImages.length) % modalImages.length;
                      setModalGalleryIndex(next);
                      modalFlatListRef.current?.scrollToIndex({ index: next, animated: true });
                    }, [modalGalleryIndex, modalImages.length])}
                    activeOpacity={0.8}
                  >
                    <ChevronLeftIcon />
                  </TouchableOpacity>
                )}

                {/* Right Navigation Chevron */}
                {modalImages.length > 1 && (
                  <TouchableOpacity
                    style={[styles.modalNavArrow, styles.modalNavArrowRight]}
                    onPress={useCallback(() => {
                      const next = (modalGalleryIndex + 1) % modalImages.length;
                      setModalGalleryIndex(next);
                      modalFlatListRef.current?.scrollToIndex({ index: next, animated: true });
                    }, [modalGalleryIndex, modalImages.length])}
                    activeOpacity={0.8}
                  >
                    <ChevronRightIcon />
                  </TouchableOpacity>
                )}
              </View>

              {/* Bottom bar: Indicator and tagline */}
              <View style={styles.modalFooter}>
                {selectedDestination?.tagline && (
                  <Text style={styles.modalTagline} numberOfLines={2}>
                    {selectedDestination.tagline}
                  </Text>
                )}
                {modalImages.length > 1 && (
                  <View style={styles.modalImageCountBadge}>
                    <Text style={styles.modalImageCountText}>
                      IMPERDIBLE {modalGalleryIndex + 1} DE {modalImages.length}
                    </Text>
                  </View>
                )}
              </View>

            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    justifyContent: 'space-between',
  },
  titleText: {
    paddingHorizontal: layout.screenPadding,
    marginTop: 8,
    marginBottom: 16,
    color: colors.textPrimary,
    textShadowColor: colors.primaryGlow,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
    zIndex: 60,
    elevation: 60,
  },

  // ── Hero Carousel ──
  carouselContainer: {
    marginBottom: 16,
  },
  carouselScroll: {
    paddingHorizontal: 24,
    gap: 12,
  },
  carouselCard: {
    width: CONTAINER_WIDTH - 48,
    height: CAROUSEL_HEIGHT,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  carouselGradient: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: 20,
  },
  carouselDiscountBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.accentUrgent,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  carouselDiscountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  carouselInfo: {
    gap: 4,
  },
  carouselTagline: {
    color: colors.secondary,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    opacity: 0.9,
  },
  carouselName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  carouselMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  carouselRating: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '700',
  },
  carouselDistance: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: '500',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotActive: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },

  // ── Stories Row ──
  storiesContainer: {
    marginBottom: 8,
  },
  storiesRow: {
    paddingHorizontal: 24,
    gap: 14,
    paddingVertical: 8,
  },
  storyWrapper: {
    alignItems: 'center',
    width: STORY_SIZE + 4,
  },
  storyRing: {
    width: STORY_SIZE,
    height: STORY_SIZE,
    borderRadius: STORY_SIZE / 2,
    borderWidth: 2.5,
    borderColor: colors.primary,
    padding: 3,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    elevation: 4,
  },
  storyImage: {
    width: '100%',
    height: '100%',
    borderRadius: (STORY_SIZE - 8) / 2,
  },
  storyLabel: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 5,
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  // ── Existing ──
  chipsContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  chipsRow: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    gap: 8,
  },
  cardPadding: {
    paddingHorizontal: layout.screenPadding,
    paddingBottom: 16,
  },
  listContent: {
    paddingBottom: layout.bottomNavHeight + 32,
  },
  // ── Enhanced Empty State ──
  emptyState: {
    alignItems: 'center',
    padding: 40,
    gap: 12,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginTop: 8,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  emptyCta: {
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: colors.primary,
    backgroundColor: 'rgba(160, 32, 240, 0.08)',
  },
  emptyCtaText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  skeletonList: {
    gap: 12,
  },

  // ── Fullscreen Gallery Modal Styles ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 5, 0.98)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSafeArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    width: '100%',
    maxWidth: CONTAINER_WIDTH,
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#050505',
  },
  modalHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 30,
  },
  modalHeaderTitleContainer: {
    flex: 1,
    paddingRight: 16,
  },
  modalDestCategory: {
    color: '#C9956B',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  modalDestName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  modalCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCarouselContainer: {
    flex: 1,
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFlatList: {
    flex: 1,
    width: '100%',
  },
  modalFlatListContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCell: {
    width: CONTAINER_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: CONTAINER_WIDTH - 32,
    height: Math.min(SCREEN_HEIGHT * 0.65, 550),
    borderRadius: 16,
  },
  modalNavArrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  modalNavArrowLeft: {
    left: 16,
  },
  modalNavArrowRight: {
    right: 16,
  },
  modalFooter: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 12,
    zIndex: 30,
  },
  modalTagline: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalImageCountBadge: {
    backgroundColor: 'rgba(201, 149, 107, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(201, 149, 107, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  modalImageCountText: {
    color: '#C9956B',
    fontSize: 10.5,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});

export default HomeScreen;
