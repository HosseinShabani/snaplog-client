import { Stack } from 'expo-router';

import NavBar from '@/components/navigation/NavBar';

export default function ProjectsLayout() {
  return (
    <Stack
      screenOptions={{
        header: props => <NavBar.Back {...props} />,
      }}
    >
      <Stack.Screen name="index" options={{ header: props => <NavBar.Registered {...props} /> }} />
    </Stack>
  );
}
