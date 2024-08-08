import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { toast } from 'burnt';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Text as TextButton } from '@/components/ui/text';
import { supabase } from '@/lib/supabase';

const Login = ({}) => {
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setLoading(false);
    if (error) toast({ title: error.message, haptic: 'error', preset: 'error' });
    else if (!session)
      toast({
        title: 'Please check your inbox for email verification!',
        haptic: 'warning',
        preset: 'none',
      });
    else navigate('/');
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="flex-col min-h-full bg-white px-6 pt-6 pb-4"
    >
      <View className="flex flex-1">
        <Text className="typo-[24-500] text-black">Log in to SnapLog</Text>
        {/* Form */}
        <Text className="typo-[16-500] text-gray-80 mt-8 mb-2">Email</Text>
        <Input placeholder="johndoe@mail.com" onChangeText={setEmail} />
        <Text className="typo-[16-500] text-gray-80 mt-8 mb-2">Password</Text>
        <Input placeholder="+8 characters" secureTextEntry onChangeText={setPassword} />
        {/* End Form */}
        {/* <Button
          className="mt-4 self-center"
          variant={'ghost'}
          onPress={() => navigate('/auth/forget-password')}
        >
          <Text className="typo-[16-500] text-secondary">Forget password?</Text>
        </Button> */}
        <Button
          isLoading={loading}
          className="mt-8"
          variant={'default'}
          onPress={handleLogin}
          disabled={loading}
        >
          <TextButton>Login</TextButton>
        </Button>
      </View>
      {/* <View className="flex flex-col mt-6 justify-center items-center">
        <Text className="typo-[16-500] text-gray-80">Don't have an account?</Text>
        <Button size={'sm'} variant={'ghost'} onPress={() => navigate('/auth/signup')}>
          <Text className="typo-[16-500] text-secondary">Signup</Text>
        </Button>
      </View> */}
    </ScrollView>
  );
};

export default Login;
