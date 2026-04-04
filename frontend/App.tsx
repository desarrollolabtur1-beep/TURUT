/**
 * TURUT — App Entry Point
 * Loads fonts, shows splash screen, then renders the app
 */
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { useLoadFonts } from './src/hooks/useLoadFonts';
import { colors } from './src/theme';

const App: React.FC = () => {
  const fontsLoaded = useLoadFonts();

  // Inject dark background for web
  React.useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.body.style.backgroundColor = '#0a0a0a';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.overflow = 'hidden';
      const root = document.getElementById('root');
      if (root) {
        root.style.height = '100vh';
        root.style.width = '100vw';
        root.style.backgroundColor = '#0a0a0a';
      }
    }
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={Platform.OS === 'web' ? styles.webContainer : undefined}>
        <View style={styles.loading}>
          <StatusBar barStyle="light-content" backgroundColor={colors.background} />
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando TURUT...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={Platform.OS === 'web' ? styles.webContainer : styles.flex1}>
      <GestureHandlerRootView style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} translucent />
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  webContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    alignItems: 'center',
    justifyContent: 'center',
    ...(Platform.OS === 'web' ? {
      height: '100vh' as any,
      paddingVertical: 20,
    } : {}),
  },
  root: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    ...(Platform.OS === 'web' ? {
      maxWidth: 414,
      maxHeight: 896,
      height: '100%',
      borderWidth: 8,
      borderColor: '#1a1a1a',
      borderRadius: 40,
      overflow: 'hidden',
    } : {}),
  },
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    ...(Platform.OS === 'web' ? {
      maxWidth: 414,
      maxHeight: 896,
      height: '100%',
      borderWidth: 8,
      borderColor: '#1a1a1a',
      borderRadius: 40,
      overflow: 'hidden',
    } : {}),
  },
  loadingText: {
    color: colors.primary,
    marginTop: 16,
    fontSize: 14,
  },
});

export default App;