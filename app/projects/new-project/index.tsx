import React, { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useAuth, useSettings } from '@/hooks';
import { Upload } from '@/lib/icons';
import AudioPlayer from '@/components/AudioPlayer';
import { supabase } from '@/lib/supabase';
import Tabbar from '@/components/Tabbar';
import { TabsContent } from '@/components/ui/tabs';
import Recorder from '@/components/Recorder';
import { Sound } from 'expo-av/build/Audio';

const NewProject = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const session = useAuth(state => state.session);
  const settings = useSettings(state => state.settings);
  const [template, setTemplate] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null | undefined>();
  const [soundFile, setSoundFile] = useState<Audio.Sound | null | undefined>();
  const [templateDesc, setTemplateDesc] = useState<string | undefined>();
  const [tabbar, _] = useState([
    { label: 'Record audio', value: 'record' },
    { label: 'Upload audio', value: 'upload' },
  ]);

  const handleUploadAudio = async () => {
    const file = await DocumentPicker.getDocumentAsync({
      type: 'audio/*',
    });
    if (!file?.assets?.[0]) return;
    setAudioFile(file.assets[0].file);
    const { sound } = await Audio.Sound.createAsync({ uri: file.assets[0].uri });
    setSoundFile(sound);
  };

  const onRecordFinish = async (file: Sound | null) => {
    console.log('fire', file);
    setAudioFile(file);
    const { sound } = await Audio.Sound.createAsync({ uri: file });
    setSoundFile(sound);
  };

  const handleSubmit = async () => {
    if (!audioFile) return;
    setUploading(true);
    const fileName = `${session?.user.id}/${audioFile.name}`;
    const upload = await supabase.storage.from('record').upload(fileName, audioFile, {
      cacheControl: '3600',
      upsert: false,
    });
    if (upload.error && upload.error.message !== 'The resource already exists') {
      Alert.alert(upload.error.message);
      setUploading(false);
      return;
    }

    const insertSubmission = await supabase
      .from('submissions')
      .insert([{ recording: upload?.data?.path ?? `${fileName}`, user: session?.user.id }])
      .select()
      .single();
    setUploading(false);
    if (insertSubmission.error) {
      Alert.alert(insertSubmission.error.message);
      return;
    }
    supabase.functions.invoke('create-submission', {
      body: {
        record: {
          ...insertSubmission.data,
          type: audioFile.type,
          template_prompt: settings.default_template,
          system_prompt: settings.system_prompt,
        },
      },
    });
    router.replace('/projects');
  };

  useEffect(() => {
    if (template === 'generic') {
      setTemplateDesc(settings.default_template_desc ?? '');
    }
  }, [template]);

  useEffect(() => {
    navigation.setOptions({
      title: 'New Project',
    });
  }, [navigation]);

  return (
    <View className="flex flex-1 bg-white p-6">
      <View className="flex flex-1 pb-6">
        <Text className="typo-[20-500] mb-3">Choose your template</Text>
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
        {templateDesc && (
          <>
            <Text className="typo-[16-500] mt-6 text-black/90">Template’s Instructions</Text>
            <Text className="typo-[14-400] leading-snug mt-2 text-black/80">{templateDesc}</Text>
          </>
        )}
        <Text className="typo-[20-500] mt-12 mb-3">Record or upload your file</Text>
        <Tabbar data={tabbar}>
          <TabsContent value="record">
            <Recorder onRecordFinish={onRecordFinish} />
          </TabsContent>
          <TabsContent value="upload">
            {soundFile && <AudioPlayer className="mb-3" source={soundFile} />}
            <Button
              onPress={handleUploadAudio}
              className="h-auto border-dashed border-zinc-400"
              variant="outline"
              disabled={!!audioFile}
            >
              <View className="flex flex-col items-center gap-1.5 py-2">
                <Upload className="text-zinc-600" size={24} />
                <Text className="typo-[16-500] text-zinc-800">Upload audio file</Text>
              </View>
            </Button>
          </TabsContent>
        </Tabbar>
      </View>
      <Button
        variant={'default'}
        className="flex-row gap-2 w-full"
        disabled={!audioFile || !template}
        isLoading={uploading}
        onPress={handleSubmit}
      >
        {uploading ? (
          <Text className="typo-[16-500] text-white">Submitting...</Text>
        ) : (
          <Text className="typo-[16-500] text-white">Submit</Text>
        )}
      </Button>
    </View>
  );
};

export default NewProject;
