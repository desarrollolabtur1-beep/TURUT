/**
 * SplashScreen — Pantalla de bienvenida al arrancar la app
 *
 * Flujo:
 *  1. Muestra la animación TURUT (TurutLoadingAnimation) por SPLASH_DURATION ms
 *  2. Al completar → pasa al modo "en espera": animación congelada
 *     y aparece el hint "Toca para continuar"
 *  3. Al tocar → fade-out → navega a Login (LoginStepper)
 *
 * Si el usuario llega aquí por hardware back desde el LoginStepper,
 * queda en el modo estático hasta que toca la pantalla.
 */
import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/AppNavigator';
import TurutLoadingAnimation from '../../components/ui/TurutLoadingAnimation';
import { colors } from '../../theme';

// Duración de la animación inicial
const SPLASH_DURATION = 3500;

const SplashScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // false = animación corriendo | true = modo estático, esperando tap
  const [waitingForTap, setWaitingForTap] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const tapHintOpacity = useRef(new Animated.Value(0)).current;

  /** Se llama cuando TurutLoadingAnimation termina su ciclo */
  const handleAnimationComplete = useCallback(() => {
    setWaitingForTap(true);
    // Mostrar hint "Toca para continuar" con fade suave
    Animated.timing(tapHintOpacity, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [tapHintOpacity]);

  /** Usuario toca la pantalla → fade out → navega a Login */
  const handleTap = useCallback(() => {
    if (!waitingForTap) return; // Ignorar taps durante la animación
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('Login');
    });
  }, [waitingForTap, fadeAnim, navigation]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'left', 'right', 'bottom']}>
      <TouchableOpacity
        style={styles.touchOverlay}
        onPress={handleTap}
        activeOpacity={1}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {/* La animación corre una sola vez (SPLASH_DURATION), luego congela */}
          <TurutLoadingAnimation
            duration={SPLASH_DURATION}
            onComplete={handleAnimationComplete}
          />

          {/* Hint que aparece después de que termina la animación */}
          <Animated.Text
            style={[styles.tapHint, { opacity: tapHintOpacity }]}
          >
            Toca para continuar
          </Animated.Text>
        </Animated.View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  touchOverlay: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapHint: {
    position: 'absolute',
    bottom: 60,
    color: colors.textMuted,
    fontSize: 13,
    letterSpacing: 1,
    ...Platform.select({
      web: {
        // Parpadeo sutil solo en web (CSS animation)
        animationName: 'pulse-opacity',
        animationDuration: '2s',
        animationIterationCount: 'infinite',
      } as any,
      default: {},
    }),
  },
});

export default SplashScreen;
