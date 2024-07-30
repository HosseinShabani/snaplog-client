import React, { type JSX } from 'react';
import { type NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Image, Text, View } from 'react-native';
import { Link } from 'expo-router';

const Home: React.FC<Partial<NativeStackHeaderProps>> = () => {
  return (
    <View className="flex-row justify-between h-14 px-6 border-b border-gray-200 items-center w-full bg-white">
      <Link href="/" className="flex flex-row items-center gap-2">
        <Image className="!w-7 !h-7" source={require('../../../assets/images/icon.png')} />
        <Text className="typo-[18-500] leading-none text-black">SnapLog</Text>
      </Link>
      <Link className="flex" href={'/auth/login'}>
        <Text className="typo-[16-400] text-black">Login</Text>
      </Link>
    </View>
  );
};

export { Home };
