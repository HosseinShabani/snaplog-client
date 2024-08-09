import { Audio } from 'expo-av';

export type AudioFile = {
  name: string;
  blob: Blob;
  uri: string;
  sound: Audio.Sound | null;
};
