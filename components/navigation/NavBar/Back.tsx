import React, { type JSX } from 'react';

import { type NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';
import { ChevronLeft } from '@/lib/icons';
import { useRouter } from 'expo-router';

type PropsT = {
  renderRightContent: () => JSX.Element | null;
};

const Back: React.FC<Partial<NativeStackHeaderProps & PropsT>> = ({
  options,
  renderRightContent = () => null,
}) => {
  const router = useRouter();
  const HeaderRight = options?.headerRight ?? (() => null);

  return (
    <View className="flex-row justify-between items-center h-14 px-6 border-b border-gray-20 w-full bg-white">
      <View className="flex justify-center items-start flex-1 -ml-2.5">
        <Pressable onPress={() => (router.canGoBack() ? router.back() : router.navigate('/'))}>
          <ChevronLeft className="typo-[24] text-black" />
        </Pressable>
      </View>
      <Text className="typo-[16-400] text-black">{options?.title ?? ''}</Text>
      <View className="flex flex-1 items-end">
        <HeaderRight canGoBack />
      </View>
    </View>
  );
};

export { Back };
