/**
 * TurutLoadingAnimation — Animación de carga con letras TURUT
 *
 * Extractada de DiscoverScreen para reutilizarse en:
 *  - SplashScreen (inicio de app)
 *  - DiscoverScreen (búsqueda de destinos)
 *
 * Props:
 *  - onComplete: callback al terminar (después de `duration` ms)
 *  - duration: duración total en ms (default: 3500)
 */
import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Animated as RNAnimated,
  Easing,
} from 'react-native';
import { colors, textStyles, shadows } from '../../theme';

interface TurutLoadingAnimationProps {
  onComplete: () => void;
  duration?: number;
}

const TurutLoadingAnimation: React.FC<TurutLoadingAnimationProps> = ({
  onComplete,
  duration = 3500,
}) => {
  const letters = ['T', 'U', 'R', 'U', 'T'];
  const letterAnims = useRef(letters.map(() => new RNAnimated.Value(0))).current;
  const glowAnim = useRef(new RNAnimated.Value(0)).current;
  const containerScale = useRef(new RNAnimated.Value(0.9)).current;
  const messageOpacity = useRef(new RNAnimated.Value(0)).current;

  useEffect(() => {
    // Scale in the container
    RNAnimated.timing(containerScale, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start();

    // Sequentially reveal each letter
    const letterSequence = letterAnims.map((anim) =>
      RNAnimated.timing(anim, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    );

    // Message fade in
    const messageFade = RNAnimated.timing(messageOpacity, {
      toValue: 1,
      duration: 500,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    });

    // Glow pulse (loop)
    const glowPulse = RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(glowAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        RNAnimated.timing(glowAnim, {
          toValue: 0.4,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    RNAnimated.stagger(80, letterSequence).start(() => {
      messageFade.start();
      glowPulse.start();
    });

    const completeTimer = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearTimeout(completeTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerOpacity = glowAnim.interpolate({
    inputRange: [0.4, 1],
    outputRange: [0.8, 1],
  });

  return (
    <View style={styles.container}>
      <RNAnimated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: containerScale }],
            opacity: containerOpacity,
          },
        ]}
      >
        <View style={styles.letterRow}>
          {letters.map((letter, i) => {
            const scale = letterAnims[i].interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.3, 1.15, 1],
            });
            const opacity = letterAnims[i].interpolate({
              inputRange: [0, 0.3, 1],
              outputRange: [0, 0.6, 1],
            });
            const translateY = letterAnims[i].interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            });

            return (
              <RNAnimated.Text
                key={i}
                style={[
                  styles.letter,
                  {
                    opacity,
                    transform: [{ scale }, { translateY }],
                  },
                ]}
              >
                {letter}
              </RNAnimated.Text>
            );
          })}
        </View>
      </RNAnimated.View>

      <RNAnimated.Text
        style={[styles.message, { opacity: messageOpacity }]}
      >
        ¿A dónde vamos?
      </RNAnimated.Text>

      {/* Decorative glowing ring */}
      <RNAnimated.View
        style={[
          styles.glowRing,
          {
            opacity: glowAnim.interpolate({
              inputRange: [0.4, 1],
              outputRange: [0.15, 0.4],
            }),
            transform: [
              {
                scale: glowAnim.interpolate({
                  inputRange: [0.4, 1],
                  outputRange: [0.95, 1.05],
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  letterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontFamily:
      Platform.OS === 'web' ? "'Orbitron', sans-serif" : 'Orbitron-Black',
    fontWeight: '900',
    fontSize: 48,
    color: '#F8F0FF',
    letterSpacing: 6,
    ...Platform.select({
      web: {
        textShadow: `
          0 0 5px #fff,
          0 0 10px #fff,
          0 0 20px #B026FF,
          0 0 40px #A020F0,
          0 0 80px #A020F0
        `,
      } as any,
      default: {
        textShadowColor: colors.primary,
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 18,
      },
    }),
  },
  message: {
    ...textStyles.headlineMedium,
    color: colors.textPrimary,
    marginTop: 32,
    textShadowColor: colors.primaryGlow,
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  glowRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
    ...shadows.neonPrimary,
  },
});

export default TurutLoadingAnimation;
