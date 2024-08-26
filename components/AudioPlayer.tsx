import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { PauseIcon, PlayIcon } from 'lucide-react-native';
import Slider from '@react-native-community/slider';

import { cn, getMMSSFromMillis } from '@/lib/utils';
import { AudioFile } from '@/lib/types';
import { useAudioPlayer } from '@/hooks';

type PropsT = {
  source: AudioFile | null;
  className?: string;
};

const AudioPlayer: React.FC<PropsT> = ({ source, className }): JSX.Element => {
  const player = useAudioPlayer({ source });

  return (
    <View
      className={cn(
        'flex flex-row rounded-lg gap-2 justify-center items-start border border-gray-20 px-2 py-2',
        className,
      )}
    >
      <View className="flex flex-1 gap-1">
        <Slider
          value={player.positin}
          onSlidingStart={e => player.pause()}
          onSlidingComplete={e => {
            player.play(e);
          }}
          disabled={!player.status?.isLoaded}
          thumbTintColor="#000"
          maximumTrackTintColor="#e9e9e9"
          minimumTrackTintColor="#0096FF"
        />
        <View className="flex flex-row justify-between items-center mt-1">
          <Text className="typo-[14-400] text-black">
            {getMMSSFromMillis(player.status?.positionMillis ?? 0)}
          </Text>
          {Number.isFinite(player.status?.durationMillis) && (
            <Text className="typo-[14-400] text-black">
              {getMMSSFromMillis(player.status?.durationMillis ?? 0)}
            </Text>
          )}
        </View>
      </View>
      <View className="flex flow-row justify-center items-center">
        <Pressable onPress={player.playPause} disabled={!!player.status?.isBuffering}>
          {player.status?.isPlaying ? <PauseIcon /> : <PlayIcon />}
        </Pressable>
      </View>
    </View>
  );
};

export default AudioPlayer;
