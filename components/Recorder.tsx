import React from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import {
  AndroidAudioEncoder,
  AndroidOutputFormat,
  IOSAudioQuality,
  IOSOutputFormat,
} from 'expo-av/build/Audio';
import { Audio } from 'expo-av';

import { cn, getMMSSFromMillis } from '@/lib/utils';
import { PauseIcon, PlayIcon } from '@/lib/icons';
import { Button } from '@/components/ui/button';

type RecorderProps = {
  onRecordFinish: (name: string, uri: string) => void;
};

const RECORDING_PRESET = {
  isMeteringEnabled: true,
  android: {
    extension: '.m4a',
    outputFormat: AndroidOutputFormat.MPEG_4,
    audioEncoder: AndroidAudioEncoder.AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: IOSOutputFormat.MPEG4AAC,
    audioQuality: IOSAudioQuality.MEDIUM,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: {
    mimeType: 'audio/webm',
    bitsPerSecond: 128000,
  },
};

const Recorder: React.FC<RecorderProps> = ({ onRecordFinish }) => {
  const [recording, setRecording] = React.useState<Audio.Recording | undefined>();
  const [status, setStatus] = React.useState<Audio.RecordingStatus | undefined>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();

  async function startRecording() {
    try {
      if (permissionResponse?.status !== 'granted') {
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(RECORDING_PRESET, setStatus);
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    await recording?.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording?.getURI();
    if (!uri) {
      Alert.alert('Error on creating audio');
      return;
    }
    onRecordFinish(`recording-${Date.now()}`, uri);
    setRecording(undefined);
    setStatus(undefined);
  }

  async function pauseRecording() {
    if (status?.isRecording) await recording?.pauseAsync();
    else await recording?.startAsync();
  }

  return (
    <View className="flex flex-row justify-between items-center p-2 border border-gray-200 rounded-lg shadow-lg shadow-gray-300/30 bg-white">
      <View className="flex flex-row items-center gap-2.5">
        <Pressable
          onPress={recording ? stopRecording : startRecording}
          className={cn(
            'bg-black border-2 border-black px-3 py-2 rounded-md gap-2.5 flex flex-row items-center',
            {
              'bg-white': !!recording,
            },
          )}
        >
          <View
            className={cn('w-3.5 h-3.5 bg-red rounded-full', {
              'rounded-sm': !!recording,
            })}
          />
          <Text
            className={cn('typo-[16-400] text-white', {
              'text-black': !!recording,
            })}
          >
            {recording ? 'Stop' : 'Start'}
          </Text>
        </Pressable>
        {!!recording && (
          <Button variant="ghost" className="p-1 h-auto flex-row" onPress={pauseRecording}>
            {status?.isRecording ? (
              <PauseIcon size={16} className="text-black " />
            ) : (
              <PlayIcon size={16} className="text-black mr-0.5" />
            )}
            <Text className="typo-[14-500]">{status?.isRecording ? 'Pause' : 'Resume'}</Text>
          </Button>
        )}
      </View>
      <Text className="typo-[16-400] text-black/50">
        {getMMSSFromMillis(status?.durationMillis ?? 0)}
      </Text>
    </View>
  );
};

export default Recorder;
