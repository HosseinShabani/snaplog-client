import { useState, useEffect } from 'react';
import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess } from 'expo-av';
import { toast } from 'burnt';

import { AudioFile } from '@/lib/types';

type UseAudio = {
  source: AudioFile | null;
};

export const useAudioPlayer = ({ source }: UseAudio) => {
  const [sound, setSound] = useState<Audio.Sound | undefined | null>(source?.sound);
  const [status, setStatus] = useState<AVPlaybackStatusSuccess | undefined>();

  const playPause = () => {
    if (!status?.isLoaded) return;
    if (status?.isPlaying) {
      sound?.pauseAsync();
    } else {
      sound?.playAsync();
    }
  };

  const pause = () => {
    if (status?.isPlaying) sound?.pauseAsync();
  };

  const play = (position?: number) => {
    if (position) {
      if (status?.durationMillis) sound?.playFromPositionAsync(position * status.durationMillis);
      return;
    }
    sound?.playAsync();
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
    setSound(source?.sound);
    return () => {
      sound?.unloadAsync();
      setStatus(undefined);
    };
  }, [source]);

  useEffect(() => {
    sound?.setOnPlaybackStatusUpdate(_onPlaybackStatusUpdate);
  }, [sound]);

  return {
    status,
    positin: status ? status.positionMillis / (status?.durationMillis ?? 0) : 0,
    playPause,
    pause,
    play,
  };
};
