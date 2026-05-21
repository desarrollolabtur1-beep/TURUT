/**
 * LandingOverlay — Full-screen destination detail modal
 * Shows image hero, benefits grid, info card, social links, and CTA
 *
 * Enhanced:
 * - Gallery with dots indicator
 * - Crossfade transition between images
 * - Horizontal swipe via FlatList
 * - Review count display
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  FadeInDown,
  FadeInUp,
  ZoomIn,
  SlideInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Svg, { Path, Rect, Line, Circle, Polyline, Polygon } from 'react-native-svg';
import { GoldenButton } from '../components/ui/GoldenButton';
import { destinations } from '../data/destinations';
import { colors, radii, layout, textStyles } from '../theme';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const CONTAINER_WIDTH = Platform.OS === 'web' ? Math.min(SCREEN_WIDTH, layout.mobileMaxWidth) : SCREEN_WIDTH;

// ── SVG Icon Components ──

const ChevronLeftIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="m15 18-6-6 6-6" />
  </Svg>
);

const ChevronRightIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="m9 18 6-6-6-6" />
  </Svg>
);

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

const FlowerIcon = ({ color = '#C9956B', size = 28 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="3" />
    <Path d="M12 5a3 3 0 1 0 0 6 3 3 0 1 0 0-6z" />
    <Path d="M12 13a3 3 0 1 0 0 6 3 3 0 1 0 0-6z" />
    <Path d="M5 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0z" />
    <Path d="M13 12a3 3 0 1 0 6 0 3 3 0 1 0-6 0z" />
  </Svg>
);

const RiverIcon = ({ color = '#C9956B', size = 28 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 14l4-5 4 4 6-7 4 5" />
    <Path d="M2 17c3-1.5 6 .5 9-1s6 2.5 9 1" />
    <Path d="M2 20c3-1.5 6 .5 9-1s6 2.5 9 1" />
  </Svg>
);

const GroupsIcon = ({ color = '#C9956B', size = 28 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <Circle cx="9" cy="7" r="4" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

const HotTubIcon = ({ color = '#C9956B', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
    <Path d="M2 12h20" />
    <Path d="M6 8a2 2 0 0 1 2-2M10 8a2 2 0 0 1 2-2M14 8a2 2 0 0 1 2-2" />
    <Path d="M4 16c2-1 4-1 6 0s4 1 6 0 4-1 6 0" />
  </Svg>
);

const UtensilsIcon = ({ color = '#C9956B', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v4M18 20V2M14 2v4c0 2 2 4 4 4" />
  </Svg>
);

const PawIcon = ({ color = '#C9956B', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="14" r="4" />
    <Circle cx="6.5" cy="8.5" r="2" />
    <Circle cx="10" cy="5.5" r="2" />
    <Circle cx="14" cy="5.5" r="2" />
    <Circle cx="17.5" cy="8.5" r="2" />
  </Svg>
);

const HomeIcon = ({ color = '#C9956B', size = 28 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <Polyline points="9 22 9 12 15 12 15 22" />
  </Svg>
);

const AccessibilityIcon = ({ color = '#C9956B', size = 28 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="4" r="1" fill={color} />
    <Path d="M9 9h3.5L14 14l-2.5 4" />
    <Path d="M10 18.5a3 3 0 1 1-3-3" />
    <Path d="m19 12-3-.5M19 18v-6" />
  </Svg>
);

const HikingIcon = ({ color = '#C9956B', size = 28 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="m3 14 4-5 4 4 6-7 4 5" />
    <Path d="M12 13v8M10 15v5M14 16v4" />
  </Svg>
);

const BirdIcon = ({ color = '#C9956B', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M16 3H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5z" />
    <Circle cx="8.5" cy="8.5" r="1.5" fill={color} />
    <Path d="m17 7-3 4h6z" />
  </Svg>
);

const SproutIcon = ({ color = '#C9956B', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M2 22 Q 12 12 12 2" />
    <Path d="M12 12 Q 17 7 22 7" />
    <Path d="M12 12 Q 7 7 2 7" />
    <Path d="M12 6 Q 16 2 20 2" />
  </Svg>
);

const SaunaIcon = ({ color = '#C9956B', size = 28 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 14v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
    <Path d="M2 14h20" />
    <Path d="M6 4c.5 1.5-1 2.5-.5 4M12 3c.5 2-1 3-.5 5M18 4c.5 1.5-1 2.5-.5 4" />
  </Svg>
);

const TeaIcon = ({ color = '#C9956B', size = 28 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <Path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <Path d="M6 2c.3 1-.7 1.5-.3 2.5M10 2c.3 1-.7 1.5-.3 2.5M14 2c.3 1-.7 1.5-.3 2.5" />
  </Svg>
);

const FaceMaskIcon = ({ color = '#C9956B', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="M8 14s1.5 2 4 2 4-2 4-2" />
    <Line x1="9" y1="9" x2="9.01" y2="9" strokeWidth={2} />
    <Line x1="15" y1="9" x2="15.01" y2="9" strokeWidth={2} />
  </Svg>
);

const DrinkIcon = ({ color = '#C9956B', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2v6" />
    <Path d="M5 8h14l-1.5 11a2 2 0 0 1-2 1h-7a2 2 0 0 1-2-1L5 8z" />
    <Path d="M18 8a3 3 0 0 1 0 6h-1" />
  </Svg>
);

const TargetIcon = ({ color = '#C9956B', size = 28 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Circle cx="12" cy="12" r="6" />
    <Circle cx="12" cy="12" r="2" />
  </Svg>
);

const SoccerIcon = ({ color = '#C9956B', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="10" />
    <Path d="m12 2 2 3.5h-4zM12 22l-2-3.5h4zM2 12l3.5-2v4zM22 12l-3.5 2v-4zM12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0" />
    <Path d="m14 5.5 3 2.5M10 5.5 7 8M14 18.5 17 16M10 18.5 7 16M5.5 10l1.5-2M5.5 14l1.5 2M18.5 10l-1.5-2M18.5 14l-1.5 2" />
  </Svg>
);

const TentIcon = ({ color = '#C9956B', size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 22 12 5 5 22z" />
    <Path d="M12 5v17" />
    <Path d="m12 14 4 8H8z" />
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

// ── Benefit data for Casa Flores ──
const CASA_FLORES_BENEFITS = [
  {
    Icon: LeafIcon,
    title: 'Hospedaje\ncampestre',
    desc: 'Espacios rodeados\nde naturaleza\ny tranquilidad.',
  },
  {
    Icon: FlowerIcon,
    title: 'Spa &\nrelajación',
    desc: 'Masajes, exfoliación\nvolcánica y\nbienestar total.',
  },
  {
    Icon: RiverIcon,
    title: 'Naturaleza\n+ río',
    desc: 'Acceso directo\nal río y senderos\nnaturales.',
  },
  {
    Icon: GroupsIcon,
    title: 'Eventos &\ngrupos',
    desc: 'Capacidad amplia\npara reuniones y\ncelebraciones.',
  },
];

// ── Benefit data for La Florida ──
const FLORIDA_BENEFITS = [
  {
    Icon: HomeIcon,
    title: 'Hospedaje\nexclusivo',
    desc: 'Ambiente privado\nrodeado de aire puro\ny naturaleza.',
  },
  {
    Icon: FlowerIcon,
    title: 'Spa &\nbienestar',
    desc: 'Sauna, turco, jacuzzi\ny masajes relajantes.',
  },
  {
    Icon: HikingIcon,
    title: 'Senderismo\n& cascada',
    desc: 'Recorridos naturales\ny avistamiento de aves.',
  },
  {
    Icon: AccessibilityIcon,
    title: 'Accesibilidad\ninclusiva',
    desc: 'Espacios adaptados\npara personas con\ndiscapacidad.',
  },
];

// ── Benefit data for Los Pinos ──
const LOS_PINOS_BENEFITS = [
  {
    Icon: FlowerIcon,
    title: 'Spa &\nrelajación',
    desc: 'Masajes terapéuticos\ny bienestar integral.',
  },
  {
    Icon: SaunaIcon,
    title: 'Sauna &\nturco',
    desc: 'Espacios para liberar\nestrés y renovar energía.',
  },
  {
    Icon: RiverIcon,
    title: 'Naturaleza\n& río',
    desc: 'Montañas, aire puro\ny acceso al río.',
  },
  {
    Icon: TeaIcon,
    title: 'Experiencia\nwellness',
    desc: 'Bebidas calientes,\nmascarillas y rituales.',
  },
];

// ── Benefit data for Villa Leones ──
const VILLA_LEONES_BENEFITS = [
  {
    Icon: HomeIcon,
    title: 'Alojamiento\nrural',
    desc: 'Espacios cómodos para\ngrupos, familias y escapadas.',
  },
  {
    Icon: PoolIcon,
    title: 'Piscinas\nnaturales',
    desc: 'Disfruta piscina natural\ny piscina de agua tratada.',
  },
  {
    Icon: TargetIcon,
    title: 'Zona de\njuegos',
    desc: 'Billar, ping pong,\nminitejo y actividades.',
  },
  {
    Icon: GroupsIcon,
    title: 'Eventos &\nreuniones',
    desc: 'Salones amplios ideales\npara celebraciones.',
  },
];

// ── Experience card icons mapping ──
const EXPERIENCE_ICONS: Record<string, React.FC<{ color?: string; size?: number }>> = {
  'Piscina y jacuzzi': PoolIcon,
  'Juegos tradicionales': DiceIcon,
  'Mini cancha funcional': BallIcon,
  'Cowork, café y bienestar': CoworkIcon,
  // Casa Flores items
  'Jacuzzis privados': HotTubIcon,
  'Sala de juegos': DiceIcon,
  'Restaurante & eventos': UtensilsIcon,
  'Pet Friendly': PawIcon,
  // La Florida items
  'Jacuzzi & turco': HotTubIcon,
  'Avistamiento de aves': BirdIcon,
  'Productos orgánicos': SproutIcon,
  // Los Pinos items
  'Exfoliación volcánica': SproutIcon,
  'Mascarilla facial': FaceMaskIcon,
  'Cóctel & bebida caliente': DrinkIcon,
  // Villa Leones items
  'Cancha de voleyplaya': BallIcon,
  'Cancha de microfútbol': SoccerIcon,
  'Zona de camping': TentIcon,
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
  const galleryFlatListRef = useRef<FlatList>(null);

  const isKajol = destination.name.includes('KAJOL');
  const isCasaFlores = destination.name.includes('CASA FLORES') || destination.name.includes('Casa Flores');
  const isLaFlorida = destination.name.includes('LA FLORIDA') || destination.name.includes('La Florida');
  const isLosPinos = destination.name.includes('LOS PINOS') || destination.name.includes('Los Pinos');
  const isVillaLeones = destination.name.includes('VILLA LEONES') || destination.name.includes('Villa Leones');
  const galleryImages = destination.gallery && destination.gallery.length > 0
    ? destination.gallery
    : [destination.img];
  const hasMultipleImages = galleryImages.length > 1;

  const handleGalleryScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / CONTAINER_WIDTH);
    if (idx >= 0 && idx < galleryImages.length && idx !== galleryIndex) {
      setGalleryIndex(idx);
    }
  }, [galleryIndex, galleryImages.length]);

  const handlePrevImage = useCallback(() => {
    const next = (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
    setGalleryIndex(next);
    galleryFlatListRef.current?.scrollToIndex({ index: next, animated: true });
  }, [galleryIndex, galleryImages.length]);

  const handleNextImage = useCallback(() => {
    const next = (galleryIndex + 1) % galleryImages.length;
    setGalleryIndex(next);
    galleryFlatListRef.current?.scrollToIndex({ index: next, animated: true });
  }, [galleryIndex, galleryImages.length]);

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
        {/* ── 1. HERO IMAGE WITH SWIPEABLE GALLERY ── */}
        <Animated.View
          entering={ZoomIn.duration(500).springify().damping(18).stiffness(90)}
          style={[styles.hero, { backgroundColor: '#000' }]}
        >
          <FlatList
            ref={galleryFlatListRef}
            data={galleryImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => `gallery-${i}`}
            onScroll={handleGalleryScroll}
            scrollEventThrottle={16}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setIsFullScreen(true)}
                style={{ width: CONTAINER_WIDTH }}
              >
                <Image
                  source={item}
                  style={styles.heroImg}
                  resizeMode="cover"
                  resizeMethod="resize"
                />
              </TouchableOpacity>
            )}
            getItemLayout={(_, index) => ({
              length: CONTAINER_WIDTH,
              offset: CONTAINER_WIDTH * index,
              index,
            })}
          />
          {/* Manual navigation arrows */}
          {hasMultipleImages && (
            <>
              <TouchableOpacity
                style={[styles.navArrow, styles.navArrowLeft]}
                onPress={handlePrevImage}
                activeOpacity={0.8}
              >
                <ChevronLeftIcon />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navArrow, styles.navArrowRight]}
                onPress={handleNextImage}
                activeOpacity={0.8}
              >
                <ChevronRightIcon />
              </TouchableOpacity>
            </>
          )}
          {/* Close button */}
          <Animated.View 
            entering={FadeIn.delay(400).duration(300)}
            style={{ position: 'absolute', top: Math.max(insets.top, 16) + 16, left: 16, zIndex: 20 }}
          >
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={handleClose}
              activeOpacity={0.8}
            >
              <CloseIcon />
            </TouchableOpacity>
          </Animated.View>

          {/* Gallery dots indicator */}
          {hasMultipleImages && (
            <View style={styles.galleryDotsContainer}>
              {galleryImages.map((_, idx) => (
                <Animated.View
                  key={idx}
                  entering={FadeIn.duration(300)}
                  style={[
                    styles.galleryDot,
                    idx === galleryIndex && styles.galleryDotActive,
                  ]}
                />
              ))}
            </View>
          )}

          {/* Image counter badge */}
          {hasMultipleImages && (
            <View style={styles.imageCountBadge}>
              <Text style={styles.imageCountText}>
                {galleryIndex + 1}/{galleryImages.length}
              </Text>
            </View>
          )}
        </Animated.View>

        {/* ── Content ── */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(500).springify().damping(20)}
          style={styles.content}
        >

          {/* ── 2. CATEGORY LABEL ── */}
          <Text style={styles.category}>
            {isLosPinos
              ? 'WELLNESS • SPA • NATURALEZA'
              : isCasaFlores
              ? 'ESCAPADA CAMPESTRE & SPA'
              : isLaFlorida
              ? 'NATURALEZA • SPA • DESCANSO'
              : isVillaLeones
              ? 'NATURALEZA • EVENTOS • DESCANSO'
              : `${destination.category.toUpperCase()} Y PAISAJE`}
          </Text>

          {/* ── 3. TITLE ── */}
          {isLosPinos ? (
            <View style={styles.titleBlock}>
              <Text style={styles.titleText}>LOS PINOS</Text>
              <Text style={styles.titleText}>ECOHOTEL</Text>
            </View>
          ) : isKajol ? (
            <View style={styles.titleBlock}>
              <Text style={styles.titleText}>JARDINES DE BERLÍN</Text>
              <Text style={styles.titleText}>KAJOL</Text>
            </View>
          ) : isCasaFlores ? (
            <View style={styles.titleBlock}>
              <Text style={styles.titleText}>HOSPEDAJE</Text>
              <Text style={styles.titleText}>CAMPESTRE</Text>
              <Text style={styles.titleText}>CASA FLORES</Text>
            </View>
          ) : isLaFlorida ? (
            <View style={styles.titleBlock}>
              <Text style={styles.titleText}>FINCA HOSTAL</Text>
              <Text style={styles.titleText}>LA FLORIDA</Text>
            </View>
          ) : isVillaLeones ? (
            <View style={styles.titleBlock}>
              <Text style={styles.titleText}>FINCA ECOTURÍSTICA</Text>
              <Text style={styles.titleText}>VILLA LEONES</Text>
            </View>
          ) : (
            <Text style={styles.titleText}>{destination.name}</Text>
          )}

          {/* ── 4. EMOTIONAL SUBTITLE ── */}
          {isLosPinos && (
            <Text style={styles.emotionalSubtitle}>
              Relájate junto al río con experiencias de bienestar,{'\n'}montaña y desconexión total.
            </Text>
          )}
          {isKajol && (
            <Text style={styles.emotionalSubtitle}>
              Desconecta entre naturaleza, café{'\n'}y experiencias auténticas.
            </Text>
          )}
          {isCasaFlores && (
            <Text style={styles.emotionalSubtitle}>
              Desconecta junto al río, naturaleza, spa{'\n'}y descanso campestre auténtico.
            </Text>
          )}
          {isLaFlorida && (
            <Text style={styles.emotionalSubtitle}>
              Conecta con la naturaleza, la tranquilidad{'\n'}y experiencias auténticas junto al río.
            </Text>
          )}
          {isVillaLeones && (
            <Text style={styles.emotionalSubtitle}>
              Vive una experiencia rodeada de naturaleza, diversión y descanso en un espacio exclusivo para compartir.
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
          {isCasaFlores && (
            <View style={styles.benefitsGrid}>
              {CASA_FLORES_BENEFITS.map((benefit, index) => (
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
          {isLaFlorida && (
            <View style={styles.benefitsGrid}>
              {FLORIDA_BENEFITS.map((benefit, index) => (
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
          {isLosPinos && (
            <View style={styles.benefitsGrid}>
              {LOS_PINOS_BENEFITS.map((benefit, index) => (
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
          {isVillaLeones && (
            <View style={styles.benefitsGrid}>
              {VILLA_LEONES_BENEFITS.map((benefit, index) => (
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
                {isLosPinos
                  ? 'DISFRUTA MÁS EN TU EXPERIENCIA'
                  : isCasaFlores || isLaFlorida || isVillaLeones ? 'DISFRUTA MÁS EN TU ESTANCIA' : 'Disfruta de más en tu estancia'}
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
        </Animated.View>
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
    width: CONTAINER_WIDTH,
    height: SCREEN_HEIGHT * 0.38,
  },
  closeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  navArrow: {
    position: 'absolute',
    top: '50%',
    marginTop: -22,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    zIndex: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  navArrowLeft: {
    left: 16,
  },
  navArrowRight: {
    right: 16,
  },
  // ── Gallery dots ──
  galleryDotsContainer: {
    position: 'absolute',
    bottom: 44,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    zIndex: 10,
  },
  galleryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  galleryDotActive: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  imageCountBadge: {
    position: 'absolute',
    bottom: 44,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    zIndex: 10,
  },
  imageCountText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
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
