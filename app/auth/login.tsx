import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import NavBar from '@/components/navigation/NavBar';

const Login = () => {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: props => <NavBar.Back {...props} options={{ title: 'Login' }} />,
        }}
      />
      <Text>login</Text>
    </>
  );
};

export default Login;
