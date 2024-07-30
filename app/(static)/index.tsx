import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Video, ResizeMode } from 'expo-av';
// import { useVideoPlayer, VideoView } from 'expo-video';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { HomeConst } from '@/constants/HomeConst';
import { ChevronRight, PlayIcon } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import { Text as ButtonText } from '@/components/ui/text';
import Footer from '@/components/Footer';
import { useAuth } from '@/hooks';

const index = () => {
  const video = useRef<Video | null>(null);
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoIsLoaded, setVideoIsLoaded] = useState(false);
  const session = useAuth(state => state.session);

  const handlePlayPause = () => {
    if (!videoIsLoaded) return;
    if (isPlaying) {
      video.current?.pauseAsync();
      setIsPlaying(false);
    } else {
      video.current?.playAsync();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (session) {
      router.replace('/projects');
    }
  }, [session]);

  return (
    <ScrollView className="bg-white" contentContainerClassName="flex-col min-h-full">
      <LinearGradient
        colors={['#063368', '#004CA5']}
        className="p-6"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text className="typo-[24-700] text-white">Voice Your Data, Simplify Your Research</Text>
        <Text className="typo-[16-400] text-white mt-2 mb-6">
          Voice input for easy, accurate data collection.
        </Text>
        {/* Benefits */}
        <View className="flex flex-col gap-2 pb-32">
          {HomeConst.benefitsData.map(i => (
            <View key={i} className="flex flex-row items-center justify-start gap-2">
              <View className="w-1 h-1 bg-white rounded-full" />
              <Text className="typo-[16-400] text-white">{i}</Text>
            </View>
          ))}
        </View>
        {/* Video */}
      </LinearGradient>
      <View className="bg-white relative p-6 items-center ">
        <Pressable
          onPress={handlePlayPause}
          className="rounded-2xl overflow-hidden justify-center items-center bg-white shadow-md shadow-black/10 w-full aspect-[16/9] -mt-32"
        >
          {!isPlaying && (
            <View className="w-14 h-14 bg-white absolute z-20 rounded-full self-center flex justify-center items-center">
              <PlayIcon className="text-gray-60 typo-[30]" />
            </View>
          )}
          <Video
            ref={video}
            style={{ width: '100%', height: '100%' }}
            videoStyle={{
              width: '100%',
              height: '100%',
            }}
            source={{
              uri: HomeConst.videoSource,
            }}
            useNativeControls
            resizeMode={ResizeMode.COVER}
            onLoad={() => {
              setVideoIsLoaded(true);
            }}
          />
        </Pressable>
        <Button
          onPress={() => router.replace('/auth/login')}
          variant={'default'}
          className="flex-row gap-2 w-full mt-6"
        >
          <ButtonText className="typo-[16-500] text-white">Get Started</ButtonText>
          <ChevronRight strokeWidth={1.5} className="text-white typo-[30]" />
        </Button>
      </View>
      <Footer />
    </ScrollView>
  );
};

const styles = StyleSheet.create({});

export default index;
