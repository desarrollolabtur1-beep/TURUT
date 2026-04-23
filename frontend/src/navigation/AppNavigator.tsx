/**
 * AppNavigator — Root navigation stack
 *
 * Auth Guard:
 *   Sin token →  Splash → Login (LoginStepper)
 *   Con token →  MainTabs + Landing
 * Sandbox:
 *   Experiments (solo si EXPERIMENTS_ENABLED = true en experiments/config.ts)
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import LandingOverlay from '../screens/LandingOverlay';
import SplashScreen from '../screens/auth/SplashScreen';
import LoginStepper from '../screens/auth/LoginStepper';
import TermsScreen from '../screens/auth/TermsScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import { useAuth } from '../context/AuthContext';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
// 🧪 Sandbox — solo se carga si EXPERIMENTS_ENABLED = true
import { EXPERIMENTS_ENABLED } from '../experiments/config';
import ExperimentsNavigator from '../experiments/ExperimentsNavigator';

export type RootStackParamList = {
  MainTabs: undefined;
  Splash: undefined;
  Login: undefined;
  TermsConditions: undefined;
  ForgotPassword: undefined;
  Landing: { destIndex: number };
  AdminDashboard: undefined;
  Experiments: undefined; // 🧪 Sandbox screen
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { token } = useAuth();

  return (
    <NavigationContainer
      documentTitle={{
        formatter: () => 'TURUT — ¿ A dónde vamos?',
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          // Transición suave entre Splash → Login → MainTabs
          animation: 'fade',
        }}
      >
        {/* 🧪 Sandbox — desactivar en producción cambiando config.ts */}
        {EXPERIMENTS_ENABLED && (
          <Stack.Screen name="Experiments" component={ExperimentsNavigator} />
        )}

        {/* ── Auth Guard ─────────────────────────────────────────────────────
            React Navigation detecta el cambio de token automáticamente:
              - Login exitoso  → token != null → navega a MainTabs (auth guard)
              - Logout / 401   → token = null  → navega a Splash (auth guard)
        ──────────────────────────────────────────────────────────────────── */}
        {token ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen
              name="Landing"
              component={LandingOverlay}
              options={{
                presentation: 'fullScreenModal',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="AdminDashboard"
              component={AdminDashboardScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
          </>
        ) : (
          <>
            {/* Flujo sin sesión: Splash → Login */}
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginStepper} />
            <Stack.Screen
              name="TermsConditions"
              component={TermsScreen}
              options={{
                presentation: 'fullScreenModal',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{
                animation: 'slide_from_right',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
