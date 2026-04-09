/**
 * MainTabs — Bottom tab navigator with pill-shaped floating bar
 * 3 tabs: Imperdibles, Tu Ruta, Radar
 * - Active tab: icon glows + label appears
 * - Inactive tab: icon only, dimmed
 */
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Line, Rect, G } from 'react-native-svg';
import HomeScreen from '../screens/HomeScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import RadarScreen from '../screens/RadarScreen';
import { colors, shadows, layout } from '../theme';

const Tab = createBottomTabNavigator();

const isWeb = Platform.OS === 'web';

const CustomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <View style={isWeb ? styles.webTabBarContainer : styles.tabBarContainer}>
      <View style={[styles.tabBar, isWeb && styles.webTabBar]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel !== undefined
            ? String(options.tabBarLabel)
            : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

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
              : <RadarIcon color="rgba(255,255,255,0.35)" size={22} active={isFocused} />;

          return (
            <View key={route.key} style={styles.tabItem}>
              <View
                style={[styles.tabButton, isFocused && styles.tabButtonActive]}
                onTouchEnd={onPress}
              >
                {icon}
                {isFocused && (
                  <View style={styles.activeLabelContainer}>
                    <Text style={styles.labelActivePurple}>{String(label)}</Text>
                    <View style={styles.activeDot} />
                  </View>
                )}
              </View>
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
        {/* x = 12 - 8.5*0.707 = 5.99, y = 12 + 8.5*0.707 = 18.01 */}
        <Circle cx="6" cy="18" r="1.5" fill={radarWhite} />

        {/* Scanning wedge (approx 0 to -55 degrees) */}
        {/* radius 10 to cover the stroke width completely */}
        {/* End point at -55 deg: 12 + 10*cos(-55) = 17.7, 12 + 10*sin(-55) = 3.8 */}
        <Path d="M 12 12 L 22 12 A 10 10 0 0 0 17.7 3.8 Z" fill={radarWhite} />

        {/* Purple dot on the top edge of the wedge */}
        {/* Center roughly at r=6.5 on the -55 deg line */}
        {/* 12 + 6.5*0.57 = 15.7, 12 - 6.5*0.82 = 6.6 */}
        <Circle cx="15.7" cy="6.6" r="1.5" fill={radarPurple} />
      </Svg>
    </View>
  );
};

const MainTabs: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Tu Ruta"
      screenOptions={{
        headerShown: false,
        tabBarLabelPosition: 'below-icon',
        tabBar: (props) => <CustomTabBar {...props} />,
        tabBarStyle: {
          position: 'absolute',
          bottom: Math.max(insets.bottom, 16) + 8,
          left: '5%',
          right: '5%',
          height: 64,
          borderRadius: 9999,
          backgroundColor: 'rgba(8, 8, 12, 0.85)',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          borderColor: colors.outlineVariant,
          paddingBottom: 0,
          paddingTop: 0,
          ...shadows.nav,
          ...(isWeb
            ? ({
                backdropFilter: 'blur(30px) saturate(2)',
                WebkitBackdropFilter: 'blur(30px) saturate(2)',
                width: '90%',
                maxWidth: 360,
                alignSelf: 'center',
                marginHorizontal: 'auto',
              } as any)
            : {}),
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.35)',
        tabBarIconStyle: {
          marginBottom: 0,
        },
      }}
    >
      <Tab.Screen
        name="Imperdibles"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <StarIcon color="rgba(255,255,255,0.35)" size={22} active={focused} />
          ),
          tabBarLabel: ({ focused }) =>
            focused ? (
              <View style={styles.activeLabelContainer}>
                <Text style={styles.labelActivePurple}>Imperdibles</Text>
                <View style={styles.activeDot} />
              </View>
            ) : null,
        }}
      />
      <Tab.Screen
        name="Tu Ruta"
        component={DiscoverScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <CardsIcon color="rgba(255,255,255,0.35)" size={22} active={focused} />
          ),
          tabBarLabel: ({ focused }) =>
            focused ? (
              <View style={styles.activeLabelContainer}>
                <Text style={styles.labelActivePurple}>Tu Ruta</Text>
                <View style={styles.activeDot} />
              </View>
            ) : null,
        }}
      />
      <Tab.Screen
        name="Radar"
        component={RadarScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <RadarIcon color="rgba(255,255,255,0.35)" size={22} active={focused} />
          ),
          tabBarLabel: ({ focused }) =>
            focused ? (
              <View style={styles.activeLabelContainer}>
                <Text style={styles.labelActivePurple}>Radar</Text>
                <View style={styles.activeDot} />
              </View>
            ) : null,
        }}
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
    bottom: 0,
    left: 0,
    right: 0,
  },
  webTabBarContainer: {
    position: 'relative',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  webTabBar: {
    width: '100%',
    maxWidth: layout.mobileMaxWidth,
    alignSelf: 'center',
  },
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
});

export default MainTabs;
