import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

export const TurutLogo: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <Text style={styles.scriptS}>s</Text>
        <Text style={styles.mainText}>TURUT</Text>
        <Text style={styles.scriptS}>s</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainText: {
    fontFamily: 'Orbitron-Black',
    fontWeight: '900', // Orbitron se ve increíble en Black (900)
    fontSize: 39, 
    color: '#F8F0FF', 
    letterSpacing: 4,
    ...Platform.select({
      web: {
        fontFamily: "'Orbitron', sans-serif",
        // Efecto Reflejo Espejo bajo la tipografía (fades out into the floor)
        WebkitBoxReflect: 'below -10px linear-gradient(transparent, transparent 40%, rgba(255,255,255,0.4))',
        textShadow: `
          0 0 5px #fff,
          0 0 10px #fff,
          0 0 20px #B026FF,
          0 0 40px #A020F0,
          0 0 80px #A020F0,
          0 0 120px #8A2BE2
        `,
      } as any,
      default: {
        textShadowColor: '#A020F0',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 18,
      },
    }),
  },
  scriptS: {
    fontFamily: 'GreatVibes-Regular',
    fontSize: 26,
    color: '#D4AF37', // Dorado clásico
    marginTop: 15,
    marginHorizontal: 2,
    ...Platform.select({
      web: {
        fontFamily: "'Great Vibes', cursive",
        textShadow: `
          0 0 5px rgba(212, 175, 55, 0.6),
          0 0 15px rgba(212, 175, 55, 0.4)
        `,
      } as any,
      default: {
        textShadowColor: 'rgba(212, 175, 55, 0.6)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
      },
    }),
  },
});


