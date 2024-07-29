import React from 'react';

import { type NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text as TextButton } from '@/components/ui/text';
import { UserIcon } from 'lucide-react-native';
import { Link } from 'expo-router';

const Registered: React.FC<Partial<NativeStackHeaderProps>> = ({ options }) => {
  const HeaderRight = options?.headerRight ?? (() => null);
  return (
    <View className="flex items-center flex-row h-14 justify-center border-b px-6 border-gray-20 bg-white">
      <View className="flex flex-1">
        <View className="w-8 h-8 rounded-full bg-gray-20 justify-center items-center">
          <UserIcon className="text-gray-60" size={20} />
        </View>
      </View>
      <Text className="typo-[16-500] text-black flex-1 text-center">{options?.title}</Text>
      <View className="flex flex-1 flex-row justify-end">
        <Link asChild href={'/projects/new-project'}>
          <Button variant={'ghost'} className="px-0">
            <TextButton className="typo-[14-500] text-secondary">New project</TextButton>
          </Button>
        </Link>
      </View>
    </View>
  );
};

export { Registered };
