/**
 * useLoadFonts — Custom hook to load fonts
 * Uses expo-font with error handling
 */
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

export function useLoadFonts(): boolean {
  const [webReady, setWebReady] = useState(false);

  // On web, load fonts via CSS @font-face for better compatibility
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Inject Google Fonts stylesheet into head
      const link = document.createElement('link');
      link.href =
        'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@700&family=Montserrat:wght@700;800;900&family=Orbitron:wght@700;900&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
      // Give fonts a moment to load
      setTimeout(() => setWebReady(true), 300);
      return;
    }
  }, []);

  const [fontsLoaded] = useFonts(
    Platform.OS === 'web'
      ? {} // Web uses CSS, no need for expo-font
      : {
          Inter: require('../../assets/fonts/Inter-Regular.ttf'),
          'Inter-Medium': require('../../assets/fonts/Inter-Medium.ttf'),
          'Inter-SemiBold': require('../../assets/fonts/Inter-SemiBold.ttf'),
          'Inter-Bold': require('../../assets/fonts/Inter-Bold.ttf'),
          'Montserrat-Bold': require('../../assets/fonts/Montserrat-Bold.ttf'),
          'Montserrat-ExtraBold': require('../../assets/fonts/Montserrat-ExtraBold.ttf'),
          'Montserrat-Black': require('../../assets/fonts/Montserrat-Black.ttf'),
          'Orbitron-Bold': require('../../assets/fonts/Orbitron-Bold.ttf'),
          'Orbitron-Black': require('../../assets/fonts/Orbitron-Black.ttf'),
          'JetBrainsMono-Bold': require('../../assets/fonts/JetBrainsMono-Bold.ttf'),
          'GreatVibes-Regular': require('../../assets/fonts/GreatVibes-Regular.ttf'),
        }
  );

  if (Platform.OS === 'web') return webReady;
  return fontsLoaded;
}
