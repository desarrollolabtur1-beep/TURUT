/**
 * LandingOverlay — Full-screen destination detail modal
 * Shows image hero, info, countdown timer, social links, and CTA
 */
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Dimensions,
  Platform,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path, Rect, Line, Circle } from 'react-native-svg';
import { GoldenButton } from '../components/ui/GoldenButton';
import { destinations } from '../data/destinations';
import { colors, radii, layout, textStyles } from '../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CloseIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 6 6 18" />
    <Path d="m6 6 12 12" />
  </Svg>
);

const InstagramIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={2} y={2} width={20} height={20} rx={5} ry={5} />
    <Path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <Line x1={17.5} y1={6.5} x2={17.51} y2={6.5} />
  </Svg>
);

const FacebookIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </Svg>
);

const WhatsAppIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </Svg>
);

const MapPinIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Circle cx={12} cy={10} r={3} />
  </Svg>
);

const LandingOverlay: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const destIndex = route.params?.destIndex ?? 0;
  const destination = destinations[destIndex];

  const [ctaActivated, setCtaActivated] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    if (!destination.gallery || destination.gallery.length <= 1) return;
    const interval = setInterval(() => {
      setGalleryIndex((prev) => (prev + 1) % destination.gallery!.length);
    }, 6000); // 6 seconds
    return () => clearInterval(interval);
  }, [destination.gallery]);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleCta = useCallback(() => {
    setCtaActivated(true);
  }, []);

  const handleWhatsApp = useCallback(() => {
    if (destination.wa) {
      Linking.openURL(destination.wa);
    }
  }, [destination.wa]);

  const handleGoogleMaps = useCallback(() => {
    const url = destination.maps || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination.name)}`;
    Linking.openURL(url);
  }, [destination.name, destination.maps]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Image */}
        <TouchableOpacity activeOpacity={0.9} onPress={() => setIsFullScreen(true)} style={[styles.hero, { backgroundColor: '#000' }]}>
          <Image 
            source={destination.gallery && destination.gallery.length > 0 ? destination.gallery[galleryIndex] : destination.img} 
            style={styles.heroImg} 
            resizeMode="contain" 
          />
          <TouchableOpacity
            style={[styles.closeBtn, { top: insets.top + 16 }]}
            onPress={handleClose}
          >
            <CloseIcon />
          </TouchableOpacity>
        </TouchableOpacity>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.category}>
            {destination.category.toUpperCase()} Y PAISAJE
          </Text>
          <Text style={styles.title}>{destination.name}</Text>
          <View style={styles.descContainer}>
            <Text style={styles.descText}>{destination.desc}</Text>
          </View>

          {/* Extra Info Box */}
          {destination.extraInfo && (
            <View style={styles.infoContainer}>
              <Text style={styles.infoBoxText}>{destination.extraInfo}</Text>
            </View>
          )}

          {/* CTA */}
          <View style={styles.ctaWrapper}>
            <GoldenButton
              label={ctaActivated ? '¡Bono Activado!' : 'Activar Bono de Ahorro'}
              variant={ctaActivated ? 'success' : 'default'}
              onPress={handleCta}
            />
          </View>

          {/* Social Links */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <InstagramIcon color="#E1306C" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <FacebookIcon color="#1877F2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} onPress={handleWhatsApp}>
              <WhatsAppIcon color="#25D366" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn} onPress={handleGoogleMaps}>
              <MapPinIcon color="#EA4335" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Fullscreen Image Modal */}
      <Modal visible={isFullScreen} transparent={true} animationType="fade" onRequestClose={() => setIsFullScreen(false)}>
        <View style={styles.fullScreenContainer}>
          <TouchableOpacity 
            style={[styles.closeBtn, { top: insets.top + 16, zIndex: 10 }]} 
            onPress={() => setIsFullScreen(false)}
          >
            <CloseIcon />
          </TouchableOpacity>
          <Image 
            source={destination.gallery && destination.gallery.length > 0 ? destination.gallery[galleryIndex] : destination.img} 
            style={styles.fullScreenImg} 
            resizeMode="contain" 
          />
        </View>
      </Modal>
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
    height: SCREEN_HEIGHT * 0.35,
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
    color: '#00E5FF',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2.4,
    fontSize: 11.2,
  },
  title: {
    fontFamily: Platform.OS === 'web' ? 'Georgia, serif' : 'serif',
    fontSize: 32,
    color: colors.white,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  descContainer: {
    marginBottom: 28,
    paddingLeft: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#B829EA',
  },
  descText: {
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 26,
    fontSize: 15.5,
  },
  ctaWrapper: {
    marginTop: 8,
    marginBottom: 32,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 16,
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
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 28,
  },
  infoBoxText: {
    color: '#E2E8F0',
    fontWeight: '400',
    fontSize: 13.5,
    lineHeight: 22,
    textAlign: 'left',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImg: {
    width: '100%',
    height: '100%',
  },
});

export default LandingOverlay;
