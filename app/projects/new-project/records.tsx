import { Pressable, Text, View } from 'react-native';
import React, { useRef, useState } from 'react';

import NavBar from '@/components/navigation/NavBar';
import { useNavigation } from 'expo-router';
import { Button } from '@/components/ui/button';
import Animated from 'react-native-reanimated';
import { Audio, AVPlaybackStatus, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';

import { FileUp, TrashIcon } from 'lucide-react-native';
import { getMMSSFromMillis, isNil } from '@/lib/utils';
import AudioPlayer from '@/components/AudioPlayer';
import { Sound } from 'expo-av/build/Audio';

const Records = () => {
  const navigation = useNavigation();
  const [recordFile, setRecordFile] = useState<Sound | null>(null);
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const recording = useRef<Audio.Recording | null>(null);
  const sound = useRef(null);
  // const recordingSettings = Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY;

  const [state, setState] = useState({
    haveRecordingPermissions: false,
    isLoading: false,
    isPlaybackAllowed: false,
    muted: false,
    soundPosition: null,
    soundDuration: null,
    recordingDuration: null,
    shouldPlay: false,
    isPlaying: false,
    isRecording: false,
    fontLoaded: false,
    shouldCorrectPitch: true,
    volume: 1.0,
    rate: 1.0,
  });

  // async function startRecording() {
  //   try {
  //     if (permissionResponse.status !== 'granted') {
  //       console.log('Requesting permission..');
  //       await requestPermission();
  //     }
  //     await Audio.setAudioModeAsync({
  //       allowsRecordingIOS: true,
  //       playsInSilentModeIOS: true,
  //     });

  //     console.log('Starting recording..');
  //     animateShape();
  //     const { recording } = await Audio.Recording.createAsync(
  //       Audio.RecordingOptionsPresets.HIGH_QUALITY,
  //     );
  //     setRecordFile(null);
  //     setRecording(recording);
  //     console.log('Recording started');
  //   } catch (err) {
  //     console.error('Failed to start recording', err);
  //   }
  // }

  // async function stopRecording() {
  //   console.log('Stopping recording..');
  //   animateShape();
  //   setRecording(undefined);
  //   await recording.stopAndUnloadAsync();
  //   await Audio.setAudioModeAsync({
  //     allowsRecordingIOS: false,
  //   });
  //   const uri = recording.getURI();
  //   console.log('Recording stopped and stored at', uri);
  //   setRecordFile(uri);
  // }

  const updateScreenForRecordingStatus = (status: Audio.RecordingStatus) => {
    if (status.canRecord) {
      setState(prevState => ({
        ...prevState,
        isRecording: status.isRecording,
        recordingDuration: status.durationMillis,
      }));
    } else if (status.isDoneRecording) {
      setState(prevState => ({
        ...prevState,
        isRecording: false,
        recordingDuration: status.durationMillis,
      }));
      if (!state.isLoading) {
        stopRecordingAndEnablePlayback();
      }
    }
  };

  const stopPlaybackAndBeginRecording = async () => {
    setState(prevState => ({ ...prevState, isLoading: true }));
    setRecordFile(null);
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    if (!isNil(recording.current)) {
      recording.current.setOnRecordingStatusUpdate(null);
      recording.current = null;
    }
    const newRecording = new Audio.Recording();
    // await newRecording.prepareToRecordAsync(recordingSettings);
    await newRecording.prepareToRecordAsync();
    newRecording.setOnRecordingStatusUpdate(updateScreenForRecordingStatus);
    recording.current = newRecording;
    await recording.current.startAsync();
    setState(prevState => ({ ...prevState, isLoading: false }));
  };

  const updateScreenForSoundStatus = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setState(prevState => ({
        ...prevState,
        soundDuration: status.durationMillis ?? null,
        soundPosition: status.positionMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        rate: status.rate,
        muted: status.isMuted,
        volume: status.volume,
        shouldCorrectPitch: status.shouldCorrectPitch,
        isPlaybackAllowed: true,
      }));
    } else {
      setState(prevState => ({
        ...prevState,
        soundDuration: null,
        soundPosition: null,
        isPlaybackAllowed: false,
      }));
    }
  };

  const stopRecordingAndEnablePlayback = async () => {
    setState(prevState => ({ ...prevState, isLoading: true }));
    if (!recording.current) {
      return;
    }
    try {
      await recording.current.stopAndUnloadAsync();
    } catch (error) {
      setState(prevState => ({ ...prevState, isLoading: false }));
      return;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    const { sound: newSound } = await recording.current.createNewLoadedSoundAsync(
      {
        isLooping: true,
        isMuted: state.muted,
        volume: state.volume,
        rate: state.rate,
        shouldCorrectPitch: state.shouldCorrectPitch,
      },
      updateScreenForSoundStatus,
    );
    setRecordFile(newSound);
    setState(prevState => ({ ...prevState, isLoading: false }));
  };

  const onRecordPressed = () => {
    if (state.isRecording) {
      stopRecordingAndEnablePlayback();
    } else {
      stopPlaybackAndBeginRecording();
    }
  };

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
          <View className="flex items-center justify-center flex-row gap-2">
            <AudioPlayer source={recordFile} />
            <Pressable onPress={() => setRecordFile(null)}>
              <TrashIcon className="text-red" />
            </Pressable>
          </View>
        )}
      </View>
      <View className="flex flex-row bg-gray-20 py-4 px-6 justify-center items-center">
        <View className="flex flex-col flex-1 justify-center items-center">
          {!isNil(state.recordingDuration) && (
            <Text className="typo-[14-400] text-black mb-2">
              {getMMSSFromMillis(state.recordingDuration)}
            </Text>
          )}
          <Pressable onPress={onRecordPressed}>
            <View className="w-16 h-16 justify-center items-center rounded-full bg-white border-2 border-gray-30 p-2">
              <Animated.View className="rounded-full bg-red" />
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
