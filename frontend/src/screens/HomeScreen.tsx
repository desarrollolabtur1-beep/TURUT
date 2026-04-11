/**
 * HomeScreen — "Imperdibles" main view
 * Segmented control, filter chips, and destination cards
 */
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { TurutHeader } from '../components/header/TurutHeader';
import { SegmentControl } from '../components/ui/SegmentControl';
import { StyleChip } from '../components/ui/StyleChip';
import { ImperdibleCard } from '../components/cards/ImperdibleCard';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { destinations, categories } from '../data/destinations';
import { useFavorites } from '../store/useFavorites';
import { colors, layout, textStyles } from '../theme';

type SegmentTab = 'top5' | 'miruta';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { isFavorite, toggleFavorite, getCombinedIds, loaded } = useFavorites();

  const [activeTab, setActiveTab] = useState<SegmentTab>('top5');
  const [activeFilter, setActiveFilter] = useState('all');

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

  const handleCardPress = useCallback(
    (destIndex: number) => {
      navigation.navigate('Landing', { destIndex });
    },
    [navigation]
  );

  const filterChips = useMemo(
    () => [{ label: 'Todos', filter: 'all' }, ...categories.map((c) => ({ label: c === 'Gastronomía' ? 'Gastro' : c, filter: c }))],
    []
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyText}>No hay experiencias guardadas.</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={loaded ? filteredData : []}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
          <>
            {/* Header */}
            <TurutHeader />

            {/* Title */}
            <Text style={[textStyles.headlineLarge, styles.titleText]}>Imperdibles</Text>

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
        renderItem={({ item, index }) => {
          const destIndex = destinations.indexOf(item);
          return (
            <View style={styles.cardPadding}>
              <ImperdibleCard
                destination={item}
                index={index}
                isFavorite={isFavorite(destIndex)}
                onPress={() => handleCardPress(destIndex)}
                onToggleFavorite={() => toggleFavorite(destIndex)}
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
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505', // Using pure dark for full bleed
    justifyContent: 'space-between',
  },
  titleText: {
    paddingHorizontal: layout.screenPadding,
    marginTop: 8,
    marginBottom: 24,
    color: colors.textPrimary,
    textShadowColor: colors.primaryGlow,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
    zIndex: 60,
    elevation: 60,
  },
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
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    opacity: 0.3,
    marginBottom: 8,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  skeletonList: {
    gap: 12,
  },
});

export default HomeScreen;
