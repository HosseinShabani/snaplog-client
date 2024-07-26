import { Stack } from 'expo-router';

import NavBar from '@/components/navigation/NavBar';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        header: props => <NavBar.Back {...props} />,
      }}
      initialRouteName="login"
    >
      <Stack.Screen name="login" options={{ title: 'Login' }} />
      <Stack.Screen name="signup" options={{ title: 'Sign up' }} />
      <Stack.Screen name="forget-password" options={{ title: 'Forget Password' }} />
    </Stack>
  );
}
