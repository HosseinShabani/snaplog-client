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
    >
      <Stack.Screen
        name="reocrds"
        options={{
          header: props => <NavBar.Back {...props} />,
          title: 'Records',
        }}
      />
      <Stack.Screen
        name="recording"
        options={{
          header: props => <NavBar.Back {...props} />,
          title: 'Recording',
        }}
      />
      <Stack.Screen
        name="template"
        options={{
          header: props => <NavBar.Back {...props} />,
          title: 'Template',
        }}
      />
    </Stack>
  );
}
