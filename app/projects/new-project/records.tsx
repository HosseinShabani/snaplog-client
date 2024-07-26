import { Pressable, ScrollView, Text, View } from 'react-native';
import React, { FC, useEffect, useState } from 'react';

import NavBar from '@/components/navigation/NavBar';
import { useNavigation } from 'expo-router';
import { Button } from '@/components/ui/button';
import { ProjectConst } from '@/constants/ProjectConst';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Audio, AVPlaybackSource } from 'expo-av';

import { FileUp, PlayIcon, TrashIcon } from 'lucide-react-native';
import { Sound } from 'expo-av/build/Audio';
import { isNil } from '@/lib/utils';

const RecordCard = ({
  onDeletePress,
  source,
}: {
  onDeletePress: () => void;
  source: AVPlaybackSource;
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [sound, setSound] = useState<Sound>();

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(source);
    setSound(sound);
    console.log('Playing Sound');
    await sound.playAsync();
    setIsPlaying(true);
  }

  async function stopSound() {
    await sound?.stopAsync();
    setIsPlaying(false);
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  return (
    <View className="flex items-center justify-center flex-row gap-2">
      <Pressable onPress={isPlaying ? stopSound : playSound}>
        <PlayIcon />
      </Pressable>
      <View className="flex-1 h-1 bg-gray-20 rounded-sm" />
      <Pressable onPress={onDeletePress}>
        <TrashIcon className="text-red" />
      </Pressable>
    </View>
  );
};

const Records = () => {
  const navigation = useNavigation();
  const radius = useSharedValue(56);
  const [recording, setRecording] = useState();
  const [recordFile, setRecordFile] = useState<AVPlaybackSource | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: radius.value === 56 ? 56 : 30,
      height: radius.value === 56 ? 56 : 30,
      borderRadius: radius.value === 56 ? 56 : 10,
    };
  });

  const animateShape = () => {
    radius.value = withTiming(radius.value === 56 ? 30 : 56, {
      duration: 200,
      easing: Easing.inOut(Easing.ease),
    });
  };

  async function startRecording() {
    try {
      if (permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      animateShape();
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      setRecordFile(null);
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    animateShape();
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    setRecordFile(uri);
  }

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
        {!isNil(recordFile) && (
          <RecordCard source={recordFile} onDeletePress={() => setRecordFile(null)} />
        )}
      </View>
      <View className="flex flex-row bg-gray-20 py-4 px-6 justify-center items-center">
        <View className="flex flex-col flex-1 justify-center items-center">
          <Pressable onPress={recording ? stopRecording : startRecording}>
            <View className="w-16 h-16 justify-center items-center rounded-full bg-white border-2 border-gray-30 p-2">
              <Animated.View className="rounded-full bg-red" style={animatedStyle} />
            </View>
          </Pressable>
          <Text className="typo-[16-400] text-black mt-2">
            {recording ? 'Tap to stop' : 'Tap to start'}
          </Text>
        </View>
        <FileUp className="absolute left-10" />
      </View>
    </>
  );
};

export default Records;
