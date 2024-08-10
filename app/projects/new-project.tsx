import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import { toast } from 'burnt';

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
import { AudioFile } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';

const NewProject = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const session = useAuth(state => state.session);
  const settings = useSettings(state => state.settings);
  const [templates, setTemplates] = useState<{ id: number; name: string; prompt: string }[]>([]);
  const [template, setTemplate] = useState<string | undefined>();
  const [projectName, setProjectName] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const [audioFile, setAudioFile] = useState<AudioFile | null | undefined>();
  const [templateDesc, setTemplateDesc] = useState<string | undefined>();
  const [tabbar, _] = useState([
    { label: 'Record audio', value: 'record' },
    { label: 'Upload audio', value: 'upload' },
  ]);

  const createBlobSoundFile = async (uri: string): Promise<{ blob: Blob; sound: Audio.Sound }> => {
    const base64 = await fetch(uri);
    const blob = await base64.blob();
    const { sound } = await Audio.Sound.createAsync({ uri });
    return { blob, sound };
  };

  const handleUploadAudio = async () => {
    const file = await DocumentPicker.getDocumentAsync({
      type: 'audio/*,audio/x-m4a,audio/m4a',
    });
    if (!file?.assets?.[0]) return;
    const { uri, name } = file.assets[0];
    const fileName = name.split('.').length >= 2 ? name.split('.').slice(0, -1).join('.') : name;
    const { sound, blob } = await createBlobSoundFile(uri);
    setAudioFile({
      blob,
      name: `${fileName}-${Date.now()}`,
      uri,
      sound,
    });
    if (!projectName) setProjectName(fileName);
  };

  const onRecordFinish = async (name: string, blob: Blob) => {
    const uri = URL.createObjectURL(blob);
    const { sound } = await Audio.Sound.createAsync({ uri });
    setAudioFile({
      blob,
      name,
      uri,
      sound,
    });
  };

  const handleSubmit = async () => {
    if (!template)
      return toast({ title: 'Please select template', haptic: 'error', preset: 'error' });
    if (!audioFile)
      return toast({
        title: 'Please upload audio or record audio',
        haptic: 'error',
        preset: 'error',
      });
    try {
      setUploading(true);
      const fileName = `${session?.user.id}/${audioFile.name}`;
      const upload = await supabase.storage.from('record').upload(fileName, audioFile.blob, {
        cacheControl: '3600',
        upsert: false,
      });
      if (upload.error && upload.error.message !== 'The resource already exists') {
        toast({ title: upload.error.message, haptic: 'error', preset: 'error' });
        setUploading(false);
        return;
      }
      const insertSubmission = await supabase
        .from('submissions')
        .insert([
          {
            name: projectName,
            recording: upload?.data?.path ?? `${fileName}`,
            user_id: session?.user.id,
            template: template === 'generic' ? null : template,
          },
        ])
        .select()
        .single();
      setUploading(false);
      if (insertSubmission.error) {
        toast({ title: insertSubmission.error.message, haptic: 'error', preset: 'error' });
        return;
      }
      const template_prompt =
        template === 'generic'
          ? settings.default_template
          : (templates.find(i => i.id.toString() === template)?.prompt ?? '');
      supabase.functions.invoke('create-submission', {
        body: {
          record: {
            ...insertSubmission.data,
            type: audioFile.blob.type,
            template_prompt,
            system_prompt: settings.system_prompt,
          },
        },
      });
      router.replace('/projects');
    } catch (e) {
      setUploading(false);
      console.error(e);
      toast({
        title: 'Please try again',
        haptic: 'error',
        preset: 'error',
      });
    }
  };

  const fetchTemplates = async () => {
    const req = await supabase.from('templates').select('*');
    if (req.data?.length) {
      setTemplates(req.data);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

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
    <View className="flex flex-1 bg-white">
      <ScrollView className="flex flex-1" contentContainerClassName="p-6">
        <Text className="typo-[16-500] text-gray-80 mb-2">Project Name</Text>
        <Input placeholder="Optional" value={projectName ?? ''} onChangeText={setProjectName} />
        <View className="h-8" />
        <Text className="typo-[16-500] text-gray-80 mb-2">Choose your template</Text>
        <Select onValueChange={e => setTemplate(e?.value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem label="Generic" value="generic">
              Generic
            </SelectItem>
            {templates.map(item => (
              <SelectItem key={item.id} label={item.name} value={String(item.id)}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {templateDesc && (
          <>
            <Text className="typo-[16-500] mt-6 text-black/90">Template’s Instructions</Text>
            <Text className="typo-[14-400] leading-snug mt-2 text-black/80">{templateDesc}</Text>
          </>
        )}
        <View className="h-8" />
        <Text className="typo-[16-500] text-gray-80 mb-2">Record or upload your file</Text>
        {audioFile && <AudioPlayer className="mb-3" source={audioFile} />}
        <Tabbar data={tabbar}>
          <TabsContent value="record">
            <Recorder onRecordFinish={onRecordFinish} />
          </TabsContent>
          <TabsContent value="upload">
            <Button
              onPress={handleUploadAudio}
              className="h-auto border-dashed border-zinc-400 shadow-lg shadow-gray-300/50"
              variant="outline"
            >
              <View className="flex flex-col items-center gap-1.5 py-2">
                <Upload className="text-zinc-600" size={24} />
                <Text className="typo-[16-500] text-zinc-800">Upload audio file</Text>
              </View>
            </Button>
          </TabsContent>
        </Tabbar>
      </ScrollView>
      <Button
        variant={'default'}
        className="flex-row gap-2 m-6 mt-1"
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
