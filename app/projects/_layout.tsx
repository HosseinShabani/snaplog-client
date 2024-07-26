import { Stack } from 'expo-router';

import NavBar from '@/components/navigation/NavBar';

export default function ProjectsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        header: props => <NavBar.Registered {...props} />,
      }}
      initialRouteName="projects"
    ></Stack>
  );
}
