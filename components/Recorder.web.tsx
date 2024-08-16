import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { toast } from 'burnt';

import { cn, getMMSSFromMillis } from '@/lib/utils';
import { PauseIcon, PlayIcon } from '@/lib/icons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type RecorderProps = {
  onRecordFinish: (name: string, blob: Blob) => void;
};

const Recorder: React.FC<RecorderProps> = ({ onRecordFinish }) => {
  const [isRecording, setIsRecording] = React.useState<boolean>(false);
  const [paused, setPaused] = React.useState<boolean>(false);
  const [askStop, setAskStop] = React.useState<boolean>(false);
  const [time, setTime] = React.useState<number>(0);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const currentTimestamp = React.useRef<number>(0);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent.toLowerCase());

  async function startRecording() {
    try {
      if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
        throw new Error(`Recording is not supported in this browser`);
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: isSafari ? 'audio/mp4' : 'audio/webm',
        audioBitsPerSecond: 128000,
      });
      mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
        if (currentTimestamp.current > 0) {
          const diffTime = Date.now() - currentTimestamp.current;
          setTime(t => t + diffTime);
        }
        currentTimestamp.current = Date.now();
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorderRef.current.onstart = () => {
        currentTimestamp.current = Date.now();
      };
      mediaRecorderRef.current.onresume = () => {
        currentTimestamp.current = Date.now();
      };
      mediaRecorderRef.current.onpause = () => {
        currentTimestamp.current = 0;
      };
      mediaRecorderRef.current.onstop = () => {
        currentTimestamp.current = 0;
        setTime(0);
        const audioBlob = new Blob(audioChunksRef.current, {
          type: isSafari ? 'audio/mp4' : 'audio/webm',
        });
        onRecordFinish(`recording-${Date.now()}`, audioBlob);
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start(isSafari ? 1000 : 0);
      setIsRecording(true);
      setPaused(false);
    } catch (err) {
      toast({
        title: `Failed to start recording: ${String(err)}`,
        haptic: 'error',
        preset: 'error',
      });
    }
  }

  async function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setPaused(false);
    } else {
      toast({ title: 'Error on creating audio', haptic: 'error', preset: 'error' });
    }
  }

  async function pauseRecording() {
    if (!paused) {
      mediaRecorderRef.current?.pause();
      setPaused(true);
    } else {
      mediaRecorderRef.current?.resume();
      setPaused(false);
    }
  }

  return (
    <Dialog open={askStop}>
      <View className="flex flex-row justify-between items-center p-2 border border-dashed border-zinc-400 rounded-lg shadow-lg shadow-gray-300/50 bg-white">
        <View className="flex flex-row items-center gap-2.5">
          <Pressable
            onPress={() => {
              isRecording ? setAskStop(true) : startRecording();
            }}
            className={cn(
              'bg-black border-2 border-black px-3 py-2 rounded-md gap-2.5 flex flex-row items-center',
              {
                'bg-white': isRecording,
              },
            )}
          >
            <View
              className={cn('w-3.5 h-3.5 bg-red rounded-full', {
                'rounded-sm': isRecording,
              })}
            />
            <Text
              className={cn('typo-[16-400] text-white', {
                'text-black': isRecording,
              })}
            >
              {isRecording ? 'Stop' : 'Start'}
            </Text>
          </Pressable>
          <DialogContent className="bg-white sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="typo-[18-500] leading-snug">
                Are you sure you want to stop the recording?
              </DialogTitle>
            </DialogHeader>
            <DialogFooter className="flex flex-row">
              <Button variant="destructive" size="sm" onPress={() => setAskStop(false)}>
                <Text className="typo-[14-400] text-gray-80">No</Text>
              </Button>
              <Button
                variant="default"
                size="sm"
                onPress={() => {
                  setAskStop(false);
                  stopRecording();
                }}
              >
                <Text className="typo-[14-400] text-white">Yes</Text>
              </Button>
            </DialogFooter>
          </DialogContent>
          {isRecording && (
            <Button variant="ghost" className="p-1 h-auto flex-row" onPress={pauseRecording}>
              {!paused ? (
                <PauseIcon size={16} className="text-black " />
              ) : (
                <PlayIcon size={16} className="text-black mr-0.5" />
              )}
              <Text className="typo-[14-500]">{!paused ? 'Pause' : 'Resume'}</Text>
            </Button>
          )}
        </View>
        <Text className="typo-[16-400] text-black/50">{getMMSSFromMillis(time ?? 0)}</Text>
      </View>
    </Dialog>
  );
};

export default Recorder;
