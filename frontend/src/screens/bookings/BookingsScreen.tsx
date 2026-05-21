/**
 * BookingsScreen — "Mis Reservas" view
 * Migrated to Andina Neón dark design system
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bookingService } from '../../services/api.service';
import { useAuth } from '../../context/AuthContext';
import { colors, textStyles, radii, shadows, spacing, layout } from '../../theme';

// ── Booking type ──
interface Booking {
  _id?: string;
  id?: string;
  status?: string;
  createdAt?: string;
  bookingDate?: string;
  participants?: number;
  totalPrice?: number;
  experience?: {
    title?: string;
    _id?: string;
  };
}

// ── SVG Icons ──
const CalendarIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={3} y={4} width={18} height={18} rx={2} />
    <Path d="M16 2v4M8 2v4M3 10h18" />
  </Svg>
);

const UsersIcon = () => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx={9} cy={7} r={4} />
    <Path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2" />
    <Path d="M16 3.13a4 4 0 010 7.75" />
    <Path d="M21 21v-2a4 4 0 00-3-3.87" />
  </Svg>
);

const TicketIcon = () => (
  <Svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" opacity={0.3}>
    <Path d="M2 9a3 3 0 010-6h18a3 3 0 110 6" />
    <Path d="M2 15a3 3 0 000 6h18a3 3 0 100-6" />
    <Path d="M2 9v6M22 9v6" />
    <Path d="M9 9v6" strokeDasharray="2 2" />
  </Svg>
);

// ── Status badge ──
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const lower = status.toLowerCase();
  const isConfirmed = lower.includes('confirm');
  const isPending = lower.includes('pend');
  const isCancelled = lower.includes('cancel');

  const bgColor = isCancelled
    ? 'rgba(249,112,102,0.15)'
    : isPending
      ? 'rgba(255,215,0,0.15)'
      : 'rgba(52,199,89,0.15)';
  const textColor = isCancelled
    ? colors.accentUrgent
    : isPending
      ? colors.secondary
      : '#34C759';

  return (
    <View style={[styles.statusBadge, { backgroundColor: bgColor }]}>
      <View style={[styles.statusDot, { backgroundColor: textColor }]} />
      <Text style={[styles.statusText, { color: textColor }]}>{status}</Text>
    </View>
  );
};

const BookingsScreen = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingService.getMyBookings();
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        Alert.alert('Error', 'No se pudo cargar tus reservas');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando reservas...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => (item._id || item.id || Math.random()).toString()}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Mis Reservas</Text>
            {bookings.length > 0 && (
              <Text style={styles.headerCount}>{bookings.length}</Text>
            )}
          </View>
        }
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 80).duration(400)}>
            <TouchableOpacity
              style={styles.bookingCard}
              onPress={() => {
                console.log('Navigate to booking detail:', item);
              }}
              activeOpacity={0.7}
            >
              {/* Card Header */}
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderLeft}>
                  <Text style={styles.bookingTitle}>
                    {item.experience?.title || 'Experiencia'}
                  </Text>
                  <Text style={styles.bookingId}>
                    #{item._id?.slice(-6).toUpperCase() || 'XXXXXX'}
                  </Text>
                </View>
                <StatusBadge status={item.status || 'Confirmada'} />
              </View>

              {/* Card Details */}
              <View style={styles.cardDetails}>
                <View style={styles.detailRow}>
                  <CalendarIcon />
                  <Text style={styles.detailLabel}>Fecha</Text>
                  <Text style={styles.detailValue}>
                    {item.bookingDate
                      ? new Date(item.bookingDate).toLocaleDateString('es-CO', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })
                      : 'Por confirmar'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <UsersIcon />
                  <Text style={styles.detailLabel}>Personas</Text>
                  <Text style={styles.detailValue}>{item.participants || 1}</Text>
                </View>
              </View>

              {/* Card Footer */}
              <View style={styles.cardFooter}>
                <Text style={styles.createdAt}>
                  Creada {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString('es-CO')
                    : ''}
                </Text>
                <Text style={styles.totalPrice}>
                  ${(item.totalPrice || 0).toLocaleString('es-CO')}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <TicketIcon />
            <Text style={styles.emptyTitle}>Sin reservas aún</Text>
            <Text style={styles.emptySubtext}>
              Explora experiencias y reserva tu próxima aventura
            </Text>
          </View>
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
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    ...textStyles.body,
    color: colors.textMuted,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    ...textStyles.headlineLarge,
    color: colors.textPrimary,
  },
  headerCount: {
    ...textStyles.meta,
    color: colors.textMuted,
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.pill,
    overflow: 'hidden',
    fontSize: 12,
  },
  listContent: {
    paddingBottom: layout.bottomNavHeight + 32,
  },
  bookingCard: {
    marginHorizontal: layout.screenPadding,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.outline,
    overflow: 'hidden',
    ...shadows.glass,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.outlineVariant,
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  bookingTitle: {
    ...textStyles.headlineSmall,
    color: colors.textPrimary,
    fontSize: 15,
    marginBottom: 4,
  },
  bookingId: {
    ...textStyles.meta,
    color: colors.textMuted,
    fontSize: 11,
  },
  // Status
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  // Details
  cardDetails: {
    padding: spacing.lg,
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    ...textStyles.body,
    color: colors.textMuted,
    fontSize: 13,
    flex: 1,
  },
  detailValue: {
    ...textStyles.bodySemiBold,
    color: colors.textPrimary,
    fontSize: 13,
  },
  // Footer
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: 0,
  },
  createdAt: {
    ...textStyles.meta,
    color: colors.textMuted,
    fontSize: 11,
  },
  totalPrice: {
    ...textStyles.headlineSmall,
    color: colors.secondary,
    fontSize: 18,
  },
  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    ...textStyles.headlineSmall,
    color: colors.textSecondary,
    fontSize: 18,
    marginTop: 8,
  },
  emptySubtext: {
    ...textStyles.body,
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 22,
  },
});

export default BookingsScreen;
