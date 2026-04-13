/**
 * ExperimentsNavigator — Stack de navegación aislado del sandbox
 *
 * Este navigator es completamente independiente de AppNavigator y MainTabs.
 * Agregar nuevos experimentos aquí NO toca ningún archivo del proyecto real.
 *
 * Para agregar un experimento nuevo:
 *   1. Crear el archivo en src/experiments/auth/MiNuevoExperimento.tsx
 *   2. Agregar una línea en ExperimentsParamList
 *   3. Agregar un <Stack.Screen ... /> abajo
 *   4. Agregar el botón en ExperimentsMenu.tsx
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExperimentsMenu from './ExperimentsMenu';
import LoginStepper from './auth/LoginStepper';

/** Tipado del stack de experimentos */
export type ExperimentsParamList = {
  ExperimentsMenu: undefined;
  LoginStepper: undefined;
  // Agregar futuros experimentos aquí 👇
  // LoginMinimal: undefined;
  // LoginCard: undefined;
};

const Stack = createNativeStackNavigator<ExperimentsParamList>();

const ExperimentsNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="ExperimentsMenu" component={ExperimentsMenu} />
      <Stack.Screen name="LoginStepper" component={LoginStepper} />
      {/* Agregar futuros screens aquí 👇 */}
    </Stack.Navigator>
  );
};

export default ExperimentsNavigator;
