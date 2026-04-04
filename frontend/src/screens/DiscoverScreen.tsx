/**
 * DiscoverScreen — "Tu Ruta" swipe view
 * Tinder-style card swiping for destinations
 */
import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

  const currentIndex = swipePosition % destinations.length;
  const currentDest = destinations[currentIndex];

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
        <TurutHeader />
      
        <View style={styles.titleContainer}>
          <Text style={[textStyles.headlineLarge, styles.titleText]}>
            ¿A dónde vamos?
          </Text>
        </View>

        <View style={styles.content}>
          {/* Swipe Card */}
          <SwipeContainer
            destination={currentDest}
            currentIndex={currentIndex}
            total={destinations.length}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
          />

          {/* Controls */}
          <SwipeControls
            onReject={handleSwipeLeft}
            onMatch={handleSwipeRight}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505', // Ensures true dark bleed
  },
  safeArea: {
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingBottom: layout.bottomNavHeight + 24, // multiple of 8
  },
});

export default DiscoverScreen;
