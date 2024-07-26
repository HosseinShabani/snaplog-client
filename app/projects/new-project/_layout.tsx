import { Link, Stack } from 'expo-router';

import NavBar from '@/components/navigation/NavBar';
import { Button } from '@/components/ui/button';
import { Text } from 'react-native';

export default function ProjectsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen name="records" options={{ headerShown: false }} />
      <Stack.Screen
        name="template"
        options={{
          header: props => (
            <NavBar.Back
              {...props}
              renderRightContent={() => (
                <Link asChild href="/projects/new-project/records">
                  <Button variant={'ghost'} className="p-0">
                    <Text className="typo-[16-500] text-secondary">Next</Text>
                  </Button>
                </Link>
              )}
            />
          ),
          title: 'Template',
        }}
      />
    </Stack>
  );
}
