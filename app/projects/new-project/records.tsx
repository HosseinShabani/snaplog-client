import { Text, View } from 'react-native';
import React from 'react';

import NavBar from '@/components/navigation/NavBar';
import { Link, useNavigation } from 'expo-router';
import { Button } from '@/components/ui/button';

const Records = () => {
  const navigation = useNavigation();
  return (
    <>
      <NavBar.Back
        options={{ title: 'Voice' }}
        renderRightContent={() => (
          <Button variant={'ghost'} className="p-0">
            <Text className="typo-[16-500] text-secondary">Submit</Text>
          </Button>
        )}
        navigation={navigation}
      />
      <View className="flex flex-1 bg-white p-6">
        <Text className="typo-[20-700] mb-2">Record or upload your file</Text>
      </View>
    </>
  );
};

export default Records;
