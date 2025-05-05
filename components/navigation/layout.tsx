import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import DrawerLayout from '@/app/drawer/_layout';
import Login from '@/app/login';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from '@/store'
import { checkLoginStatus } from '@/store/authSlice';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false)
  const dispatch = useDispatch<any>()
  const { isAuthenticated } = useSelector((state: any) => state.user)
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('@/assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    dispatch(checkLoginStatus())
  }, [])

  if (!loaded) {
    return null;
  }

  return (
        isAuthenticated ? <DrawerLayout /> : <Login />
  );
}
