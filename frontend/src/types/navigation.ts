/**
 * Helpers de navegación. Fuente de verdad: RootStackParamList en AppNavigator.tsx.
 */
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

export type { RootStackParamList };

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
export type OnboardingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Onboarding'
>;
export type TermsConditionsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'TermsConditions'
>;
export type ForgotPasswordScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ForgotPassword'
>;
export type LandingScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Landing'
>;
export type AdminDashboardScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AdminDashboard'
>;
export type ExperimentsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Experiments'
>;
