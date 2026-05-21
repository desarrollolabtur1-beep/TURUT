/**
 * MainTabs — Bottom tab navigator with pill-shaped floating bar
 * 4 tabs: Imperdibles, Tu Ruta, Radar, Perfil
 * - Active tab: icon glows + label appears
 * - Inactive tab: icon only, dimmed
 * - Badge support for Radar (live events) and Tu Ruta (matches count)
 */
import React from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Line, Rect, G } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import HomeScreen from '../screens/HomeScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import RadarScreen from '../screens/RadarScreen';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { useFavorites } from '../store/useFavorites';
import { events, getEventStatus } from '../data/events';
import { colors, shadows, layout } from '../theme';

const Tab = createBottomTabNavigator();

const isWeb = Platform.OS === 'web';

// ── Badge Component ──
const TabBadge: React.FC<{ count: number; isLive?: boolean }> = ({ count, isLive }) => {
  if (count <= 0) return null;
  return (
    <View style={[styles.badge, isLive && styles.badgeLive]}>
      <Text style={styles.badgeText}>
        {count > 9 ? '9+' : count}
      </Text>
    </View>
  );
};

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const { getCombinedIds, loaded } = useFavorites();

  // Calculate badge counts
  const matchesCount = loaded ? getCombinedIds().length : 0;
  const liveEventsCount = events.filter(e => {
    const status = getEventStatus(e.time);
    return status === 'now' || status === 'soon';
  }).length;

  const getBadgeForRoute = (routeName: string): { count: number; isLive: boolean } => {
    switch (routeName) {
      case 'Tu Ruta':
        return { count: matchesCount, isLive: false };
      case 'Radar':
        return { count: liveEventsCount, isLive: true };
      default:
        return { count: 0, isLive: false };
    }
  };

  return (
    <View
      style={[
        isWeb ? styles.webTabBarContainer : styles.tabBarContainer,
        { bottom: Math.max(insets.bottom, 16) + 8 }
      ]}
    >
      <View style={[styles.tabBar, isWeb && styles.webTabBar, isWeb && styles.webTabBarBlur]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined
            ? String(options.tabBarLabel)
            : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;
          const badge = getBadgeForRoute(route.name);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const icon = route.name === 'Imperdibles'
            ? <StarIcon color="rgba(255,255,255,0.35)" size={22} active={isFocused} />
            : route.name === 'Tu Ruta'
              ? <CardsIcon color="rgba(255,255,255,0.35)" size={22} active={isFocused} />
              : route.name === 'Mapa'
                ? <MapPinIcon color="rgba(255,255,255,0.35)" size={22} active={isFocused} />
                : route.name === 'Radar'
                  ? <RadarIcon color="rgba(255,255,255,0.35)" size={22} active={isFocused} />
                  : <ProfileIcon color="rgba(255,255,255,0.35)" size={22} active={isFocused} />;

          return (
            <View key={route.key} style={styles.tabItem}>
              <Pressable
                style={[styles.tabButton, isFocused && styles.tabButtonActive]}
                onPress={onPress}
                android_ripple={{ color: 'rgba(255,255,255,0.1)', borderless: true, radius: 24 }}
              >
                <View style={styles.iconContainer}>
                  {icon}
                  {/* Badge */}
                  {!isFocused && badge.count > 0 && (
                    <TabBadge count={badge.count} isLive={badge.isLive} />
                  )}
                </View>
                {isFocused && (
                  <View style={styles.activeLabelContainer}>
                    <Text style={styles.labelActivePurple} numberOfLines={1}>{String(label)}</Text>
                    <View style={styles.activeDot} />
                  </View>
                )}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};

/* ── SVG Icons matching the PWA ── */

const getWebGlow = (color: string) => Platform.OS === 'web' ? ({ filter: `drop-shadow(0px 0px 6px ${color})` } as any) : {};
const getNativeGlow = (color: string) => Platform.OS !== 'web' ? {
  shadowColor: color,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.6,
  shadowRadius: 8,
  elevation: 4,
} : undefined;

const StarIcon = ({ color, size, active }: { color: string; size: number; active: boolean }) => (
  <View style={active ? getNativeGlow('rgba(255, 215, 0, 0.6)') : undefined}>
    <Svg style={active ? getWebGlow('rgba(255, 215, 0, 0.6)') : undefined} width={size} height={size} viewBox="0 0 24 24" fill={active ? '#FFD700' : 'none'} stroke={active ? '#FFD700' : color} strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </Svg>
  </View>
);

const CardsIcon = ({ color, size, active }: { color: string; size: number; active: boolean }) => (
  <View style={active ? getNativeGlow(colors.primary) : undefined}>
    <Svg style={active ? getWebGlow(colors.primary) : undefined} width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Back card (Tilted Right) */}
      <G rotation={10} origin="12, 12" x={3} y={0}>
        <Rect x="5" y="2" width="10" height="15" rx="2" stroke={active ? colors.primary : color} strokeWidth={active ? 2.5 : 1.5} />
      </G>

      {/* Front card (Tilted Left) */}
      <G rotation={-5} origin="12, 12" x={-1} y={1}>
        <Rect x="5" y="4" width="12" height="16" rx="2" fill="rgba(8,8,12,1)" stroke={active ? colors.primary : color} strokeWidth={active ? 2.5 : 1.5} />
        {/* Inner border */}
        <Rect x="7" y="6" width="8" height="12" rx="1" stroke={active ? colors.primary : color} strokeWidth={active ? 1 : 0.5} opacity={0.6} />
        {/* Sparkle perfectly centered at 11, 12 */}
        <Path d="M11 9.5 C11 11 12 12 13.5 12 C12 12 11 13 11 14.5 C11 13 10 12 8.5 12 C10 12 11 11 11 9.5 Z" fill={active ? colors.primary : color} />
      </G>
    </Svg>
  </View>
);

const RadarIcon = ({ color, size, active }: { color: string; size: number; active: boolean }) => {
  const radarPurple = active ? colors.primary : color;
  const radarWhite = active ? '#ffffff' : 'rgba(255,255,255,0.35)';

  return (
    <View style={active ? getNativeGlow(colors.primary) : undefined}>
      <Svg style={active ? getWebGlow(colors.primary) : undefined} width={size} height={size} viewBox="0 0 24 24" fill="none">
        {/* Outer ring */}
        <Circle cx="12" cy="12" r="8.5" stroke={radarPurple} strokeWidth="3" />
        {/* Inner ring */}
        <Circle cx="12" cy="12" r="4" stroke={radarPurple} strokeWidth="1.5" />
        {/* Center dot */}
        <Circle cx="12" cy="12" r="1.5" fill={radarPurple} />

        {/* Small dot on the outer ring (bottom left ~135 degrees) */}
        <Circle cx="6" cy="18" r="1.5" fill={radarWhite} />

        {/* Scanning wedge */}
        <Path d="M 12 12 L 22 12 A 10 10 0 0 0 17.7 3.8 Z" fill={radarWhite} />

        {/* Purple dot on the top edge of the wedge */}
        <Circle cx="15.7" cy="6.6" r="1.5" fill={radarPurple} />
      </Svg>
    </View>
  );
};

const MapPinIcon = ({ color, size, active }: { color: string; size: number; active: boolean }) => {
  const strokeColor = active ? colors.primary : color;
  return (
    <View style={active ? getNativeGlow(colors.primary) : undefined}>
      <Svg style={active ? getWebGlow(colors.primary) : undefined} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <Circle cx={12} cy={10} r={3} />
      </Svg>
    </View>
  );
};

const ProfileIcon = ({ color, size, active }: { color: string; size: number; active: boolean }) => {
  const strokeColor = active ? colors.primary : color;
  return (
    <View style={active ? getNativeGlow(colors.primary) : undefined}>
      <Svg style={active ? getWebGlow(colors.primary) : undefined} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={strokeColor} strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        {/* Head */}
        <Circle cx="12" cy="8" r="4" />
        {/* Body/Shoulders */}
        <Path d="M20 21a8 8 0 10-16 0" />
      </Svg>
    </View>
  );
};

const MainTabs: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Tu Ruta"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
      }}
    >
      <Tab.Screen
        name="Imperdibles"
        component={HomeScreen}
      />
      <Tab.Screen
        name="Tu Ruta"
        component={DiscoverScreen}
      />
      <Tab.Screen
        name="Mapa"
        component={MapScreen}
      />
      <Tab.Screen
        name="Radar"
        component={RadarScreen}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  activeLabelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  labelActivePurple: {
    color: colors.primary,
    fontSize: 9.6,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 2,
  },
  tabBarContainer: {
    position: 'absolute',
    left: '5%',
    right: '5%',
    ...shadows.nav,
  },
  webTabBarContainer: {
    position: 'fixed' as any,
    left: '5%',
    right: '5%',
    alignItems: 'center',
    zIndex: 9999,
    ...shadows.nav,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 9999,
    backgroundColor: 'rgba(8, 8, 12, 0.90)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    minHeight: 64,
    paddingVertical: 6,
  },
  webTabBar: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  webTabBarBlur: {
    backdropFilter: 'blur(30px) saturate(2)',
    WebkitBackdropFilter: 'blur(30px) saturate(2)',
  } as any,
  tabItem: {
    flex: 1,
    alignItems: 'center',
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tabButtonActive: {
    transform: [{ scale: 1.05 }],
  },
  // ── Icon container for badge positioning ──
  iconContainer: {
    position: 'relative',
  },
  // ── Badge ──
  badge: {
    position: 'absolute',
    top: -6,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: 'rgba(8, 8, 12, 0.90)',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeLive: {
    backgroundColor: '#FF3B30',
    shadowColor: '#FF3B30',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
});

export default MainTabs;
