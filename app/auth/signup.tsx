import { View, Text } from 'react-native';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Text as TextButton } from '@/components/ui/text';
import { Link, useNavigation } from 'expo-router';

const Signup = () => {
  const [secureTextEntry, setSecureTextEntry] = useState(false);
  const { navigate } = useNavigation();
  return (
    <View className="flex flex-col bg-white px-6 py-6 flex-1">
      <View className="flex flex-1">
        <Text className="typo-[24-700] text-black">Sign up to SnapLog</Text>
        {/* Form */}
        <Text className="typo-[16-700] text-gray-80 mt-8 mb-2">Full Name</Text>
        <Input placeholder="" />
        <Text className="typo-[16-700] text-gray-80 mt-8 mb-2">Email</Text>
        <Input placeholder="yourname@gmail.com" />
        <Text className="typo-[16-700] text-gray-80 mt-8 mb-2">Password</Text>
        <Input placeholder="+8 characters" secureTextEntry={secureTextEntry} />
        <Text className="typo-[14-400] text-black text-left mt-4 mb-8">
          By creating an account you agree with our Terms and Conditions.
        </Text>
        {/* Buttons */}
        <Button className="mt-8" variant={'default'}>
          <TextButton>Create Account</TextButton>
        </Button>
      </View>
      <View className="flex flex-col justify-center items-center">
        <Text className="typo-[16-700] text-gray-80">Have an account? Login</Text>
        <Link asChild href={'/auth/login'}>
          <Button size={'sm'} variant={'ghost'}>
            <Text className="typo-[16-700] text-secondary">Login</Text>
          </Button>
        </Link>
      </View>
    </View>
  );
};

export default Signup;
