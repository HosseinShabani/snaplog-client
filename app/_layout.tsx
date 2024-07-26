import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import '@/lib/global.css';

import { useColorScheme } from '@/hooks/useColorScheme';
import NavBar from '@/components/navigation/NavBar';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    'Roboto-Thin': require('@/assets/fonts/Roboto-Thin.ttf'),
    'Roboto-Light': require('@/assets/fonts/Roboto-Light.ttf'),
    'Roboto-Regular': require('@/assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('@/assets/fonts/Roboto-Medium.ttf'),
    'Roboto-Bold': require('@/assets/fonts/Roboto-Bold.ttf'),
    'Roboto-Black': require('@/assets/fonts/Roboto-Black.ttf'),
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
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: true,
          header: props => <NavBar.Back {...props} />,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="terms" options={{ title: 'Terms' }} />
        <Stack.Screen name="contact-us" options={{ title: 'Contanct us' }} />
        <Stack.Screen name="privacy" options={{ title: 'Privacy' }} />
      </Stack>
    </ThemeProvider>
  );
}
