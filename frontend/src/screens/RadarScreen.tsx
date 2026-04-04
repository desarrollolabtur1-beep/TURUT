/**
 * RadarScreen — "¿Qué está pasando ahora?" events view
 */
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { TurutHeader } from '../components/header/TurutHeader';
import { EventCard } from '../components/cards/EventCard';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { events } from '../data/events';
import { destinations } from '../data/destinations';
import { colors, layout, textStyles } from '../theme';

const LiveDot: React.FC = () => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.4, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: 0.7 + opacity.value * 0.6 }],
  }));

  return <Animated.View style={[styles.liveDot, dotStyle]} />;
};

const RadarScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleEventPress = (destIndex: number) => {
    navigation.navigate('Landing', { destIndex });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={loading ? [] : events}
        keyExtractor={(_, i) => i.toString()}
        ListHeaderComponent={
          <>
            <TurutHeader />
            <View style={styles.headerRow}>
              <LiveDot />
              <Text style={[textStyles.headlineLarge, styles.title]}>¿Qué está pasando ahora?</Text>
            </View>
          </>
        }
        renderItem={({ item, index }) => (
          <View style={styles.cardPadding}>
            <EventCard
              event={item}
              destination={destinations[item.destIndex]}
              index={index}
              onPress={() => handleEventPress(item.destIndex)}
            />
          </View>
        )}
        ListEmptyComponent={
          loading ? (
            <View style={styles.skeletonList}>
              {[0, 1, 2, 3].map((i) => (
                <View key={i} style={styles.cardPadding}>
                  <SkeletonCard type="event" />
                </View>
              ))}
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505', // full bleed color
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.screenPadding,
    paddingTop: 16,
    marginBottom: 24,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
    marginRight: 8,
    shadowColor: colors.secondary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  title: {
    color: colors.textPrimary,
    textShadowColor: colors.primaryGlow,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  cardPadding: {
    paddingHorizontal: layout.screenPadding,
  },
  listContent: {
    paddingBottom: layout.bottomNavHeight + 32,
  },
  skeletonList: {
    gap: 12,
  },
});

export default RadarScreen;
