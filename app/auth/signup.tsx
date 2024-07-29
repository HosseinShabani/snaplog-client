import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Text as TextButton } from '@/components/ui/text';
import { supabase } from '@/lib/supabase';

const Signup = () => {
  const { navigate } = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: { data: { full_name: name } },
    });

    setLoading(false);
    if (error) Alert.alert(error.message);
    else if (!session) Alert.alert('Please check your inbox for email verification!');
    else navigate('/');
  };

  return (
    <View className="flex flex-col bg-white px-6 py-6 flex-1">
      <View className="flex flex-1">
        <Text className="typo-[24-500] text-black">Sign up to SnapLog</Text>
        {/* Form */}
        <Text className="typo-[16-500] text-gray-80 mt-8 mb-2">Full Name</Text>
        <Input placeholder="John Doe" onChangeText={setName} />
        <Text className="typo-[16-500] text-gray-80 mt-8 mb-2">Email</Text>
        <Input placeholder="johndoe@mail.com" onChangeText={setEmail} />
        <Text className="typo-[16-500] text-gray-80 mt-8 mb-2">Password</Text>
        <Input placeholder="+8 characters" secureTextEntry onChangeText={setPassword} />
        <Text className="typo-[14-400] leading-normal text-zinc-500 text-left mt-4">
          By creating an account you agree with our Terms and Conditions.
        </Text>
        {/* End Form */}
        <Button className="mt-8" variant={'default'} onPress={handleSignup} disabled={loading}>
          <TextButton>Create Account</TextButton>
        </Button>
      </View>
      <View className="flex flex-col justify-center items-center">
        <Text className="typo-[16-500] text-gray-80">Have an account?</Text>
        <Button size={'sm'} variant={'ghost'} onPress={() => navigate('/auth/login')}>
          <Text className="typo-[16-500] text-secondary">Login</Text>
        </Button>
      </View>
    </View>
  );
};

export default Signup;
