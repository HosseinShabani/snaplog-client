import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import NavBar from '@/components/navigation/NavBar';

const Terms = () => {
  return (
    <View className="bg-white flex px-6 py-8 h-screen">
      <Text className="typo-[16-400] text-black leading-6">
        Here is the instruction text Saeid will write for the customers to help them record their
        voices. It is a template for the recording.Saeid should name this template in the admin
        panel, and it will appear in the users’ template list. Later, users can select the template
        they need, see the instructions and sample audio, and upload their voice based on the sample
        file.Here is the instruction text Saeid will write for the customers to help them record
        their voices. It is a template for the recording.Saeid should name this template in the
        admin panel, and it will appear in the users’ template list. Later, users can select the
        template they need, see the instructions and sample audio, and upload their voice based on
        the sample file.Here is the instruction text Saeid will write for the customers to help them
        record their voices. It is a template for the recording.Saeid should name this template in
        the admin panel, and it will appear in the users’ template list. Later, users can select the
        template they need, see the instructions and sample audio, and upload their voice based on
        the sample file.
      </Text>
    </View>
  );
};

export default Terms;
