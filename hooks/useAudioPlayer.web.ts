import { useState, useEffect } from 'react';
import { AVPlaybackStatusSuccess } from 'expo-av';
import { toast } from 'burnt';

import { AudioFile } from '@/lib/types';

type UseAudio = {
  source: AudioFile | null;
};

export const useAudioPlayer = ({ source }: UseAudio) => {
  const [sound, setSound] = useState<HTMLAudioElement | undefined | null>();
  const [status, setStatus] = useState<AVPlaybackStatusSuccess | undefined>();

  const defaultStatus: AVPlaybackStatusSuccess = {
    isLoaded: true,
    uri: '',
    progressUpdateIntervalMillis: 100,
    positionMillis: 0,
    durationMillis: 0,
    shouldPlay: false,
    isPlaying: false,
    isBuffering: false,
    rate: 1,
    shouldCorrectPitch: true,
    volume: 1,
    isMuted: false,
    audioPan: 1,
    isLooping: false,
    didJustFinish: false,
  };

  const playPause = () => {
    if (!status?.isLoaded) return;
    if (status?.isPlaying) {
      sound?.pause();
    } else {
      sound?.play();
    }
  };

  const pause = () => {
    if (status?.isPlaying) sound?.pause();
  };

  const play = (position?: number) => {
    if (position) {
      if (sound && status?.durationMillis) {
        sound.currentTime = position * (status.durationMillis / 1000);
        sound.play();
      }
      return;
    }
    sound?.play();
  };

  const _onError = () => {
    toast({
      title: `Encountered a fatal error during playback`,
      haptic: 'warning',
      preset: 'none',
    });
  };

  const _onLoad = () => {
    if (sound) {
      setStatus({
        ...defaultStatus,
        uri: source?.uri ?? '',
        positionMillis: (sound.currentTime ?? 0) * 1000,
        durationMillis: (sound.duration || 0) * 1000,
        volume: sound.volume ?? 1,
        isLooping: sound.loop,
      });
    }
  };

  const _onUpdateStatus = () => {
    setStatus(s => ({
      ...defaultStatus,
      ...(s || {}),
      isPlaying: true,
      durationMillis: (sound?.duration || 0) * 1000,
      positionMillis: (sound?.currentTime ?? 0) * 1000,
    }));
  };

  const _onPuase = () => {
    setStatus(s => ({
      ...defaultStatus,
      ...(s || {}),
      isPlaying: false,
    }));
  };

  useEffect(() => {
    let audioEl: HTMLAudioElement | null;
    if (source) {
      audioEl = document.createElement('audio');
      audioEl.preload = 'metadata';
      audioEl.src = source.uri;
      audioEl.setAttribute('style', 'position:absolute; opacity:0; top: -1000px');
      document.body.appendChild(audioEl);
      setSound(audioEl);
    }
    return () => {
      if (audioEl) document.body.removeChild(audioEl);
      setStatus(undefined);
    };
  }, [source]);

  useEffect(() => {
    if (sound) {
      sound.onloadeddata = _onLoad;
      sound.onloadedmetadata = _onLoad;
      sound.onerror = _onError;
      sound.ontimeupdate = _onUpdateStatus;
      sound.onplaying = _onUpdateStatus;
      sound.onpause = _onPuase;
      sound.onended = _onPuase;
    }
  }, [sound]);

  return {
    status,
    positin: status ? status.positionMillis / (status?.durationMillis ?? 0) : 0,
    playPause,
    pause,
    play,
  };
};
