import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Text as TextButton } from '@/components/ui/text';
import { Link, useNavigation } from 'expo-router';

const Login = ({}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(false);
  const { navigate } = useNavigation();
  return (
    <View className="flex flex-col bg-white px-6 py-6 flex-1">
      <View className="flex flex-1">
        <Text className="typo-[24-700] text-black">Log in to SnapLog</Text>
        {/* Form */}
        <Text className="typo-[16-700] text-gray-80 mt-8 mb-2">Email</Text>
        <Input placeholder="yourname@gmail.com" />
        <Text className="typo-[16-700] text-gray-80 mt-8 mb-2">Password</Text>
        <Input placeholder="+8 characters" secureTextEntry={secureTextEntry} />
        {/* Buttons */}
        <Link asChild href={'/auth/forget-password'}>
          <Button className="mt-4 self-center" variant={'ghost'}>
            <Text className="typo-[16-700] text-secondary">Forget password?</Text>
          </Button>
        </Link>
        <Button className="mt-8" variant={'default'}>
          <TextButton>Login</TextButton>
        </Button>
      </View>
      <View className="flex flex-col justify-center items-center">
        <Text className="typo-[16-700] text-gray-80">Don't have an account? Sign up</Text>
        <Link asChild href={'/auth/signup'}>
          <Button size={'sm'} variant={'ghost'}>
            <Text className="typo-[16-700] text-secondary">Signup</Text>
          </Button>
        </Link>
      </View>
    </View>
  );
};

export default Login;
