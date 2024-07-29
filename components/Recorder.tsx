import { Pressable, Text, View } from 'react-native';
import React, { FC, useRef, useState } from 'react';
import { Sound } from 'expo-av/build/Audio';
import { Audio, AVPlaybackStatus, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { getMMSSFromMillis, isNil } from '@/lib/utils';
import Animated from 'react-native-reanimated';

type PropsT = {
  onRecordFinish: (value: Sound) => void;
};
const Recorder: FC<PropsT> = ({ onRecordFinish }) => {
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

  const startRecording = async () => {
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

  const stopRecording = async () => {
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
    console.log(onRecordFinish, '2222');
    onRecordFinish(newSound);
    setState(prevState => ({ ...prevState, isLoading: false }));
  };

  const onRecordPressed = () => {
    if (state.isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };
  return (
    <View className="flex flex-col flex-1 justify-end bg-emerald-500 items-center">
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
  );
};

export default Recorder;
