import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme, Platform } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { initDatabase } from '@/lib/database';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const content = (
    <>
      <AnimatedSplashOverlay />
      <AppTabs />
    </>
  );

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {Platform.OS === 'web' ? (
        content
      ) : (
        <SQLiteProvider databaseName="shopping_list.db" onInit={initDatabase}>
          {content}
        </SQLiteProvider>
      )}
    </ThemeProvider>
  );
}

