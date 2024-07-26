import React from 'react';

import { type NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { Button } from '@/components/ui/button';
import { Text as TextButton } from '@/components/ui/text';
import { UserIcon } from 'lucide-react-native';
import { Link } from 'expo-router';

const Registered: React.FC<Partial<NativeStackHeaderProps>> = ({ options }) => {
  return (
    <View className="flex items-center flex-row py-3 justify-center border-b px-6 border-gray-20 bg-white">
      <View className="w-10 h-10 rounded-full bg-gray-20 justify-center items-center">
        <UserIcon className="text-gray-60" size={20} />
      </View>
      <Text className="typo-[16-700] text-black flex-1">{options?.title}</Text>
      <Link asChild href={'/projects/new-project/template'}>
        <Button variant={'ghost'} className="px-0">
          <TextButton className="typo-[16-500] text-secondary">New project</TextButton>
        </Button>
      </Link>
    </View>
  );
};

export { Registered };
