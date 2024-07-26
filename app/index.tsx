import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Stack } from 'expo-router';
import NavBar from '@/components/navigation/NavBar';
import { HomeConst } from '@/constants/HomeConst';
import { useVideoPlayer, VideoView } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, PlayIcon } from 'lucide-react-native';
import { isNil } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Text as ButtonText } from '@/components/ui/text';
import Footer from '@/components/Footer';

const index = () => {
  const ref = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const player = useVideoPlayer(HomeConst.videoSource, player => {
    player.loop = false;
    player.play();
  });

  useEffect(() => {
    const subscription = player.addListener('playingChange', isPlaying => {
      setIsPlaying(isPlaying);
    });
    return () => {
      subscription.remove();
    };
  }, [player]);

  console.log(isPlaying, 'pla');

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => <NavBar.Home />,
        }}
      />
      <ScrollView className="flex flex-col bg-white">
        <LinearGradient
          colors={['#063368', '#004CA5']}
          className="p-6"
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text className="typo-[24-900] text-white">Voice Your Data, Simplify Your Research</Text>
          <Text className="typo-[16-400] text-white mt-2 mb-6">
            Voice input for easy, accurate data collection.
          </Text>
          {/* Benefits */}
          <View className="flex flex-col gap-2 pb-40">
            {HomeConst.benefitsData.map(i => (
              <View key={i} className="flex flex-row items-center justify-start gap-2">
                <View className="w-1 h-1 bg-white rounded-full" />
                <Text className="typo-[16-400] text-white">{i}</Text>
              </View>
            ))}
          </View>
          {/* Video */}
        </LinearGradient>
        <View className="bg-white relative p-6 items-center">
          <View className="rounded-2xl overflow-hidden justify-center items-center w-full -top-36">
            {!isPlaying && (
              <Pressable
                className="w-14 h-14 bg-white absolute z-20 rounded-full self-center flex justify-center items-center"
                onPress={() => player.play()}
              >
                <PlayIcon className="text-gray-60 typo-[30]" />
              </Pressable>
            )}
            <VideoView
              ref={ref}
              player={player}
              allowsFullscreen={false}
              allowsPictureInPicture={false}
              className="w-full h-64"
            />
          </View>
          <Button variant={'default'} className="flex-row gap-2 w-full -top-20">
            <ButtonText className="typo-[16-500] text-white">Get Started</ButtonText>
            <ChevronRight strokeWidth={1.5} className="text-white typo-[30]" />
          </Button>
        </View>
        <Footer />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({});

export default index;
