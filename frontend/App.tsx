/**
 * TURUT — App Entry Point
 * Loads fonts, shows splash screen, then renders the app
 */
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, StatusBar, Platform, Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { useLoadFonts } from './src/hooks/useLoadFonts';
import { AuthProvider } from './src/context/AuthContext';
import { colors } from './src/theme';
import { layout } from './src/theme/spacing';

const App: React.FC = () => {
  const fontsLoaded = useLoadFonts();
  const isWeb = Platform.OS === 'web';
  const { width: screenWidth } = Dimensions.get('window');

  React.useEffect(() => {
    if (isWeb && typeof document !== 'undefined') {
      // Base styles
      document.body.style.backgroundColor = colors.black;
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      // HYBRID FIX: Allow vertical scroll, block horizontal only
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'auto';
      // Enable smooth touch scrolling on mobile browsers
      (document.body.style as any).webkitOverflowScrolling = 'touch';
      // Prevent pull-to-refresh but allow scroll
      document.body.style.overscrollBehaviorY = 'contain';

      const root = document.getElementById('root');
      if (root) {
        // Use dvh (dynamic viewport height) with vh fallback for mobile browsers
        root.style.height = '100dvh';
        root.style.minHeight = '100vh';
        root.style.width = '100vw';
        root.style.backgroundColor = colors.black;
        root.style.overflowY = 'auto';
        root.style.overflowX = 'hidden';
      }

      // Inject global touch-action CSS for gesture coexistence
      const styleId = 'turut-scroll-fix';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          /* HYBRID STRATEGY: Allow browser scroll + gesture handler coexistence */
          html, body, #root {
            touch-action: pan-y !important;
            -webkit-overflow-scrolling: touch;
          }
          /* Ensure ScrollView containers can scroll vertically */
          [data-testid="scroll-view"], [role="scrollbar"] {
            touch-action: pan-y !important;
            overflow-y: auto !important;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, [isWeb]);

  if (!fontsLoaded) {
    return (
      <View style={isWeb ? styles.outerContainer : undefined}>
        <View style={[styles.innerContainer, isWeb && styles.innerContainerFixed]}>
          <View style={styles.loading}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Cargando TURUT...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <View style={[styles.innerContainer, isWeb && styles.innerContainerFixed]}>
        <GestureHandlerRootView style={styles.root}>
          <StatusBar barStyle="light-content" backgroundColor={colors.background} translucent />
          <AuthProvider>
            <SafeAreaProvider>
              <AppNavigator />
            </SafeAreaProvider>
          </AuthProvider>
        </GestureHandlerRootView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  innerContainerFixed: {
    maxWidth: layout.mobileMaxWidth,
    alignSelf: 'center',
    width: '100%',
  },
  root: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
  },
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  loadingText: {
    color: colors.primary,
    marginTop: 16,
    fontSize: 14,
  },
});

export default App;