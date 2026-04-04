/**
 * TurutHeader — Enhanced Full Header with Premium Aesthetics
 * Features: Refined logo presentation, enhanced gradients, improved spacing
 */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TurutLogo } from './TurutLogo';
import { colors } from '../../theme';
import Svg, { Path, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Enhanced noise pattern for richer texture
const noiseBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAAAAP8AAAAAAAABAQEAAAAAAAAAAAB3e7vUAAAACHRSTlMAMwAzOjo6Oub+U+QAAAAlSURBVEjH7dGxCgAhEEPRd3b/v7ltd4JYsAQt5qBfIHw+Jsm12fG9r0tL/9b10p/1Tbo/91t/1jfp/txv/dnf+iffX/utP+ubdH/ut/6sb9L9ud/6sz/0T76/9lt/1jfp/txv/ZlH2r9f4yLhYvYAAAAASUVORK5CYII=';

const MapPinIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.dateGold} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <Circle cx={12} cy={10} r={3} />
  </Svg>
);

const WeatherIcon = () => (
  <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2v2" />
    <Path d="m4.93 4.93 1.41 1.41" />
    <Path d="M20 12h2" />
    <Path d="m19.07 4.93-1.41 1.41" />
    <Path d="M15.947 12.65a4 4 0 0 0-5.925-4.128" />
    <Path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" />
  </Svg>
);

export const TurutHeader: React.FC = () => {
  const dateStr = useMemo(() => {
    const d = new Date();
    const weekday = d.toLocaleDateString('es-CO', { weekday: 'short' }).replace(/\./g, '').toUpperCase();
    const day = d.getDate();
    const month = d.toLocaleDateString('es-CO', { month: 'short' }).replace(/\./g, '').toUpperCase();
    return `${weekday} ${day} DE ${month}`;
  }, []);

  return (
    <View style={styles.container}>
      {/* Enhanced Dark Premium Gradient with Depth */}
      <LinearGradient
        colors={['rgba(15,0,25,0.9)', 'rgba(8,0,15,0.95)', 'rgba(3,3,3,1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Subtle Noise Texture Overlay */}
      <View style={styles.noiseOverlay}>
        <Image source={{ uri: noiseBase64 }} style={styles.noiseImage} resizeMode="repeat" />
      </View>

      {/* Header Content with Improved Spacing */}
      <View style={styles.headerContent}>
        {/* Logo Area with Enhanced Neon Effects */}
        <View style={styles.logoArea}>
          {/* Outer Neon Glow */}
          <View style={styles.outerNeonGlow} />
          {/* Inner Neon Glow */}
          <View style={styles.innerNeonGlow} />
          <TurutLogo />
        </View>

        {/* Refined Info Bar */}
        <View style={styles.infoBar}>
          <View style={styles.infoLeft}>
            <Text style={styles.date}>{dateStr}</Text>
            <View style={styles.separatorContainer}>
              <Text style={styles.separator}>|</Text>
            </View>
            <View style={styles.weather}>
              <WeatherIcon />
              <Text style={styles.temp}>28°C</Text>
            </View>
          </View>
          <View style={styles.infoRight}>
            <MapPinIcon />
            <Text style={styles.city}>Ibagué</Text>
          </View>
        </View>
      </View>

      {/* Refined Concave Base Mask */}
      <View style={styles.concaveMaskContainer}>
        <Svg height={35} width={width} viewBox="0 0 390 35" preserveAspectRatio="none">
          <Path d="M0,0 Q195,35 390,0 L390,35 L0,35 Z" fill={colors.background} />
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 50,
    paddingTop: 20,
    position: 'relative',
    paddingBottom: 35,
  },
  noiseOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.06,
    overflow: 'hidden',
  },
  noiseImage: {
    width: '100%',
    height: '100%',
  },
  headerContent: {
    paddingHorizontal: 28,
    paddingBottom: 12,
  },
  logoArea: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginTop: -8,       // Empuja todo el logo hacia arriba
    marginBottom: 5,     // Reduce espacio entre logo e infoBar
    paddingTop: 5,       // Reducido desde 15
    paddingBottom: 5,    // Reducido desde 15
  },
  outerNeonGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 140, // Reducido para acoplarse al nuevo tamaño
    height: 70,
    marginTop: -35,
    marginLeft: -70,
    backgroundColor: '#A020F0',
    opacity: 0.1,
    borderRadius: 70,
    shadowColor: '#A020F0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 50,
    elevation: 15,
  },
  innerNeonGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 100, // Reducido
    height: 50, // Reducido
    marginTop: -25,
    marginLeft: -50,
    backgroundColor: '#A020F0',
    opacity: 0.2,
    borderRadius: 60,
    shadowColor: '#A020F0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 30,
    elevation: 10,
  },
  infoBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 12,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  date: {
    color: colors.dateGold,
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  separatorContainer: {
    paddingHorizontal: 6,
  },
  separator: {
    color: 'rgba(214, 168, 72, 0.4)',
    fontWeight: '300',
    fontSize: 16,
  },
  weather: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  temp: {
    color: '#F0F0F0',
    fontFamily: 'Inter',
    fontWeight: '500',
    fontSize: 14,
    letterSpacing: 0.3,
  },
  city: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  concaveMaskContainer: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
  },
});
