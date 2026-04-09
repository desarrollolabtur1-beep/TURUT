/**
 * MainLayout — Responsive container for TURUT app
 * - Mobile: 100% width, dark background
 * - Web: Fixed 480px centered container with black outer background
 */
import React from 'react';
import { View, StyleSheet, Platform, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, layout } from '../theme';

const { height: screenHeight } = Dimensions.get('window');

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';

  const containerStyle = [
    styles.container,
    isWeb ? styles.webContainer : styles.mobileContainer,
  ];

  const innerStyle = [
    styles.inner,
    {
      paddingTop: insets.top,
      paddingBottom: insets.bottom || 16,
      minHeight: screenHeight,
    },
  ];

  return (
    <View style={containerStyle}>
      <View style={innerStyle}>
        <View style={styles.contentWrapper}>
          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
            bounces={!isWeb}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mobileContainer: {
    backgroundColor: colors.surface,
  },
  webContainer: {
    backgroundColor: colors.black,
  },
  inner: {
    flex: 1,
    backgroundColor: colors.surface,
    maxWidth: layout.mobileMaxWidth,
    alignSelf: 'center',
    width: '100%',
  },
  contentWrapper: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
});

export default MainLayout;
