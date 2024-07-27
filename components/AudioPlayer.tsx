import { Pressable, Text, View } from 'react-native';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import { PauseIcon, PlayIcon, StopCircle } from 'lucide-react-native';

type PropsT = {
  source: Sound | null;
};

import Slider from '@react-native-community/slider';
import { getMMSSFromMillis, isNil } from '@/lib/utils';

const RATE_SCALE = 3.0;

const AudioPlayer: FC<PropsT> = ({ source }): JSX.Element => {
  const sound = useRef<Audio.Sound>(source);
  const isSeeking = useRef(false);
  const shouldPlayAtEndOfSeek = useRef(false);
  const [state, setState] = useState({
    haveRecordingPermissions: false,
    isLoading: false,
    soundPosition: null,
    soundDuration: null,
    recordingDuration: null,
    shouldPlay: false,
    isPlaying: false,
    isRecording: false,
    shouldCorrectPitch: true,
    rate: 1.0,
  });

  const onSeekSliderSlidingComplete = async (value: number) => {
    if (sound.current != null) {
      isSeeking.current = false;
      const seekPosition = value * (state.soundDuration || 0);
      if (shouldPlayAtEndOfSeek.current) {
        sound.current.playFromPositionAsync(seekPosition);
      } else {
        sound.current.setPositionAsync(seekPosition);
      }
    }
  };

  const getSeekSliderPosition = () => {
    if (sound.current != null && state.soundPosition != null && state.soundDuration != null) {
      return state.soundPosition / state.soundDuration;
    }
    return 0;
  };

  const trySetRate = async (rate: number, shouldCorrectPitch: boolean) => {
    if (sound.current != null) {
      try {
        await sound.current.setRateAsync(rate, shouldCorrectPitch);
      } catch (error) {}
    }
  };

  const onRateSliderSlidingComplete = async (value: number) => {
    trySetRate(value * RATE_SCALE, state.shouldCorrectPitch);
  };

  const onPitchCorrectionPressed = () => {
    trySetRate(state.rate, !state.shouldCorrectPitch);
  };

  const onSeekSliderValueChange = (value: number) => {
    if (sound.current != null && !isSeeking.current) {
      isSeeking.current = true;
      shouldPlayAtEndOfSeek.current = state.shouldPlay;
      sound.current.pauseAsync();
    }
  };

  useEffect(() => {
    return !isNil(sound.current)
      ? () => {
          sound.current?.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const getPlaybackTimestamp = () => {
    if (!isNil(sound.current) && !isNil(state.soundPosition) && !isNil(state.soundDuration)) {
      return `${getMMSSFromMillis(state.soundPosition)} / ${getMMSSFromMillis(
        state.soundDuration,
      )}`;
    }
    return '';
  };

  const onPlayPausePressed = () => {
    if (!isNil(sound.current)) {
      if (state.isPlaying) {
        sound.current.pauseAsync();
      } else {
        sound.current.playAsync();
      }
    }
  };

  const onStopPressed = () => {
    if (!isNil(sound.current)) {
      sound.current.stopAsync();
    }
  };

  return (
    <View className="flex flex-col w-full">
      <View className="flex flex-col w-full gap-1">
        <Slider
          value={getSeekSliderPosition()}
          onValueChange={onSeekSliderValueChange}
          onSlidingComplete={onSeekSliderSlidingComplete}
          disabled={state.isLoading}
          className="w-full"
        />
        <Text className="typo-[14-400] text-black">{getPlaybackTimestamp()}</Text>
      </View>
      <View className="flex flow-row justify-center items-center">
        <Pressable onPress={onPlayPausePressed} disabled={state.isLoading}>
          {!state.isPlaying ? <PlayIcon /> : <PauseIcon />}
        </Pressable>
        {state.isPlaying && (
          <Pressable onPress={onStopPressed} disabled={state.isLoading}>
            <StopCircle />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default AudioPlayer;
