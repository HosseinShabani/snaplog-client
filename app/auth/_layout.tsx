import { Stack } from 'expo-router';

import NavBar from '@/components/navigation/NavBar';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        header: props => <NavBar.Back {...props} />,
      }}
      initialRouteName="/auth/login"
    >
      <Stack.Screen name="/auth/login" options={{ title: 'Login' }} />
      <Stack.Screen name="/auth/signup" options={{ title: 'Sign up' }} />
      <Stack.Screen name="/auth/forger" options={{ title: 'Forget Password' }} />
    </Stack>
  );
}
