import React, { type JSX } from 'react';

import { type NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';
import { MenuIcon } from '@/lib/icons';
import { Link } from 'expo-router';

type PropsT = {
  renderRightContent: () => JSX.Element | null;
};

const Home: React.FC<Partial<NativeStackHeaderProps & PropsT>> = ({ navigation }) => {
  const handleOpenDrawer = () => {};
  return (
    <View className="flex-row justify-between h-14 px-6 border-b border-gray-200 items-center w-full bg-white">
      <Pressable className="flex" onPress={handleOpenDrawer}>
        <MenuIcon />
      </Pressable>
      <Text className="typo-[16-500] ml-4 text-black flex-1">SnapLog</Text>
      <Link className="flex" href={'/auth/login'}>
        <Text className="typo-[16-400] text-black">Login</Text>
      </Link>
    </View>
  );
};

export { Home };
