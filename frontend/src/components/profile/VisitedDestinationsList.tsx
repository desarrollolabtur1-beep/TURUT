/**
 * VisitedDestinationsList — Horizontal scrollable cards of visited experiences
 * Auto-populated from backend, NO manual add button
 */
import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, Platform } from 'react-native';
import { colors, textStyles, radii, shadows, spacing } from '../../theme';
import { VisitedDestination } from '../../context/AuthContext';

interface VisitedDestinationsListProps {
  destinations: VisitedDestination[];
}

const VisitedDestinationsList: React.FC<VisitedDestinationsListProps> = ({
  destinations,
}) => {
  if (!destinations || destinations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🌍</Text>
        <Text style={styles.emptyTitle}>Aún no has visitado destinos</Text>
        <Text style={styles.emptySubtitle}>
          Explora y marca destinos como visitados para verlos aquí
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={destinations}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => {
        const dest = item.destination;
        return typeof dest === 'string' ? `${dest}-${index}` : `${dest._id}-${index}`;
      }}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => {
        const dest = item.destination;

        // If destination is not populated (just an ObjectId string), skip
        if (typeof dest === 'string') {
          return null;
        }

        const visitDate = item.visitedAt
          ? new Date(item.visitedAt).toLocaleDateString('es-CO', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : '';

        const imageUri = dest.images?.[0] || '';

        return (
          <View style={styles.card}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.cardImage} />
            ) : (
              <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
                <Text style={styles.cardImageEmoji}>📍</Text>
              </View>
            )}
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle} numberOfLines={1}>
                {dest.title}
              </Text>
              <Text style={styles.cardLocation} numberOfLines={1}>
                📍 {dest.location}
              </Text>
              {visitDate ? (
                <Text style={styles.cardDate}>✓ {visitDate}</Text>
              ) : null}
            </View>
          </View>
        );
      }}
    />
  );
};

const CARD_WIDTH = 180;
const CARD_IMAGE_HEIGHT = 110;

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: 'rgba(10, 10, 15, 0.6)',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderTopColor: colors.outline,
    overflow: 'hidden',
    ...shadows.glass,
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(40px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
        } as any)
      : {}),
  },
  cardImage: {
    width: CARD_WIDTH,
    height: CARD_IMAGE_HEIGHT,
    backgroundColor: colors.surfaceContainerHigh,
  },
  cardImagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImageEmoji: {
    fontSize: 32,
  },
  cardContent: {
    padding: spacing.md,
  },
  cardTitle: {
    ...textStyles.bodySemiBold,
    color: colors.textPrimary,
    fontSize: 13,
    marginBottom: spacing.xxs,
  },
  cardLocation: {
    ...textStyles.body,
    color: colors.textMuted,
    fontSize: 11,
    marginBottom: spacing.xs,
  },
  cardDate: {
    ...textStyles.meta,
    color: colors.primary,
    fontSize: 10,
    textTransform: 'none',
    letterSpacing: 0.3,
  },
  // Empty state
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
    paddingHorizontal: spacing.xxl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...textStyles.headlineSmall,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    ...textStyles.body,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default VisitedDestinationsList;
