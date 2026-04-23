/**
 * ProfileScreen — Full profile view with TURUT design system
 *
 * Features:
 * - Avatar with photo edit (expo-image-picker)
 * - Editable bio with character counter
 * - Profile completion bar (animated)
 * - Demographics section (city, birthDate, gender)
 * - Coffee preferences
 * - Exploration preferences
 * - Travel style
 * - Special needs
 * - Acquisition source
 * - Visited destinations list
 * - Logout & navigation options
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import { useAuth, VisitedDestination } from '../../context/AuthContext';
import { userService } from '../../services/api.service';
import { colors, textStyles, radii, shadows, spacing } from '../../theme';
import ProfileHeader from '../../components/profile/ProfileHeader';
import VisitedDestinationsList from '../../components/profile/VisitedDestinationsList';
import ProfileCompletionBar from '../../components/profile/ProfileCompletionBar';
import ProfileChipSelector from '../../components/profile/ProfileChipSelector';
import ProfileSingleSelector from '../../components/profile/ProfileSingleSelector';

const BIO_MAX_LENGTH = 300;

// ── Opciones de preguntas ────────────────────────────────────────────────────

const GENDER_OPTIONS = [
  { value: 'masculino', label: 'Masculino', emoji: '👨' },
  { value: 'femenino', label: 'Femenino', emoji: '👩' },
  { value: 'otro', label: 'Otro', emoji: '🧑' },
  { value: 'prefiero_no_decir', label: 'Prefiero no decir', emoji: '🤷' },
];

const COFFEE_EXPERIENCE_OPTIONS = [
  { value: 'varias_veces', label: 'Sí, varias veces', emoji: '☕' },
  { value: 'una_vez', label: 'Una vez', emoji: '🌱' },
  { value: 'nunca', label: 'Nunca, sería mi primera vez', emoji: '✨' },
];

const COFFEE_INTERESTS_OPTIONS = [
  { value: 'catar', label: 'Probar variedades y catar', emoji: '☕' },
  { value: 'proceso', label: 'Ver el proceso del grano a la taza', emoji: '🌱' },
  { value: 'paisaje', label: 'El paisaje y la finca', emoji: '🏞️' },
  { value: 'fotografia', label: 'La experiencia fotogénica', emoji: '📷' },
  { value: 'comprar', label: 'Comprar café de origen', emoji: '🛒' },
];

const NATURE_PREFERENCES_OPTIONS = [
  { value: 'montana', label: 'Montaña y senderismo', emoji: '🌄' },
  { value: 'rios_cascadas', label: 'Ríos y cascadas', emoji: '💧' },
  { value: 'bosque_fauna', label: 'Bosque y fauna', emoji: '🌳' },
  { value: 'paisaje_cafetero', label: 'Paisaje cafetero y fincas', emoji: '🌾' },
  { value: 'cielos_nocturnos', label: 'Cielos nocturnos / estrellas', emoji: '🌙' },
];

const EXPERIENCE_TYPES_OPTIONS = [
  { value: 'naturaleza', label: 'Naturaleza y senderismo', emoji: '🌄' },
  { value: 'cultura', label: 'Cultura e historia', emoji: '🏛️' },
  { value: 'gastronomia', label: 'Gastronomía local', emoji: '🍽️' },
  { value: 'entretenimiento', label: 'Entretenimiento', emoji: '🎉' },
  { value: 'bienestar', label: 'Bienestar y relax', emoji: '🧘' },
  { value: 'fotografia', label: 'Fotografía y paisajes', emoji: '📸' },
];

const TRAVEL_COMPANY_OPTIONS = [
  { value: 'solo', label: 'Solo', emoji: '🧍' },
  { value: 'pareja', label: 'En pareja', emoji: '💑' },
  { value: 'familia', label: 'En familia', emoji: '👨‍👩‍👧' },
  { value: 'amigos', label: 'Con amigos', emoji: '👥' },
];

const LODGING_STYLE_OPTIONS = [
  { value: 'rustico', label: 'Rústico / cabaña', emoji: '🏕️' },
  { value: 'finca_tradicional', label: 'Finca tradicional con comodidades', emoji: '🏡' },
  { value: 'confortable', label: 'Confortable con todas las facilidades', emoji: '🏨' },
];

const CONNECTIVITY_OPTIONS = [
  { value: 'necesito_wifi', label: 'Necesito WiFi y señal', emoji: '📶' },
  { value: 'desconectarme', label: 'Quiero desconectarme totalmente', emoji: '📵' },
  { value: 'me_da_igual', label: 'Me da igual', emoji: '🤷' },
];

const ESCAPE_TIME_OPTIONS = [
  { value: 'fines_de_semana', label: 'Fines de semana', emoji: '📅' },
  { value: 'puentes_festivos', label: 'Puentes y festivos', emoji: '🌴' },
  { value: 'vacaciones', label: 'Vacaciones largas', emoji: '✈️' },
  { value: 'flexible', label: 'Cualquier día, soy flexible', emoji: '⚡' },
];

const SPECIAL_NEEDS_OPTIONS = [
  { value: 'movilidad_reducida', label: 'Movilidad reducida', emoji: '♿' },
  { value: 'bebe_nino', label: 'Viajo con bebé/niño pequeño', emoji: '👶' },
  { value: 'mascota', label: 'Viajo con mascota', emoji: '🐕' },
  { value: 'adulto_mayor', label: 'Acompaño a adulto mayor', emoji: '👴' },
  { value: 'auditiva_visual', label: 'Necesidad auditiva/visual', emoji: '🦻' },
  { value: 'ninguna', label: 'Ninguna', emoji: '✅' },
];

const ACQUISITION_OPTIONS = [
  { value: 'instagram_tiktok', label: 'Instagram / TikTok', emoji: '📱' },
  { value: 'google', label: 'Buscando en Google', emoji: '🔍' },
  { value: 'recomendacion', label: 'Recomendación de un amigo', emoji: '👤' },
  { value: 'publicidad', label: 'Publicidad', emoji: '📰' },
  { value: 'evento', label: 'Evento o feria', emoji: '🎪' },
  { value: 'otro', label: 'Otro', emoji: '💬' },
];

const AVAILABLE_TIME_OPTIONS = [
  { value: 'medio_dia', label: 'Medio día (mañana o tarde)', emoji: '⚡' },
  { value: 'dia_completo', label: 'Un día completo', emoji: '🌅' },
  { value: 'fin_de_semana', label: 'Fin de semana', emoji: '🏕️' },
  { value: 'varios_dias', label: 'Varios días', emoji: '✈️' },
];

// ── Componente Principal ─────────────────────────────────────────────────────

const ProfileScreen = () => {
  const { user, logout, refreshUser } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [bio, setBio] = useState(user?.bio ?? '');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ── Profile fields (local state) ──
  const [city, setCity] = useState(user?.city ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [gender, setGender] = useState(user?.gender ?? '');
  const [coffeeExperience, setCoffeeExperience] = useState(user?.preferences?.coffeeExperience ?? '');
  const [coffeeInterests, setCoffeeInterests] = useState<string[]>(user?.preferences?.coffeeInterests ?? []);
  const [naturePreferences, setNaturePreferences] = useState<string[]>(user?.preferences?.naturePreferences ?? []);
  const [experienceTypes, setExperienceTypes] = useState<string[]>(user?.preferences?.experienceTypes ?? []);
  const [travelCompany, setTravelCompany] = useState(user?.preferences?.travelCompany ?? '');
  const [availableTime, setAvailableTime] = useState(user?.preferences?.availableTime ?? '');
  const [lodgingStyle, setLodgingStyle] = useState(user?.preferences?.lodgingStyle ?? '');
  const [connectivityPreference, setConnectivityPreference] = useState(user?.preferences?.connectivityPreference ?? '');
  const [escapeTime, setEscapeTime] = useState(user?.preferences?.escapeTime ?? '');
  const [specialNeeds, setSpecialNeeds] = useState<string[]>(user?.specialNeeds ?? []);
  const [acquisitionSource, setAcquisitionSource] = useState(user?.acquisitionSource ?? '');

  // Track which sections have unsaved changes
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync state when user changes (e.g. after refreshUser)
  useEffect(() => {
    if (user) {
      setBio(user.bio ?? '');
      setCity(user.city ?? '');
      setPhone(user.phone ?? '');
      setGender(user.gender ?? '');
      setCoffeeExperience(user.preferences?.coffeeExperience ?? '');
      setCoffeeInterests(user.preferences?.coffeeInterests ?? []);
      setNaturePreferences(user.preferences?.naturePreferences ?? []);
      setExperienceTypes(user.preferences?.experienceTypes ?? []);
      setTravelCompany(user.preferences?.travelCompany ?? '');
      setAvailableTime(user.preferences?.availableTime ?? '');
      setLodgingStyle(user.preferences?.lodgingStyle ?? '');
      setConnectivityPreference(user.preferences?.connectivityPreference ?? '');
      setEscapeTime(user.preferences?.escapeTime ?? '');
      setSpecialNeeds(user.specialNeeds ?? []);
      setAcquisitionSource(user.acquisitionSource ?? '');
      setHasUnsavedChanges(false);
    }
  }, [user]);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const toggleArrayItem = (arr: string[], item: string): string[] => {
    // For specialNeeds: if selecting 'ninguna', clear others; if selecting something, remove 'ninguna'
    if (item === 'ninguna') return ['ninguna'];
    const withoutNinguna = arr.filter((v) => v !== 'ninguna');
    return withoutNinguna.includes(item)
      ? withoutNinguna.filter((v) => v !== item)
      : [...withoutNinguna, item];
  };

  const toggleChip = (arr: string[], item: string): string[] => {
    return arr.includes(item)
      ? arr.filter((v) => v !== item)
      : [...arr, item];
  };

  // ── Photo picker ─────────────────────────────────────────────────────────
  const handleEditPhoto = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permiso necesario',
          'Necesitamos acceso a tu galería para cambiar tu foto de perfil'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (result.canceled || !result.assets?.[0]) return;

      const asset = result.assets[0];
      const imageUri = asset.base64
        ? `data:image/jpeg;base64,${asset.base64}`
        : asset.uri;

      setIsSaving(true);
      try {
        await userService.updateProfile({ profileImage: imageUri });
        await refreshUser();
      } catch (error: any) {
        const msg = error?.response?.data?.message || 'Error al actualizar la foto';
        Alert.alert('Error', msg);
      } finally {
        setIsSaving(false);
      }
    } catch (error) {
      console.error('Image picker error:', error);
    }
  }, [refreshUser]);

  // ── Bio save ─────────────────────────────────────────────────────────────
  const handleSaveBio = useCallback(async () => {
    if (bio.length > BIO_MAX_LENGTH) {
      Alert.alert('Error', `La bio no puede superar ${BIO_MAX_LENGTH} caracteres`);
      return;
    }

    setIsSaving(true);
    try {
      await userService.updateProfile({ bio: bio.trim() });
      await refreshUser();
      setIsEditingBio(false);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Error al guardar la bio';
      Alert.alert('Error', msg);
    } finally {
      setIsSaving(false);
    }
  }, [bio, refreshUser]);

  // ── Save all profile preferences ─────────────────────────────────────────
  const handleSavePreferences = useCallback(async () => {
    setIsSaving(true);
    try {
      await userService.updateProfile({
        city: city.trim(),
        phone: phone.trim(),
        gender,
        preferences: {
          coffeeExperience,
          coffeeInterests,
          naturePreferences,
          experienceTypes,
          travelCompany,
          availableTime,
          lodgingStyle,
          connectivityPreference,
          escapeTime,
        },
        specialNeeds,
        acquisitionSource,
      });
      await refreshUser();
      setHasUnsavedChanges(false);
      Alert.alert('✅ Guardado', 'Tu perfil ha sido actualizado');
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Error al guardar';
      Alert.alert('Error', msg);
    } finally {
      setIsSaving(false);
    }
  }, [
    city, phone, gender, coffeeExperience, coffeeInterests, naturePreferences,
    experienceTypes, travelCompany, availableTime, lodgingStyle,
    connectivityPreference, escapeTime, specialNeeds, acquisitionSource,
    refreshUser,
  ]);

  // ── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout]);

  // ── Visited destinations ─────────────────────────────────────────────────
  const visitedDestinations: VisitedDestination[] =
    user?.visitedDestinations ?? [];

  // ── Mark unsaved on any change ───────────────────────────────────────────
  const markUnsaved = () => setHasUnsavedChanges(true);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <ProfileHeader
          firstName={user?.firstName ?? ''}
          lastName={user?.lastName ?? ''}
          email={user?.email ?? ''}
          role={user?.role ?? 'user'}
          profileImage={user?.profileImage}
          onEditPhoto={handleEditPhoto}
        />

        {/* ── Completion Bar ──────────────────────────────────────────── */}
        <ProfileCompletionBar user={user} />

        {/* ── Bio Section ─────────────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sobre mí</Text>
            {!isEditingBio && (
              <TouchableOpacity onPress={() => setIsEditingBio(true)}>
                <Text style={styles.editLink}>Editar</Text>
              </TouchableOpacity>
            )}
          </View>

          {isEditingBio ? (
            <View style={styles.bioEditContainer}>
              <TextInput
                style={styles.bioInput}
                value={bio}
                onChangeText={(text) => setBio(text.slice(0, BIO_MAX_LENGTH))}
                placeholder="Cuéntanos sobre ti..."
                placeholderTextColor={colors.textMuted}
                multiline
                maxLength={BIO_MAX_LENGTH}
                autoFocus
              />
              <View style={styles.bioFooter}>
                <Text
                  style={[
                    styles.charCounter,
                    bio.length > BIO_MAX_LENGTH * 0.9 && styles.charCounterWarn,
                  ]}
                >
                  {bio.length}/{BIO_MAX_LENGTH}
                </Text>
                <View style={styles.bioActions}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => {
                      setBio(user?.bio ?? '');
                      setIsEditingBio(false);
                    }}
                  >
                    <Text style={styles.cancelBtnText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
                    onPress={handleSaveBio}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <ActivityIndicator size="small" color={colors.onSecondary} />
                    ) : (
                      <Text style={styles.saveBtnText}>Guardar</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            <Text style={styles.bioText}>
              {user?.bio || 'Toca "Editar" para agregar una descripción ✨'}
            </Text>
          )}
        </View>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/*                    SECCIÓN 1: SOBRE TI                        */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📍 Datos personales</Text>
          </View>

          {/* Ciudad */}
          <View style={styles.questionBlock}>
            <Text style={styles.questionLabel}>¿De qué ciudad eres?</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={(text) => { setCity(text); markUnsaved(); }}
              placeholder="Ej: Ibagué, Bogotá..."
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Teléfono */}
          <View style={styles.questionBlock}>
            <Text style={styles.questionLabel}>📞 Número de teléfono</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={(text) => { setPhone(text); markUnsaved(); }}
              placeholder="Ej: 300 123 4567"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
            />
          </View>

          {/* Género */}
          <View style={styles.questionBlock}>
            <Text style={styles.questionLabel}>Género</Text>
            <ProfileSingleSelector
              options={GENDER_OPTIONS}
              selected={gender}
              onSelect={(v) => { setGender(v); markUnsaved(); }}
            />
          </View>
        </View>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/*               SECCIÓN 2: EXPERIENCIA CON CAFÉ                 */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>☕ Tu conexión con el café</Text>
          </View>

          <View style={styles.questionBlock}>
            <Text style={styles.questionLabel}>¿Has visitado una finca cafetera antes?</Text>
            <ProfileSingleSelector
              options={COFFEE_EXPERIENCE_OPTIONS}
              selected={coffeeExperience}
              onSelect={(v) => { setCoffeeExperience(v); markUnsaved(); }}
            />
          </View>

          <View style={styles.questionBlock}>
            <Text style={styles.questionLabel}>¿Qué te atrae más del café?</Text>
            <ProfileChipSelector
              options={COFFEE_INTERESTS_OPTIONS}
              selected={coffeeInterests}
              onToggle={(v) => { setCoffeeInterests(toggleChip(coffeeInterests, v)); markUnsaved(); }}
            />
          </View>
        </View>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/*              SECCIÓN 3: PERFIL DE EXPLORADOR                  */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🌿 Tu perfil de explorador</Text>
          </View>

          <View style={styles.questionBlock}>
            <Text style={styles.questionLabel}>¿Qué tipo de experiencias te interesan?</Text>
            <ProfileChipSelector
              options={EXPERIENCE_TYPES_OPTIONS}
              selected={experienceTypes}
              onToggle={(v) => { setExperienceTypes(toggleChip(experienceTypes, v)); markUnsaved(); }}
            />
          </View>

          <View style={styles.questionBlock}>
            <Text style={styles.questionLabel}>¿Qué tipo de naturaleza prefieres?</Text>
            <ProfileChipSelector
              options={NATURE_PREFERENCES_OPTIONS}
              selected={naturePreferences}
              onToggle={(v) => { setNaturePreferences(toggleChip(naturePreferences, v)); markUnsaved(); }}
            />
          </View>

          <View style={styles.questionBlock}>
            <Text style={styles.questionLabel}>¿Con quién sueles explorar?</Text>
            <ProfileSingleSelector
              options={TRAVEL_COMPANY_OPTIONS}
              selected={travelCompany}
              onSelect={(v) => { setTravelCompany(v); markUnsaved(); }}
            />
          </View>

          <View style={styles.questionBlock}>
            <Text style={styles.questionLabel}>¿Cuánto tiempo libre tienes para escapadas?</Text>
            <ProfileSingleSelector
              options={AVAILABLE_TIME_OPTIONS}
              selected={availableTime}
              onSelect={(v) => { setAvailableTime(v); markUnsaved(); }}
            />
          </View>
        </View>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/*                SECCIÓN 4: ESTILO DE VIAJE                     */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🏡 Tu estilo de viaje</Text>
          </View>

          <View style={styles.questionBlock}>
            <Text style={styles.questionLabel}>¿Qué ambiente de hospedaje prefieres?</Text>
            <ProfileSingleSelector
              options={LODGING_STYLE_OPTIONS}
              selected={lodgingStyle}
              onSelect={(v) => { setLodgingStyle(v); markUnsaved(); }}
            />
          </View>

          <View style={styles.questionBlock}>
            <Text style={styles.questionLabel}>¿Prefieres estar conectado o desconectarte?</Text>
            <ProfileSingleSelector
              options={CONNECTIVITY_OPTIONS}
              selected={connectivityPreference}
              onSelect={(v) => { setConnectivityPreference(v); markUnsaved(); }}
            />
          </View>

          <View style={styles.questionBlock}>
            <Text style={styles.questionLabel}>¿Cuándo sueles escaparte?</Text>
            <ProfileSingleSelector
              options={ESCAPE_TIME_OPTIONS}
              selected={escapeTime}
              onSelect={(v) => { setEscapeTime(v); markUnsaved(); }}
            />
          </View>
        </View>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/*              SECCIÓN 5: NECESIDADES + ADQUISICIÓN             */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>♿ Necesidades especiales</Text>
          </View>
          <Text style={styles.sectionSubtext}>
            Nos ayuda a recomendarte destinos accesibles y preparar mejor tu experiencia.
          </Text>

          <View style={styles.questionBlock}>
            <ProfileChipSelector
              options={SPECIAL_NEEDS_OPTIONS}
              selected={specialNeeds}
              onToggle={(v) => { setSpecialNeeds(toggleArrayItem(specialNeeds, v)); markUnsaved(); }}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📣 ¿Cómo nos conociste?</Text>
          </View>

          <View style={styles.questionBlock}>
            <ProfileSingleSelector
              options={ACQUISITION_OPTIONS}
              selected={acquisitionSource}
              onSelect={(v) => { setAcquisitionSource(v); markUnsaved(); }}
            />
          </View>
        </View>

        {/* ── Save Button (floating style) ─────────────────────────────── */}
        {hasUnsavedChanges && (
          <View style={styles.savePreferencesContainer}>
            <TouchableOpacity
              style={[styles.savePreferencesBtn, isSaving && styles.saveBtnDisabled]}
              onPress={handleSavePreferences}
              disabled={isSaving}
              activeOpacity={0.8}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={colors.onPrimary} />
              ) : (
                <Text style={styles.savePreferencesBtnText}>💾 Guardar cambios</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* ── Visited Destinations ────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Destinos visitados</Text>
            <Text style={styles.sectionCount}>
              {visitedDestinations.length}
            </Text>
          </View>
          <VisitedDestinationsList destinations={visitedDestinations} />
        </View>

        {/* ── Options ─────────────────────────────────────────────────── */}
        <View style={styles.optionsCard}>
          {/* Admin panel — solo visible para admin */}
          {user?.role === 'admin' && (
            <TouchableOpacity
              style={[styles.optionItem, styles.adminOption]}
              onPress={() => navigation.navigate('AdminDashboard')}
              activeOpacity={0.7}
            >
              <Text style={styles.adminText}>📊 Panel Admin</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.optionItem, styles.logoutOption]}
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator size="small" color={colors.accentUrgent} />
            ) : (
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Bottom spacing for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Full-screen saving overlay */}
      {isSaving && (
        <View style={styles.savingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.savingText}>Guardando...</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: spacing.massive,
  },
  // ── Sections ──────────────────────────────────────────────────
  section: {
    marginBottom: spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...textStyles.headlineSmall,
    color: colors.textPrimary,
    fontSize: 16,
  },
  sectionCount: {
    ...textStyles.meta,
    color: colors.textMuted,
    fontSize: 12,
  },
  sectionSubtext: {
    ...textStyles.body,
    color: colors.textMuted,
    fontSize: 12,
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.md,
  },
  editLink: {
    ...textStyles.bodySemiBold,
    color: colors.primary,
    fontSize: 13,
  },
  // ── Question blocks ───────────────────────────────────────────
  questionBlock: {
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.xl,
  },
  questionLabel: {
    ...textStyles.bodySemiBold,
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: spacing.sm,
  },
  input: {
    height: 48,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    fontSize: 14,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.outline,
    fontFamily: 'Inter',
  },
  // ── Bio ────────────────────────────────────────────────────────
  bioText: {
    ...textStyles.body,
    color: colors.textSecondary,
    paddingHorizontal: spacing.xxl,
    lineHeight: 22,
  },
  bioEditContainer: {
    marginHorizontal: spacing.xxl,
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    overflow: 'hidden',
  },
  bioInput: {
    ...textStyles.body,
    color: colors.textPrimary,
    padding: spacing.lg,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  bioFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  charCounter: {
    ...textStyles.meta,
    color: colors.textMuted,
    fontSize: 11,
    textTransform: 'none',
  },
  charCounterWarn: {
    color: colors.accentUrgent,
  },
  bioActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cancelBtn: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
  },
  cancelBtnText: {
    ...textStyles.bodySemiBold,
    color: colors.textMuted,
    fontSize: 13,
  },
  saveBtn: {
    backgroundColor: colors.secondary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderRadius: radii.sm,
    minWidth: 80,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    ...textStyles.bodyBold,
    color: colors.onSecondary,
    fontSize: 13,
  },
  // ── Save preferences button ──────────────────────────────────
  savePreferencesContainer: {
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.xxl,
  },
  savePreferencesBtn: {
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.neonPrimary,
  },
  savePreferencesBtnText: {
    ...textStyles.bodyBold,
    color: colors.onPrimary,
    fontSize: 15,
    letterSpacing: 0.3,
  },
  // ── Options card ──────────────────────────────────────────────
  optionsCard: {
    marginHorizontal: spacing.xxl,
    backgroundColor: 'rgba(10, 10, 15, 0.6)',
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderTopColor: colors.outline,
    ...shadows.glass,
    ...(Platform.OS === 'web'
      ? ({
          backdropFilter: 'blur(40px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
        } as any)
      : {}),
    overflow: 'hidden',
  },
  optionItem: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutOption: {
    borderTopWidth: 0,
  },
  adminOption: {
    borderBottomWidth: 1,
    borderBottomColor: colors.outline,
  },
  adminText: {
    ...textStyles.bodySemiBold,
    color: colors.secondary,
    fontSize: 15,
  },
  logoutText: {
    ...textStyles.bodySemiBold,
    color: colors.accentUrgent,
    fontSize: 15,
  },
  // ── Saving overlay ────────────────────────────────────────────
  savingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  savingText: {
    ...textStyles.bodyMedium,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
});

export default ProfileScreen;
