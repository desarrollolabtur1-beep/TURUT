/**
 * LandingOverlay — Full-screen destination detail modal
 * Shows image hero, benefits grid, info card, social links, and CTA
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
import Svg, { Path, Rect, Line, Circle, Polyline, Polygon } from 'react-native-svg';
import { GoldenButton } from '../components/ui/GoldenButton';
import { destinations } from '../data/destinations';
import { colors, radii, layout, textStyles } from '../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// ── SVG Icon Components ──

const CloseIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 6 6 18" />
    <Path d="m6 6 12 12" />
  </Svg>
);

const LeafIcon = ({ color = '#C9956B', size = 28 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M7 17 C 2 12, 5 5, 19 4 C 19 18, 12 21, 7 17 Z" />
    <Path d="M4.5 20.5 L 7 17 Q 10.5 12 15.5 7.5" />
  </Svg>
);

const CoffeeIcon = ({ color = '#C9956B', size = 28 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 8h1a4 4 0 1 1 0 8h-1" />
    <Path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
    <Line x1="6" y1="2" x2="6" y2="4" />
    <Line x1="10" y1="2" x2="10" y2="4" />
    <Line x1="14" y1="2" x2="14" y2="4" />
  </Svg>
);

const MountainIcon = ({ color = '#C9956B', size = 28 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M8 3l4 8 5-5 5 15H2L8 3z" />
  </Svg>
);

const BriefcaseIcon = ({ color = '#C9956B', size = 28 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <Path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </Svg>
);

// Experience card icons
const PoolIcon = ({ color = '#C9956B', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M2 20c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
    <Path d="M2 17c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
    <Path d="M7 12V7a3 3 0 0 1 6 0v5" />
  </Svg>
);

const DiceIcon = ({ color = '#C9956B', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="2" y="2" width="20" height="20" rx="3" ry="3" />
    <Circle cx="8" cy="8" r="1" fill={color} />
    <Circle cx="16" cy="8" r="1" fill={color} />
    <Circle cx="8" cy="16" r="1" fill={color} />
    <Circle cx="16" cy="16" r="1" fill={color} />
    <Circle cx="12" cy="12" r="1" fill={color} />
  </Svg>
);

const BallIcon = ({ color = '#C9956B', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10" />
    <Path d="M12 2a15 15 0 0 0-4 10 15 15 0 0 0 4 10" />
    <Line x1="2" y1="12" x2="22" y2="12" />
  </Svg>
);

const CoworkIcon = ({ color = '#C9956B', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 8h1a4 4 0 1 1 0 8h-1" />
    <Path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
    <Line x1="6" y1="2" x2="6" y2="4" />
    <Line x1="10" y1="2" x2="10" y2="4" />
    <Line x1="14" y1="2" x2="14" y2="4" />
  </Svg>
);

// Social icons
const InstagramIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x={2} y={2} width={20} height={20} rx={5} ry={5} />
    <Path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <Line x1={17.5} y1={6.5} x2={17.51} y2={6.5} />
  </Svg>
);

const FacebookIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </Svg>
);

const WhatsAppIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </Svg>
);

const MapPinIcon = ({ color = 'currentColor' }: { color?: string }) => (
  <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Circle cx={12} cy={10} r={3} />
  </Svg>
);

const CheckIcon = ({ color = '#C9956B' }: { color?: string }) => (
  <Svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Polyline points="20 6 9 17 4 12" />
  </Svg>
);

// ── Benefit data for Kajol ──
const KAJOL_BENEFITS = [
  {
    Icon: LeafIcon,
    title: 'Alojamiento\nrural sostenible',
    desc: 'Descansa en armonía\ncon la naturaleza.',
  },
  {
    Icon: CoffeeIcon,
    title: 'Experiencias\nde café únicas',
    desc: 'Sabores locales que\nte conectan.',
  },
  {
    Icon: MountainIcon,
    title: 'Naturaleza +\ntranquilidad',
    desc: 'Paisajes que invitan\nal descanso.',
  },
  {
    Icon: BriefcaseIcon,
    title: 'Cowork y\nbienestar',
    desc: 'Espacios para trabajar,\nrelajarte y disfrutar.',
  },
];

// ── Experience card icons mapping ──
const EXPERIENCE_ICONS: Record<string, React.FC<{ color?: string; size?: number }>> = {
  'Piscina y jacuzzi': PoolIcon,
  'Juegos tradicionales': DiceIcon,
  'Mini cancha funcional': BallIcon,
  'Cowork, café y bienestar': CoworkIcon,
};

// ── Main Component ──
const LandingOverlay: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const destIndex = route.params?.destIndex ?? 0;
  const destination = destinations[destIndex];

  const [ctaActivated, setCtaActivated] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const isKajol = destination.name.includes('KAJOL');

  useEffect(() => {
    if (!destination.gallery || destination.gallery.length <= 1) return;
    const interval = setInterval(() => {
      setGalleryIndex((prev) => (prev + 1) % destination.gallery!.length);
    }, 6000);
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

  // Parse experience items from extraInfo (separated by ·)
  const experienceItems = destination.extraInfo
    ? destination.extraInfo.split('·').map((item: string) => item.trim()).filter(Boolean)
    : [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── 1. HERO IMAGE ── */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setIsFullScreen(true)}
          style={[styles.hero, { backgroundColor: '#000' }]}
        >
          <Image
            source={
              destination.gallery && destination.gallery.length > 0
                ? destination.gallery[galleryIndex]
                : destination.img
            }
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

        {/* ── Content ── */}
        <View style={styles.content}>

          {/* ── 2. CATEGORY LABEL ── */}
          <Text style={styles.category}>
            {destination.category.toUpperCase()} Y PAISAJE
          </Text>

          {/* ── 3. TITLE ── */}
          {isKajol ? (
            <View style={styles.titleBlock}>
              <Text style={styles.titleText}>JARDINES DE BERLÍN</Text>
              <Text style={styles.titleText}>KAJOL</Text>
            </View>
          ) : (
            <Text style={styles.titleText}>{destination.name}</Text>
          )}

          {/* ── 4. EMOTIONAL SUBTITLE ── */}
          {isKajol && (
            <Text style={styles.emotionalSubtitle}>
              Desconecta entre naturaleza, café{'\n'}y experiencias auténticas.
            </Text>
          )}

          {/* ── 5. BENEFITS GRID (4 columns with dividers) ── */}
          {isKajol && (
            <View style={styles.benefitsGrid}>
              {KAJOL_BENEFITS.map((benefit, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <View style={styles.benefitDivider} />}
                  <View style={styles.benefitItem}>
                    <benefit.Icon color="#C9956B" size={28} />
                    <Text style={styles.benefitTitle}>{benefit.title}</Text>
                    <Text style={styles.benefitDesc}>{benefit.desc}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          )}

          {/* ── 6. DESCRIPTION TEXT ── */}
          <Text style={styles.descText}>{destination.desc}</Text>

          {/* ── 7. EXPERIENCE CARD ── */}
          {experienceItems.length > 0 && (
            <View style={styles.experienceCard}>
              <Text style={styles.experienceTitle}>
                Disfruta de más en tu estancia
              </Text>
              <View style={styles.experienceGrid}>
                {experienceItems.map((item: string, index: number) => {
                  const IconComponent = EXPERIENCE_ICONS[item] || CoworkIcon;
                  return (
                    <React.Fragment key={index}>
                      {index > 0 && <View style={styles.experienceDivider} />}
                      <View key={index} style={styles.experienceItem}>
                        <IconComponent color="#C9956B" size={30} />
                        <Text style={styles.experienceItemText}>{item}</Text>
                      </View>
                    </React.Fragment>
                  );
                })}
              </View>
            </View>
          )}

          {/* ── 8. CTA BUTTON ── */}
          <View style={styles.ctaWrapper}>
            <GoldenButton
              label={ctaActivated ? '¡Bono Activado!' : 'Activar Bono de Ahorro'}
              variant={ctaActivated ? 'success' : 'default'}
              onPress={handleCta}
            />
          </View>

          {/* ── 9. MICROCOPY ── */}
          <View style={styles.microcopyRow}>
            <CheckIcon color="#C9956B" />
            <Text style={styles.microcopyText}>
              Sin compromiso · Descubre precios y disponibilidad
            </Text>
          </View>

          {/* ── 10. SOCIAL LINKS ── */}
          <Text style={styles.socialLabel}>CONOCE MÁS EN REDES</Text>
          <View style={styles.socialRow}>
            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: 'rgba(225, 48, 108, 0.15)' }]}>
              <InstagramIcon color="#E1306C" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: 'rgba(24, 119, 242, 0.15)' }]}>
              <FacebookIcon color="#1877F2" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: 'rgba(37, 211, 102, 0.15)' }]} onPress={handleWhatsApp}>
              <WhatsAppIcon color="#25D366" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialBtn, { backgroundColor: 'rgba(234, 67, 53, 0.15)' }]} onPress={handleGoogleMaps}>
              <MapPinIcon color="#EA4335" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Fullscreen Image Modal */}
      <Modal
        visible={isFullScreen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsFullScreen(false)}
      >
        <View style={styles.fullScreenContainer}>
          <TouchableOpacity
            style={[styles.closeBtn, { top: insets.top + 16, zIndex: 10 }]}
            onPress={() => setIsFullScreen(false)}
          >
            <CloseIcon />
          </TouchableOpacity>
          <Image
            source={
              destination.gallery && destination.gallery.length > 0
                ? destination.gallery[galleryIndex]
                : destination.img
            }
            style={styles.fullScreenImg}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
};

