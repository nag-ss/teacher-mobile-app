import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import DrawerLayout from './drawer/_layout';
import Login from './login';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Provider, useSelector } from 'react-redux';
import { store } from '@/store'
import Layout from '@/components/navigation/layout';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false)
  // const { isAuthenticated } = useSelector((state: any) => state.user)
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <Layout />

    </Provider>
  );
}
