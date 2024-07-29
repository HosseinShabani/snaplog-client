import { Stack } from 'expo-router';

import NavBar from '@/components/navigation/NavBar';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: true, header: props => <NavBar.Home {...props} /> }}
      />
      <Stack.Screen name="+not-found" />
      <Stack.Screen
        name="terms"
        options={{
          title: 'Terms',
          header: props => <NavBar.Back {...props} />,
        }}
      />
      <Stack.Screen
        name="contact-us"
        options={{
          title: 'Contanct us',
          header: props => <NavBar.Back {...props} />,
        }}
      />
      <Stack.Screen
        name="privacy"
        options={{
          title: 'Privacy',
          header: props => <NavBar.Back {...props} />,
        }}
      />
    </Stack>
  );
}
