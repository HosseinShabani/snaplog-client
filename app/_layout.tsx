import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { AppState } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { PortalHost } from '@rn-primitives/portal';
import 'react-native-reanimated';

import '@/lib/global.css';
import { supabase } from '@/lib/supabase';
import { useAuth, useSettings } from '@/hooks';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Tells Supabase Auth to continuously refresh the session automatically
AppState.addEventListener('change', state => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export default function RootLayout() {
  const [loaded] = useFonts({
    'Roboto-Light': require('@/assets/fonts/Roboto-Light.ttf'),
    'Roboto-Regular': require('@/assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('@/assets/fonts/Roboto-Medium.ttf'),
    'Roboto-Bold': require('@/assets/fonts/Roboto-Bold.ttf'),
  });
  const setSession = useAuth(state => state.setSession);
  const session = useAuth(state => state.session);
  const updateSettings = useSettings(state => state.updateSettings);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session?.user.id) {
      supabase
        .from('settings')
        .select('*')
        .single()
        .then(res => {
          const { default_template, default_template_desc, system_prompt } = res?.data ?? {};
          updateSettings({ default_template, default_template_desc, system_prompt });
        });
    }
  }, [session?.user.id]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <Slot />
      <PortalHost />
    </>
  );
}
