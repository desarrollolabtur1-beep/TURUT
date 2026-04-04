/**
 * LandingOverlay — Full-screen destination detail modal
 * Shows image hero, info, countdown timer, social links, and CTA
 */
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path, Rect, Line, Circle } from 'react-native-svg';
import { CountdownTimer } from '../components/ui/CountdownTimer';
import { GoldenButton } from '../components/ui/GoldenButton';
import { destinations } from '../data/destinations';
import { colors, radii, layout } from '../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CloseIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 6 6 18" />
    <Path d="m6 6 12 12" />
  </Svg>
);

const InstagramIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={2} y={2} width={20} height={20} rx={5} ry={5} />
    <Path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <Line x1={17.5} y1={6.5} x2={17.51} y2={6.5} />
  </Svg>
);

const FacebookIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </Svg>
);

const TwitterIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </Svg>
);

const LandingOverlay: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const destIndex = route.params?.destIndex ?? 0;
  const destination = destinations[destIndex];

  const [ctaActivated, setCtaActivated] = useState(false);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleCta = useCallback(() => {
    setCtaActivated(true);
  }, []);

  const handleWhatsApp = useCallback(() => {
    Linking.openURL(destination.wa);
  }, [destination.wa]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image */}
        <View style={styles.hero}>
          <Image source={destination.img} style={styles.heroImg} resizeMode="cover" />
          <TouchableOpacity
            style={[styles.closeBtn, { top: insets.top + 16 }]}
            onPress={handleClose}
          >
            <CloseIcon />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.category}>
            {destination.category.toUpperCase()} Y PAISAJE
          </Text>
          <Text style={styles.title}>{destination.name}</Text>
          <Text style={styles.desc}>{destination.desc}</Text>

          {/* Countdown Timer */}
          <CountdownTimer />

          {/* Social Links */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <InstagramIcon />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <FacebookIcon />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <TwitterIcon />
            </TouchableOpacity>
          </View>

          {/* CTA */}
          <GoldenButton
            label={ctaActivated ? '¡Bono Activado!' : 'Activar Bono de Ahorro'}
            variant={ctaActivated ? 'success' : 'default'}
            onPress={handleCta}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    position: 'relative',
    width: '100%',
  },
  heroImg: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.4,
  },
  closeBtn: {
    position: 'absolute',
    left: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    zIndex: 10,
  },
  content: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    padding: 24,
    paddingBottom: 96,
    zIndex: 5,
  },
  category: {
    color: colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2.4,
    fontSize: 11.2,
  },
  title: {
    fontFamily: 'Montserrat-ExtraBold',
    fontSize: 32,
    color: colors.white,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  desc: {
    color: colors.textSecondary,
    marginBottom: 32,
    lineHeight: 27.2,
    fontSize: 16,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
  },
  socialBtn: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.textPrimary,
  },
});

export default LandingOverlay;
