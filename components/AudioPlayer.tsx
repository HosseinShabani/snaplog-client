import React, { FC, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import { PauseIcon, PlayIcon } from 'lucide-react-native';
import { toast } from 'burnt';
import Slider from '@react-native-community/slider';

import { cn, getMMSSFromMillis } from '@/lib/utils';

type PropsT = {
  source: Sound | null;
  className?: string;
};

const AudioPlayer: FC<PropsT> = ({ source, className }): JSX.Element => {
  const [sound, setSound] = useState<Audio.Sound | null>(source);
  const [status, setStatus] = useState<AVPlaybackStatusSuccess | undefined>();

  const onPlayPausePressed = () => {
    if (!status?.isLoaded) return;
    if (status?.isPlaying) {
      sound?.pauseAsync();
    } else {
      sound?.playAsync();
    }
  };

  const getSeekSliderPosition = () => {
    if (!!status) return status.positionMillis / (status.durationMillis ?? 0);
    return 0;
  };

  const _onPlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
    if (!playbackStatus.isLoaded) {
      toast({
        title: `Encountered a fatal error during playback: ${playbackStatus.error}`,
        haptic: 'warning',
        preset: 'none',
      }); // Send Expo team the error on Slack or the forums so we can help you debug!
      return;
    }
    setStatus(playbackStatus);
  };

  useEffect(() => {
    setSound(source);
    return () => {
      sound?.unloadAsync();
      setStatus(undefined);
    };
  }, [source]);

  useEffect(() => {
    sound?.setOnPlaybackStatusUpdate(_onPlaybackStatusUpdate);
  }, [sound]);

  return (
    <View
      className={cn(
        'flex flex-row rounded-lg gap-2 justify-center items-start border border-gray-20 px-2 py-2',
        className,
      )}
    >
      <View className="flex flex-1 gap-1">
        <Slider
          value={getSeekSliderPosition()}
          onSlidingStart={e => {
            if (status?.isPlaying) sound?.pauseAsync();
          }}
          onSlidingComplete={e => {
            if (status?.durationMillis) sound?.playFromPositionAsync(e * status.durationMillis);
          }}
          disabled={!status?.isLoaded}
          thumbTintColor="#000"
          maximumTrackTintColor="#e9e9e9"
          minimumTrackTintColor="#0096FF"
        />
        <View className="flex flex-row justify-between items-center mt-1">
          <Text className="typo-[14-400] text-black">
            {getMMSSFromMillis(status?.positionMillis ?? 0)}
          </Text>
          {Number.isFinite(status?.durationMillis) && (
            <Text className="typo-[14-400] text-black">
              {getMMSSFromMillis(status?.durationMillis ?? 0)}
            </Text>
          )}
        </View>
      </View>
      <View className="flex flow-row justify-center items-center">
        <Pressable onPress={onPlayPausePressed} disabled={!!status?.isBuffering}>
          {status?.isPlaying ? <PauseIcon /> : <PlayIcon />}
        </Pressable>
      </View>
    </View>
  );
};

export default AudioPlayer;
