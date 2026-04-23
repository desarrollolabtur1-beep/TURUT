/**
 * AdminDashboardScreen — Analytics dashboard for admin users
 * Shows aggregated profile data from all users
 * Cost: $0 — runs on existing infrastructure
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api.service';
import { colors, textStyles, radii, spacing, shadows } from '../../theme';

// ── Label maps (valor técnico → texto legible) ──────────────────────────────

const LABELS: Record<string, Record<string, string>> = {
  experienceTypes: {
    naturaleza: '🌄 Naturaleza',
    cultura: '🏛️ Cultura',
    gastronomia: '🍽️ Gastronomía',
    entretenimiento: '🎉 Entretenimiento',
    bienestar: '🧘 Bienestar',
    fotografia: '📸 Fotografía',
  },
  travelCompany: {
    solo: '🧍 Solo',
    pareja: '💑 En pareja',
    familia: '👨‍👩‍👧 En familia',
    amigos: '👥 Con amigos',
  },
  availableTime: {
    medio_dia: '⚡ Medio día',
    dia_completo: '🌅 Día completo',
    fin_de_semana: '🏕️ Fin de semana',
    varios_dias: '✈️ Varios días',
  },
  coffeeExperience: {
    varias_veces: '☕ Varias veces',
    una_vez: '🌱 Una vez',
    nunca: '✨ Nunca (primera vez)',
  },
  coffeeInterests: {
    catar: '☕ Catar',
    proceso: '🌱 Proceso',
    paisaje: '🏞️ Paisaje',
    fotografia: '📷 Fotografía',
    comprar: '🛒 Comprar',
  },
  naturePreferences: {
    montana: '🌄 Montaña',
    rios_cascadas: '💧 Ríos/Cascadas',
    bosque_fauna: '🌳 Bosque',
    paisaje_cafetero: '🌾 Paisaje cafetero',
    cielos_nocturnos: '🌙 Cielos nocturnos',
  },
  lodgingStyle: {
    rustico: '🏕️ Rústico',
    finca_tradicional: '🏡 Finca tradicional',
    confortable: '🏨 Confortable',
  },
  connectivityPreference: {
    necesito_wifi: '📶 Necesita WiFi',
    desconectarme: '📵 Desconectarse',
    me_da_igual: '🤷 Indiferente',
  },
  escapeTime: {
    fines_de_semana: '📅 Fines de semana',
    puentes_festivos: '🌴 Puentes',
    vacaciones: '✈️ Vacaciones',
    flexible: '⚡ Flexible',
  },
  specialNeeds: {
    movilidad_reducida: '♿ Movilidad reducida',
    bebe_nino: '👶 Bebé/Niño',
    mascota: '🐕 Mascota',
    adulto_mayor: '👴 Adulto mayor',
    auditiva_visual: '🦻 Auditiva/Visual',
    ninguna: '✅ Ninguna',
  },
  acquisitionSources: {
    instagram_tiktok: '📱 Instagram/TikTok',
    google: '🔍 Google',
    recomendacion: '👤 Recomendación',
    publicidad: '📰 Publicidad',
    evento: '🎪 Evento',
    otro: '💬 Otro',
  },
  genders: {
    masculino: '👨 Masculino',
    femenino: '👩 Femenino',
    otro: '🧑 Otro',
    prefiero_no_decir: '🤷 Prefiero no decir',
  },
};

const getLabel = (category: string, key: string): string => {
  return LABELS[category]?.[key] ?? key;
};

// ── Tipos ────────────────────────────────────────────────────────────────────

interface AnalyticsData {
  totalUsers: number;
  completedProfiles: number;
  completionRate: number;
  cities: Record<string, number>;
  genders: Record<string, number>;
  experienceTypes: Record<string, number>;
  travelCompany: Record<string, number>;
  availableTime: Record<string, number>;
  coffeeExperience: Record<string, number>;
  coffeeInterests: Record<string, number>;
  naturePreferences: Record<string, number>;
  lodgingStyle: Record<string, number>;
  connectivityPreference: Record<string, number>;
  escapeTime: Record<string, number>;
  specialNeeds: Record<string, number>;
  acquisitionSources: Record<string, number>;
}

// ── Componentes internos ────────────────────────────────────────────────────

const StatCard: React.FC<{ label: string; value: string | number; accent?: boolean }> = ({
  label,
  value,
  accent,
}) => (
  <View style={[styles.statCard, accent && styles.statCardAccent]}>
    <Text style={[styles.statValue, accent && styles.statValueAccent]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const BarChart: React.FC<{
  title: string;
  data: Record<string, number>;
  total: number;
  category: string;
}> = ({ title, data, total, category }) => {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    return (
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>{title}</Text>
        <Text style={styles.noData}>Sin datos aún</Text>
      </View>
    );
  }

  const maxVal = Math.max(...entries.map(([, v]) => v));

  return (
    <View style={styles.chartCard}>
      <Text style={styles.chartTitle}>{title}</Text>
      {entries.map(([key, count]) => {
        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
        const barWidth = maxVal > 0 ? (count / maxVal) * 100 : 0;

        return (
          <View key={key} style={styles.barRow}>
            <Text style={styles.barLabel} numberOfLines={1}>
              {getLabel(category, key)}
            </Text>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, { width: `${barWidth}%` }]} />
            </View>
            <Text style={styles.barCount}>
              {count} ({pct}%)
            </Text>
          </View>
        );
      })}
    </View>
  );
};

// ── Pantalla Principal ──────────────────────────────────────────────────────

const AdminDashboardScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'stats' | 'users'>('stats');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      // Fetch both simultaneously
      const [analyticsRes, usersRes] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/users')
      ]);
      setData(analyticsRes.data.data);
      setUsersList(usersRes.data.data || []);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Error al cargar datos de admin';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando analytics...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorText}>{error ?? 'Error desconocido'}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchData}>
          <Text style={styles.retryBtnText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>📊 Panel Admin</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'stats' && styles.tabBtnActive]} 
          onPress={() => setActiveTab('stats')}
        >
          <Text style={[styles.tabText, activeTab === 'stats' && styles.tabTextActive]}>📈 Estadísticas</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tabBtn, activeTab === 'users' && styles.tabBtnActive]} 
          onPress={() => setActiveTab('users')}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.tabTextActive]}>👥 Personas ({usersList.length})</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'stats' ? (
        <>
          {/* Summary stats */}
          <View style={styles.statsRow}>
            <StatCard label="Usuarios totales" value={data.totalUsers} accent />
            <StatCard label="Perfiles completos" value={data.completedProfiles} />
            <StatCard label="Tasa completado" value={`${data.completionRate}%`} />
          </View>

          {/* Charts */}
      <BarChart
        title="☕ Experiencia con café"
        data={data.coffeeExperience}
        total={data.totalUsers}
        category="coffeeExperience"
      />

      <BarChart
        title="☕ Intereses en café"
        data={data.coffeeInterests}
        total={data.totalUsers}
        category="coffeeInterests"
      />

      <BarChart
        title="🌿 Preferencias de naturaleza"
        data={data.naturePreferences}
        total={data.totalUsers}
        category="naturePreferences"
      />

      <BarChart
        title="🎯 Tipos de experiencia"
        data={data.experienceTypes}
        total={data.totalUsers}
        category="experienceTypes"
      />

      <BarChart
        title="👥 ¿Con quién viajan?"
        data={data.travelCompany}
        total={data.totalUsers}
        category="travelCompany"
      />

      <BarChart
        title="⏱️ Tiempo disponible"
        data={data.availableTime}
        total={data.totalUsers}
        category="availableTime"
      />

      <BarChart
        title="🏡 Estilo de hospedaje"
        data={data.lodgingStyle}
        total={data.totalUsers}
        category="lodgingStyle"
      />

      <BarChart
        title="📶 Conectividad"
        data={data.connectivityPreference}
        total={data.totalUsers}
        category="connectivityPreference"
      />

      <BarChart
        title="📅 ¿Cuándo se escapan?"
        data={data.escapeTime}
        total={data.totalUsers}
        category="escapeTime"
      />

      <BarChart
        title="♿ Necesidades especiales"
        data={data.specialNeeds}
        total={data.totalUsers}
        category="specialNeeds"
      />

      <BarChart
        title="📣 ¿Cómo nos conocieron?"
        data={data.acquisitionSources}
        total={data.totalUsers}
        category="acquisitionSources"
      />

      <BarChart
        title="🏙️ Ciudades"
        data={data.cities}
        total={data.totalUsers}
        category="cities"
      />

      <BarChart
        title="👤 Género"
        data={data.genders}
        total={data.totalUsers}
        category="genders"
      />
        </>
      ) : (
        <View style={styles.userListContainer}>
          {usersList.map((usr) => (
            <View key={usr._id} style={styles.userCard}>
              <View style={styles.userCardHeader}>
                <Text style={styles.userName}>{usr.firstName} {usr.lastName}</Text>
                {usr.city && <Text style={styles.userCity}>📍 {usr.city}</Text>}
              </View>
              <Text style={styles.userDetails}>✉️ {usr.email}</Text>
              {usr.phone && <Text style={styles.userDetails}>📞 {usr.phone}</Text>}
              
              <View style={styles.userTags}>
                {usr.gender && <View style={styles.tag}><Text style={styles.tagText}>{getLabel('genders', usr.gender)}</Text></View>}
                {usr.acquisitionSource && <View style={styles.tag}><Text style={styles.tagText}>{getLabel('acquisitionSources', usr.acquisitionSource)}</Text></View>}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Bottom spacing */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

// ── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingTop: spacing.massive,
    paddingBottom: spacing.massive,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.md,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.xl,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radii.pill,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: radii.pill,
  },
  tabBtnActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    ...textStyles.bodySemiBold,
    color: colors.textSecondary,
    fontSize: 13,
  },
  tabTextActive: {
    color: colors.onPrimary,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    color: colors.textPrimary,
    fontSize: 16,
  },
  headerTitle: {
    ...textStyles.headlineMedium,
    color: colors.textPrimary,
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xxl,
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outline,
  },
  statCardAccent: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  statValue: {
    ...textStyles.headlineLarge,
    color: colors.textPrimary,
    fontSize: 22,
  },
  statValueAccent: {
    color: colors.primary,
  },
  statLabel: {
    ...textStyles.body,
    color: colors.textMuted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  // Chart cards
  chartCard: {
    marginHorizontal: spacing.xxl,
    marginBottom: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  chartTitle: {
    ...textStyles.bodySemiBold,
    color: colors.textPrimary,
    fontSize: 14,
    marginBottom: spacing.md,
  },
  noData: {
    ...textStyles.body,
    color: colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  barLabel: {
    ...textStyles.body,
    color: colors.textSecondary,
    fontSize: 11,
    width: 120,
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surfaceContainerHighest,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
    minWidth: 2,
  },
  barCount: {
    ...textStyles.bodyMedium,
    color: colors.textMuted,
    fontSize: 10,
    width: 55,
    textAlign: 'right',
  },
  // Error
  errorEmoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  errorText: {
    ...textStyles.body,
    color: colors.accentUrgent,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
  },
  retryBtnText: {
    ...textStyles.bodyBold,
    color: colors.onPrimary,
  },
  // Loading
  loadingText: {
    ...textStyles.body,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  // Users List
  userListContainer: {
    paddingHorizontal: spacing.xxl,
    gap: spacing.md,
  },
  userCard: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.outline,
  },
  userCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  userName: {
    ...textStyles.headlineSmall,
    color: colors.textPrimary,
    fontSize: 16,
  },
  userCity: {
    ...textStyles.bodySemiBold,
    color: colors.textSecondary,
    fontSize: 12,
  },
  userDetails: {
    ...textStyles.body,
    color: colors.textSecondary,
    fontSize: 13,
    marginBottom: spacing.md,
  },
  userTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  tag: {
    backgroundColor: colors.surfaceContainerHighest,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radii.sm,
  },
  tagText: {
    ...textStyles.body,
    color: colors.textPrimary,
    fontSize: 10,
  },
});

export default AdminDashboardScreen;
