/**
 * ExperimentsMenu — Pantalla de selección del sandbox
 *
 * Muestra todos los experimentos disponibles en cards.
 * Para salir del sandbox: presiona el botón "← Volver a la App".
 */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ExperimentsParamList } from './ExperimentsNavigator';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { colors } from '../theme';

type ExperimentsMenuNav = NativeStackNavigationProp<ExperimentsParamList, 'ExperimentsMenu'>;

/** Datos de cada experimento visible en el menú */
const EXPERIMENTS: Array<{
  screen: keyof ExperimentsParamList;
  title: string;
  description: string;
  emoji: string;
  tag: string;
}> = [
  {
    screen: 'LoginStepper',
    title: 'Login Stepper',
    description: 'Formulario de login dividido en pasos animados con barra de progreso.',
    emoji: '🪜',
    tag: 'Auth · Paso a paso',
  },
  // Agregar futuros experimentos aquí 👇
];

const ExperimentsMenu: React.FC = () => {
  const navigation = useNavigation<ExperimentsMenuNav>();

  // Para salir del sandbox necesitamos el navigator padre (RootStack)
  const rootNavigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => rootNavigation.navigate('MainTabs')}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← App</Text>
        </TouchableOpacity>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🧪 SANDBOX</Text>
        </View>
      </View>

      <Text style={styles.title}>Experimentos</Text>
      <Text style={styles.subtitle}>
        Prototipos de login / register. Toca para previsualizar.
      </Text>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {EXPERIMENTS.map((exp) => (
          <TouchableOpacity
            key={exp.screen}
            style={styles.card}
            onPress={() => navigation.navigate(exp.screen)}
            activeOpacity={0.7}
          >
            <Text style={styles.cardEmoji}>{exp.emoji}</Text>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{exp.title}</Text>
              <Text style={styles.cardDesc}>{exp.description}</Text>
              <View style={styles.tagWrap}>
                <Text style={styles.tag}>{exp.tag}</Text>
              </View>
            </View>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  backButton: {
    paddingVertical: 6,
    paddingRight: 12,
  },
  backText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: 'rgba(160,32,240,0.15)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    paddingHorizontal: 20,
    marginBottom: 28,
    lineHeight: 20,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 14,
  },
  card: {
    backgroundColor: colors.surfaceContainerHigh,
    borderRadius: 16,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outline,
    gap: 14,
  },
  cardEmoji: {
    fontSize: 32,
  },
  cardBody: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardDesc: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  tagWrap: {
    marginTop: 6,
  },
  tag: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  cardArrow: {
    fontSize: 24,
    color: colors.textMuted,
  },
});

export default ExperimentsMenu;
