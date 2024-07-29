import { Pressable, Text, View } from 'react-native';
import React, { FC, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import { PauseIcon, PlayIcon } from 'lucide-react-native';

type PropsT = {
  source: Sound | null;
  className?: string;
};

import Slider from '@react-native-community/slider';
import { cn, getMMSSFromMillis, isNil } from '@/lib/utils';

const AudioPlayer: FC<PropsT> = ({ source, className }): JSX.Element => {
  const sound = useRef<Audio.Sound>(source);
  const isSeeking = useRef(false);
  const shouldPlayAtEndOfSeek = useRef(false);
  const [state, setState] = useState({
    isLoading: false,
    soundPosition: null,
    soundDuration: null,
    shouldPlay: false,
    isPlaying: false,
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

  const onSeekSliderValueChange = (value: number) => {
    if (sound.current != null && !isSeeking.current) {
      isSeeking.current = true;
      shouldPlayAtEndOfSeek.current = state.shouldPlay;
      sound.current.pauseAsync();
      setState(s => ({ ...s, isPlaying: false }));
    }
  };

  useEffect(() => {
    return !isNil(sound.current)
      ? () => {
          sound.current?.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    let audiointerval = null;
    if (state.isPlaying) {
      // audiointerval = setInterval(() => {
      //   // console.log(sound.current)
      // }, 1000);
    }
  }, [state]);

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
        setState(s => ({ ...s, isPlaying: false }));
      } else {
        sound.current.playAsync();
        setState(s => ({ ...s, isPlaying: true }));
      }
    }
  };

  return (
    <View
      className={cn(
        'flex flex-row rounded-lg gap-2 justify-center items-center border border-gray-20 px-2 py-2',
        className,
      )}
    >
      <View className="flex flex-1 gap-1">
        <Slider
          value={getSeekSliderPosition()}
          onValueChange={onSeekSliderValueChange}
          onSlidingComplete={onSeekSliderSlidingComplete}
          disabled={state.isLoading}
          className="w-full"
          thumbTintColor="#0061D3"
          maximumTrackTintColor="#e9e9e9"
          minimumTrackTintColor="#0096FF"
        />
        <Text className="typo-[14-400] text-black">{getPlaybackTimestamp()}</Text>
      </View>
      <View className="flex flow-row justify-center items-center">
        <Pressable onPress={onPlayPausePressed} disabled={state.isLoading}>
          {!state.isPlaying ? <PlayIcon /> : <PauseIcon />}
        </Pressable>
      </View>
    </View>
  );
};

export default AudioPlayer;
