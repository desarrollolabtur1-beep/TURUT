/**
 * ExperienceDetailScreen — Experience detail with booking modal
 * Fully integrated with TURUT Design System (dark mode)
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  Dimensions,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { experienceService, bookingService } from '../../services/api.service';
import { useAuth } from '../../context/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GoldenButton } from '../../components/ui/GoldenButton';
import { GlassCard } from '../../components/ui/GlassCard';
import { colors, textStyles, radii, shadows, spacing } from '../../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ── SVG Icons ──
const CloseIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 6 6 18" />
    <Path d="m6 6 12 12" />
  </Svg>
);

const ClockIcon = ({ color = colors.textMuted }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx={12} cy={12} r={10} />
    <Path d="M12 6v6l4 2" />
  </Svg>
);

const MapPinIcon = ({ color = colors.textMuted }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Circle cx={12} cy={10} r={3} />
  </Svg>
);

const UsersIcon = ({ color = colors.textMuted }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <Circle cx={9} cy={7} r={4} />
    <Path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

const CalendarIcon = ({ color = colors.textMuted }: { color?: string }) => (
  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M8 2v4" />
    <Path d="M16 2v4" />
    <Path d="M3 10h18" />
    <Path d="M21 8.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5" />
  </Svg>
);

const MinusIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth={2.5} strokeLinecap="round">
    <Line x1={5} y1={12} x2={19} y2={12} />
  </Svg>
);

const PlusIcon = () => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={colors.textSecondary} strokeWidth={2.5} strokeLinecap="round">
    <Line x1={12} y1={5} x2={12} y2={19} />
    <Line x1={5} y1={12} x2={19} y2={12} />
  </Svg>
);

const ExperienceDetailScreen: React.FC = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { experienceId } = route.params || {};

  const [experience, setExperience] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [bookingDate, setBookingDate] = useState<Date | null>(null);
  const [participants, setParticipants] = useState<number>(1);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchExperience = async () => {
      if (!experienceId) return;

      try {
        setLoading(true);
        const response = await experienceService.getById(experienceId);
        const expData = response.data.data || response.data;
        setExperience(expData);

        // Calcular precio total por defecto (1 participante)
        if (expData) {
          setTotalPrice(expData.price);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load experience');
        Alert.alert('Error', err.response?.data?.message || 'Failed to load experience');
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [experienceId]);

  const handleBookExperience = () => {
    if (experience) {
      setBookingModalVisible(true);
    }
  };

  const handleParticipantsChange = (count: number) => {
    setParticipants(count);
    if (experience) {
      setTotalPrice(experience.price * count);
    }
  };

  const handleBookNow = async () => {
    if (!experience || !bookingDate) {
      Alert.alert('Error', 'Por favor selecciona una fecha');
      return;
    }

    setBookingLoading(true);
    try {
      await bookingService.create({
        experience: experience._id,
        bookingDate: bookingDate.toISOString(),
        participants,
        totalPrice,
        specialRequests,
      });

      setBookingModalVisible(false);
      Alert.alert('¡Listo!', 'Tu reserva fue creada exitosamente');
      setBookingDate(null);
      setParticipants(1);
      setSpecialRequests('');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'No se pudo crear la reserva');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading || !experience) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando experiencia...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Hero Image ── */}
        <View style={styles.heroContainer}>
          <Image
            source={{ uri: experience.images && experience.images.length > 0
              ? experience.images[0]
              : undefined }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(5,5,5,0)', 'rgba(5,5,5,0.7)', 'rgba(5,5,5,1)']}
            style={styles.heroGradient}
          />

          {/* Close button */}
          <TouchableOpacity
            style={[styles.closeBtn, { top: insets.top + 16 }]}
            onPress={() => navigation.goBack()}
          >
            <CloseIcon />
          </TouchableOpacity>

          {/* Category chip */}
          <Animated.View entering={FadeIn.delay(200).duration(400)} style={styles.categoryChip}>
            <Text style={styles.categoryText}>
              {experience.category?.toUpperCase()}
            </Text>
          </Animated.View>
        </View>

        {/* ── Content ── */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.content}>
          <Text style={styles.title}>{experience.title}</Text>

          {/* Meta row */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <ClockIcon color={colors.secondary} />
              <Text style={styles.metaText}>{experience.duration}h</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <MapPinIcon color={colors.secondary} />
              <Text style={styles.metaText}>{experience.location}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>${experience.price.toLocaleString()}</Text>
            </View>
          </View>

          {/* Description */}
          <GlassCard style={styles.descriptionCard} neon="primary">
            <Text style={styles.sectionTitle}>Sobre esta experiencia</Text>
            <Text style={styles.descriptionText}>{experience.description}</Text>
          </GlassCard>

          {/* Details */}
          <GlassCard style={styles.detailsCard}>
            <Text style={styles.sectionTitle}>Detalles</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <UsersIcon color={colors.primary} />
                <Text style={styles.detailLabel}>Capacidad</Text>
                <Text style={styles.detailValue}>
                  Máx. {experience.maxParticipants} personas
                </Text>
              </View>
              <View style={styles.detailDivider} />
              <View style={styles.detailItem}>
                <CalendarIcon color={colors.primary} />
                <Text style={styles.detailLabel}>Disponibilidad</Text>
                <Text style={styles.detailValue}>
                  {experience.availableDates?.length || 0} fechas
                </Text>
              </View>
            </View>
          </GlassCard>

          {/* CTA */}
          <View style={styles.ctaContainer}>
            <GoldenButton
              label={user ? 'Reservar Ahora' : 'Inicia Sesión para Reservar'}
              onPress={user ? handleBookExperience : () =>
                Alert.alert('Necesitas iniciar sesión', 'Ingresa a tu cuenta para hacer reservas')}
              disabled={!user}
            />
          </View>
        </Animated.View>
      </ScrollView>

      {/* ── Booking Modal ── */}
      <Modal
        visible={bookingModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setBookingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View entering={FadeInDown.duration(400)} style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reserva tu experiencia</Text>

            {/* Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Fecha de reserva</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => {
                  const today = new Date();
                  setBookingDate(today);
                }}
              >
                <CalendarIcon color={colors.textMuted} />
                <Text style={[styles.dateText, bookingDate && { color: colors.textPrimary }]}>
                  {bookingDate ? bookingDate.toLocaleDateString('es-CO') : 'Seleccionar fecha'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Participants */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Participantes</Text>
              <View style={styles.participantsContainer}>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() => handleParticipantsChange(Math.max(1, participants - 1))}
                >
                  <MinusIcon />
                </TouchableOpacity>
                <Text style={styles.participantsCount}>{participants}</Text>
                <TouchableOpacity
                  style={styles.counterBtn}
                  onPress={() =>
                    handleParticipantsChange(Math.min(experience.maxParticipants || 10, participants + 1))
                  }
                >
                  <PlusIcon />
                </TouchableOpacity>
              </View>
            </View>

            {/* Price summary */}
            <View style={styles.priceSummary}>
              <Text style={styles.priceSummaryLabel}>Total</Text>
              <Text style={styles.priceSummaryAmount}>${totalPrice.toLocaleString()}</Text>
            </View>

            {/* Special requests */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Peticiones especiales (opcional)</Text>
              <TextInput
                placeholder="Ej: Alergias, requerimientos especiales..."
                placeholderTextColor={colors.textMuted}
                value={specialRequests}
                onChangeText={setSpecialRequests}
                style={styles.textInput}
                multiline
              />
            </View>

            {/* Buttons */}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setBookingModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.confirmButton, (!bookingDate || bookingLoading) && styles.confirmButtonDisabled]}
                onPress={handleBookNow}
                disabled={bookingLoading || !bookingDate}
              >
                {bookingLoading ? (
                  <ActivityIndicator size="small" color={colors.onPrimary} />
                ) : (
                  <Text style={styles.confirmButtonText}>Confirmar</Text>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    ...textStyles.body,
    color: colors.textMuted,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // ── Hero ──
  heroContainer: {
    position: 'relative',
    width: '100%',
    height: SCREEN_HEIGHT * 0.4,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  closeBtn: {
    position: 'absolute',
    left: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    zIndex: 10,
  },
  categoryChip: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    backgroundColor: 'rgba(160, 32, 240, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(160, 32, 240, 0.4)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  categoryText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },

  // ── Content ──
  content: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 48,
    marginTop: -20,
  },
  title: {
    ...textStyles.headlineLarge,
    color: colors.textPrimary,
    fontSize: 28,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    ...textStyles.bodySemiBold,
    color: colors.textSecondary,
    fontSize: 13,
  },
  metaDivider: {
    width: 1,
    height: 16,
    backgroundColor: colors.outline,
  },
  priceTag: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.25)',
  },
  priceText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '800',
  },

  // ── Cards ──
  descriptionCard: {
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    ...textStyles.headlineSmall,
    color: colors.textPrimary,
    fontSize: 16,
    marginBottom: 10,
  },
  descriptionText: {
    ...textStyles.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  detailsCard: {
    padding: 20,
    marginBottom: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  detailDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.outlineVariant,
  },
  detailLabel: {
    ...textStyles.chipLabel,
    color: colors.textMuted,
    fontSize: 9,
  },
  detailValue: {
    ...textStyles.bodySemiBold,
    color: colors.textPrimary,
    fontSize: 13,
    textAlign: 'center',
  },

  // ── CTA ──
  ctaContainer: {
    marginBottom: 16,
  },

  // ── Modal ──
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    backgroundColor: colors.surfaceContainerHigh,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: colors.outline,
  },
  modalTitle: {
    ...textStyles.headlineLarge,
    color: colors.textPrimary,
    fontSize: 20,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    ...textStyles.bodySemiBold,
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: 8,
  },
  dateInput: {
    backgroundColor: colors.surfaceContainer,
    padding: 14,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.outline,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateText: {
    color: colors.textMuted,
    fontSize: 14,
    fontFamily: 'Inter',
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  counterBtn: {
    width: 44,
    height: 44,
    backgroundColor: colors.surfaceContainer,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantsCount: {
    ...textStyles.headlineLarge,
    color: colors.textPrimary,
    fontSize: 24,
    minWidth: 40,
    textAlign: 'center',
  },
  priceSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
    padding: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.15)',
  },
  priceSummaryLabel: {
    ...textStyles.headlineSmall,
    color: colors.textPrimary,
    fontSize: 16,
  },
  priceSummaryAmount: {
    ...textStyles.headlineLarge,
    color: colors.secondary,
    fontSize: 22,
  },
  textInput: {
    backgroundColor: colors.surfaceContainer,
    padding: 14,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.outline,
    color: colors.textPrimary,
    fontFamily: 'Inter',
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.surfaceContainer,
    paddingVertical: 14,
    borderRadius: radii.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outline,
  },
  cancelButtonText: {
    ...textStyles.bodySemiBold,
    color: colors.textSecondary,
    fontSize: 15,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: radii.md,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  confirmButtonDisabled: {
    opacity: 0.5,
  },
  confirmButtonText: {
    ...textStyles.bodyBold,
    color: colors.onPrimary,
    fontSize: 15,
  },
});

export default ExperienceDetailScreen;