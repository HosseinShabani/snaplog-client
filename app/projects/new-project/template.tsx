import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { AudioLinesIcon, PauseIcon, PlayIcon } from 'lucide-react-native';
import { Audio } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import { Link, useNavigation } from 'expo-router';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProjectConst } from '@/constants/ProjectConst';
import { Button } from '@/components/ui/button';

const Template = () => {
  const navigation = useNavigation();
  const [template, setTemplate] = useState<string | undefined>();
  const [sound, setSound] = useState<Sound>();
  const [isPlaying, setIsPlaying] = useState(false);

  const source =
    'https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Comfort_Fit_-_03_-_Sorry.mp3';

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(source);
    setSound(sound);
    console.log('Playing Sound');
    await sound.playAsync();
    setIsPlaying(true);
  }

  async function stopSound() {
    await sound?.stopAsync();
    setIsPlaying(false);
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    navigation.setOptions({
      title: 'Template',
      headerRight: () => (
        <Link asChild href="/projects/new-project/records">
          <Button variant={'ghost'} className="p-0">
            <Text className="typo-[14-500] text-secondary">Next</Text>
          </Button>
        </Link>
      ),
    });
  }, [navigation]);

  return (
    <View className="flex flex-1 bg-white p-6">
      <Text className="typo-[20-500] mb-2">Choose your template</Text>
      <Select onValueChange={e => setTemplate(e?.value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a template" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem label="Generic" value="generic">
            Generic
          </SelectItem>
        </SelectContent>
      </Select>
      <Text className="typo-[20-500] mt-16 text-black">Template’s Instructions</Text>
      <Text className="typo-[16-400] mt-2 text-black">
        Here is the instruction text Saeid will write for the customers to help them record their
        voices. It is a template for the recording.
      </Text>
      <Text className="typo-[16-400] mt-5 text-black">
        Saeid should name this template in the admin panel, and it will appear in the users’
        template list. Later, users can select the template they need, see the instructions and
        sample audio, and upload their voice based on the sample file.
      </Text>

      <View className="flex flex-row mt-4 rounded-lg justify-center items-center border border-gray-20 px-4 py-2">
        <Button onPress={isPlaying ? stopSound : playSound} className="p-0" variant={'ghost'}>
          {!isPlaying ? <PlayIcon /> : <PauseIcon />}
        </Button>
        <Text className="typo-[16-500] text-black flex-1 ml-2">Play sample audio</Text>
        <AudioLinesIcon />
      </View>
    </View>
  );
};

export default Template;
