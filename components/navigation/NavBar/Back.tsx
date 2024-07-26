import React, { type JSX } from 'react';

import { type NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MenuIcon } from 'lucide-react-native';
import { isNil } from '@/lib/utils';

type PropsT = {
  renderRightContent: () => JSX.Element | null;
};

const Back: React.FC<Partial<NativeStackHeaderProps & PropsT>> = ({
  options,
  renderRightContent,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  const handlerBackButton = (): void => {
    if (navigation === undefined) {
      return;
    }
    if (!navigation?.canGoBack()) {
      return;
    }
    navigation.goBack();
  };

  return (
    <View
      className="flex-row justify-between pb-4 px-6 border-b border-gray-200 items-center w-full bg-white"
      style={[{ paddingTop: insets.top + 12 }]}
    >
      {!isNil(navigation) ? (
        <View className="flex justify-center items-start flex-1 -ml-2.5">
          <Pressable className="flex" onPress={handlerBackButton}>
            <MenuIcon />
          </Pressable>
        </View>
      ) : (
        <View className="flex flex-1 items-start -ml-2.5" />
      )}
      <Text className="typo-[20-700] text-white">{options?.title}</Text>
      <View className="flex flex-1 items-end -mr-2.5">{renderRightContent?.()}</View>
    </View>
  );
};

export { Back };
