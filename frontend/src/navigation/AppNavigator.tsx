/**
 * AppNavigator — Root navigation stack
 * Main tabs + modal screens (Landing overlay)
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabs from './MainTabs';
import LandingOverlay from '../screens/LandingOverlay';
// 🧪 Sandbox — solo se carga si EXPERIMENTS_ENABLED = true
import { EXPERIMENTS_ENABLED } from '../experiments/config';
import ExperimentsNavigator from '../experiments/ExperimentsNavigator';

export type RootStackParamList = {
  MainTabs: undefined;
  Landing: { destIndex: number };
  Experiments: undefined; // 🧪 Sandbox screen
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
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
        initialRouteName={EXPERIMENTS_ENABLED ? 'Experiments' : 'MainTabs'}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="Landing"
          component={LandingOverlay}
          options={{
            presentation: 'fullScreenModal',
            animation: 'slide_from_bottom',
          }}
        />
        {/* 🧪 Sandbox — desactivar en producción: config.ts */}
        {EXPERIMENTS_ENABLED && (
          <Stack.Screen name="Experiments" component={ExperimentsNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
