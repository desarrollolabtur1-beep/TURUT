/**
 * Tipos de navegación — sincronizados con AppNavigator.tsx
 * La fuente de verdad es RootStackParamList en AppNavigator.tsx
 * Este archivo re-exporta helpers tipados para usar en screens.
 */
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

export type SplashScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Splash'
>;
export type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Login'
>;
export type MainTabsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MainTabs'
>;
export type LandingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Landing'
>;
