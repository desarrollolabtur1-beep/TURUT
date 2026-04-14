/**
 * AppNavigator — Root navigation stack
 *
 * Auth Guard:
 *   - Sin token → pantalla Login (LoginStepper)
 *   - Con token  → MainTabs + Landing
 * Sandbox:
 *   - Experiments (solo si EXPERIMENTS_ENABLED = true en experiments/config.ts)
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import LandingOverlay from '../screens/LandingOverlay';
import LoginStepper from '../screens/auth/LoginStepper';
import { useAuth } from '../context/AuthContext';
// 🧪 Sandbox — solo se carga si EXPERIMENTS_ENABLED = true
import { EXPERIMENTS_ENABLED } from '../experiments/config';
import ExperimentsNavigator from '../experiments/ExperimentsNavigator';

export type RootStackParamList = {
  MainTabs: undefined;
  Login: undefined;
  Landing: { destIndex: number };
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
        }}
      >
        {/* 🧪 Sandbox — desactivar en producción cambiando config.ts */}
        {EXPERIMENTS_ENABLED && (
          <Stack.Screen name="Experiments" component={ExperimentsNavigator} />
        )}

        {/* ── Auth Guard ────────────────────────────────────────────────────
            React Navigation detecta el cambio de token automáticamente:
            - Login exitoso  → token != null → navega a MainTabs
            - Logout / 401   → token = null  → navega a Login
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
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginStepper} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
