import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, { FC } from 'react';
import { cn } from '@/lib/utils';
import { cssInterop } from 'nativewind';

const StyledSpinner = cssInterop(ActivityIndicator, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      color: true,
    },
  },
});

type PropsT = {
  size?: 'small' | 'large';
  className?: string;
  isPrimaryColor?: boolean;
};
const Spinner: FC<PropsT> = ({ size = 'small', className, isPrimaryColor = false }) => {
  return (
    <View className={cn('flex justify-center items-center', className)}>
      <StyledSpinner
        size={size}
        className="text-red"
        color={isPrimaryColor ? '#0061D3' : '#ffffff'}
      />
    </View>
  );
};

export default Spinner;
