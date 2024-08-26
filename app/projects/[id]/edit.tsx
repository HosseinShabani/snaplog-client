import { ScrollView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { ProjectT } from '@/constants/ProjectConst';
import Spinner from '@/components/Spinner';
import SelectTemplate from '@/components/SelectTemplate';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'burnt';
import { useSettings } from '@/hooks';

const ProjectDetail = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const templates = useSettings(state => state.templates);
  const settings = useSettings(state => state.settings);
  const [data, setData] = useState<ProjectT | null>(null);
  const [template, setTemplate] = useState<string | undefined>();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { id } = useLocalSearchParams();

  useEffect(() => {
    supabase
      .from('submissions')
      .select('*, template (name)')
      .eq('id', id)
      .single()
      .then(res => {
        setData(res.data as ProjectT);
        setContent(res.data?.transcribed_content);
      });
  }, []);

  useEffect(() => {
    navigation.setOptions({ title: 'Edit & Regenrate' });
  }, []);

  const handleSubmit = async () => {
    if (!template)
      return toast({ title: 'Please select template', haptic: 'error', preset: 'error' });
    try {
      setLoading(true);
      const template_prompt =
        template === 'generic'
          ? settings.default_template
          : (templates.find(i => i.id.toString() === template)?.prompt ?? '');
      const res = await supabase.functions.invoke('modified-submission', {
        body: {
          transcribed_content: content,
          id,
          system_prompt: settings.system_prompt,
          template_prompt,
        },
      });
      setLoading(false);
      if (res.error) {
        toast({
          title: 'Please try again, or contact support if the problem persists.',
          haptic: 'error',
          preset: 'error',
        });
        return;
      }
      if (res.data?.error) {
        toast({
          title: res.data.error,
          haptic: 'error',
          preset: 'error',
        });
        return;
      }
      router.replace(`/projects/${id}`);
    } catch (e) {
      setLoading(false);
      console.error(e);
      toast({
        title: 'Please try again',
        haptic: 'error',
        preset: 'error',
      });
    }
  };

  if (!data)
    return (
      <View className="flex-1 bg-white p-10">
        <Spinner isPrimaryColor size="large" className="mt-10" />
      </View>
    );
  return (
    <View className="flex flex-1 bg-white">
      <ScrollView contentContainerClassName="p-6 bg-white" className="flex flex-1">
        <Text className="typo-[16-500] text-gray-80 mb-2">Choose your template</Text>
        <SelectTemplate onChange={setTemplate} />
        <View className="h-8" />
        <Text className="typo-[16-500] text-gray-80 mb-2">Edit transcribed content</Text>
        <Textarea
          placeholder="content..."
          value={content}
          onChangeText={setContent}
          aria-labelledby="transcribed"
        />
      </ScrollView>
      <Button isLoading={loading} variant="default" className="m-6 mt-1" onPress={handleSubmit}>
        <Text className="typo-[14-500] text-white">Submit</Text>
      </Button>
    </View>
  );
};

export default ProjectDetail;
