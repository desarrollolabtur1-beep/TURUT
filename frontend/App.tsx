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
import { colors } from './src/theme';
import { layout } from './src/theme/spacing';

const App: React.FC = () => {
  const fontsLoaded = useLoadFonts();
  const isWeb = Platform.OS === 'web';
  const { width: screenWidth } = Dimensions.get('window');

  React.useEffect(() => {
    if (isWeb && typeof document !== 'undefined') {
      document.body.style.backgroundColor = colors.black;
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.overflow = 'hidden';
      const root = document.getElementById('root');
      if (root) {
        root.style.height = '100vh';
        root.style.width = '100vw';
        root.style.backgroundColor = colors.black;
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
          <SafeAreaProvider>
            <AppNavigator />
          </SafeAreaProvider>
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