// ── Styles ──
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // ── Hero ──
  hero: {
    position: 'relative',
    width: '100%',
  },
  heroImg: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.38,
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

  // ── Content wrapper ──
  content: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 48,
    zIndex: 5,
  },

  // ── Category ──
  category: {
    color: '#C9956B',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2.4,
    fontSize: 11.2,
    marginBottom: 6,
  },

  // ── Title ──
  titleBlock: {
    marginBottom: 12,
  },
  titleText: {
    fontFamily: Platform.OS === 'web' ? 'Georgia, serif' : 'serif',
    fontSize: 32,
    color: colors.white,
    fontWeight: '800',
    letterSpacing: -0.3,
    lineHeight: 38,
  },

  // ── Emotional subtitle ──
  emotionalSubtitle: {
    color: '#C9956B',
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 28,
  },

  // ── Benefits grid (4 columns) ──
  benefitsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 28,
  },
  benefitDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  benefitItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  benefitTitle: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 15,
    marginTop: 4,
  },
  benefitDesc: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 14,
    fontStyle: 'italic',
  },

  // ── Description ──
  descText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 28,
  },

  // ── Experience card ──
  experienceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 28,
  },
  experienceTitle: {
    color: '#C9956B',
    fontWeight: '700',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  experienceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  experienceItem: {
    alignItems: 'center',
    flex: 1,
    gap: 8,
    paddingHorizontal: 2,
  },
  experienceItemText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
    fontWeight: '500',
  },
  experienceDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },

  // ── CTA ──
  ctaWrapper: {
    marginBottom: 16,
  },

  // ── Microcopy ──
  microcopyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 32,
  },
  microcopyText: {
    color: 'rgba(255, 255, 255, 0.45)',
    fontSize: 12,
    fontStyle: 'italic',
    letterSpacing: 0.2,
  },

  // ── Social ──
  socialLabel: {
    color: 'rgba(255, 255, 255, 0.35)',
    fontSize: 10.5,
    textAlign: 'center',
    letterSpacing: 2,
    fontWeight: '600',
    marginBottom: 14,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    marginBottom: 16,
  },
  socialBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  // ── Fullscreen modal ──
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
