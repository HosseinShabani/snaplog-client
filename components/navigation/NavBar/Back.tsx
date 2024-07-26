import React, { type JSX } from 'react';

import { type NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';

type PropsT = {
  renderRightContent: () => JSX.Element | null;
};

const Back: React.FC<Partial<NativeStackHeaderProps & PropsT>> = ({
  options,
  renderRightContent,
  navigation,
}) => {
  return (
    <View className="flex-row justify-between items-center py-4 px-6 border-b border-gray-20 w-full bg-white">
      {navigation?.canGoBack() ? (
        <View className="flex justify-center items-start flex-1 -ml-2.5">
          <Pressable onPress={navigation.goBack}>
            <ChevronLeft className="typo-[24] text-black" />
          </Pressable>
        </View>
      ) : (
        <View className="flex flex-1 items-start -ml-2.5" />
      )}
      <Text className="typo-[16-400] text-black">{options?.title}</Text>
      <View className="flex flex-1 items-end -mr-2.5">{renderRightContent?.()}</View>
    </View>
  );
};

export { Back };
