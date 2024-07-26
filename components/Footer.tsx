import { Text, View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { HomeConst } from '@/constants/HomeConst';

const Footer = () => {
  return (
    <View className="flex-row justify-center py-5 items-center w-full bg-white gap-10">
      {HomeConst.footerItems.map(i => (
        <Link key={i.href} href={i.href}>
          <Text className="typo-[14-400] text-black">{i.label}</Text>
        </Link>
      ))}
    </View>
  );
};

export default Footer;
