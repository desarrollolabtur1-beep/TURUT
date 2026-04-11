/**
 * DiscoverScreen — "Tu Ruta" swipe view
 * Tinder-style card swiping for destinations
 */
import React, { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, LayoutChangeEvent } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TurutHeader } from '../components/header/TurutHeader';
import { SwipeContainer } from '../components/swipe/SwipeContainer';
import { SwipeControls } from '../components/swipe/SwipeControls';
import { destinations } from '../data/destinations';
import { useFavorites } from '../store/useFavorites';
import { colors, textStyles, layout } from '../theme';

const DiscoverScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { swipePosition, advanceSwipe, addMatch } = useFavorites();
  const scrollRef = useRef<ScrollView>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

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

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <View onLayout={handleHeaderLayout}>
            <TurutHeader />
          </View>
        
          <View style={styles.titleContainer}>
            <Text style={[textStyles.headlineLarge, styles.titleText]}>
              ¿A dónde vamos?
            </Text>
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
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: layout.bottomNavHeight + 24,
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});

export default DiscoverScreen;
