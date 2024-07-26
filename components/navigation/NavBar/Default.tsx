import React from 'react';

import { type BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Default: React.FC<Partial<BottomTabHeaderProps>> = ({ options }) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      className="flex items-center justify-center pb-5 bg-white"
      style={[{ paddingTop: insets.top + 12 }]}
    >
      <Text className="typo-[16-700] text-black">{options?.title}</Text>
    </View>
  );
};

export { Default };
