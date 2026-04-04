/**
 * TURUT — Favorites & Matches store with AsyncStorage persistence
 * Replaces the PWA's localStorage-based state management
 */
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'turut_favorites';
const MATCHES_KEY = 'turut_matches';
const SWIPE_POS_KEY = 'turut_swipePosition';

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [matches, setMatches] = useState<number[]>([]);
  const [swipePosition, setSwipePosition] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const [favData, matchData, posData] = await Promise.all([
          AsyncStorage.getItem(FAVORITES_KEY),
          AsyncStorage.getItem(MATCHES_KEY),
          AsyncStorage.getItem(SWIPE_POS_KEY),
        ]);
        if (favData) setFavorites(JSON.parse(favData));
        if (matchData) setMatches(JSON.parse(matchData));
        if (posData) setSwipePosition(parseInt(posData, 10));
      } catch (e) {
        console.warn('Failed to load state from storage:', e);
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  // Persist favorites
  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }
  }, [favorites, loaded]);

  // Persist matches
  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
    }
  }, [matches, loaded]);

  // Persist swipe position
  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(SWIPE_POS_KEY, swipePosition.toString());
    }
  }, [swipePosition, loaded]);

  const toggleFavorite = useCallback((destIndex: number) => {
    setFavorites((prev) => {
      if (prev.includes(destIndex)) {
        return prev.filter((id) => id !== destIndex);
      }
      return [...prev, destIndex];
    });
  }, []);

  const addMatch = useCallback((destIndex: number) => {
    setMatches((prev) => {
      if (prev.includes(destIndex)) return prev;
      return [...prev, destIndex];
    });
  }, []);

  const isFavorite = useCallback(
    (destIndex: number) => favorites.includes(destIndex),
    [favorites]
  );

  const isMatch = useCallback(
    (destIndex: number) => matches.includes(destIndex),
    [matches]
  );

  /** Get combined unique indices (favorites + matches) for "Tus Matches" tab */
  const getCombinedIds = useCallback(() => {
    return [...new Set([...favorites, ...matches])];
  }, [favorites, matches]);

  const advanceSwipe = useCallback(() => {
    setSwipePosition((prev) => prev + 1);
  }, []);

  const resetSwipe = useCallback(() => {
    setSwipePosition(0);
  }, []);

  return {
    favorites,
    matches,
    swipePosition,
    loaded,
    toggleFavorite,
    addMatch,
    isFavorite,
    isMatch,
    getCombinedIds,
    advanceSwipe,
    resetSwipe,
    setSwipePosition,
  };
}
