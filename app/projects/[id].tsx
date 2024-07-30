import { ScrollView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { FileDown, PlayIcon } from 'lucide-react-native';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { ProjectT } from '@/constants/ProjectConst';
import Spinner from '@/components/Spinner';
import { downloadFile } from '@/lib/downloadFile';

const ProjectDetail = () => {
  const navigation = useNavigation();
  const [data, setData] = useState<ProjectT | null>(null);
  const [downloading, setDownloading] = useState(false);
  const { id } = useLocalSearchParams();
  const title = data?.created_at ? format(new Date(data.created_at), 'yyyy/MM/dd HH:mm a') : '';

  const handleDownloadCSV = async () => {
    if (!data?.modified_content) return;
    const lines = data.modified_content.trim().split('\n');
    const parsedData: string[][] = lines.map(line => {
      return line.split(',').map(value => value.trim());
    });
    const csvContent = parsedData.map(line => line.join(',')).join('\n');
    await downloadFile(`${title}.csv`, csvContent);
  };

  const handleDownloadRecording = async () => {
    if (!data?.recording) return;
    setDownloading(true);
    const path = await supabase.storage.from('record').download(data.recording);
    if (!path.data) {
      setDownloading(false);
      return;
    }
    const audioCodec: Record<string, string> = {
      'audio/3gpp': '3gpp',
      'audio/midi': 'mid',
      'audio/mp3': 'mp3',
      'audio/mp4': 'mp4',
      'audio/mpeg': 'mpga',
      'audio/ogg': 'ogg',
      'audio/wav': 'wav',
      'audio/wave': 'wav',
      'audio/webm': 'webm',
    };
    await downloadFile(`${title}.${audioCodec[path.data.type.toLowerCase()]}`, path.data);
    setDownloading(false);
  };

  useEffect(() => {
    supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single()
      .then(res => {
        setData(res.data as ProjectT);
      });
  }, []);

  useEffect(() => {
    navigation.setOptions({ title });
  }, [data]);

  if (!data)
    return (
      <View className="flex-1 bg-white py-10">
        <Spinner isPrimaryColor size="large" className="mt-10" />
      </View>
    );
  return (
    <View className="flex flex-1 bg-white">
      <ScrollView contentContainerClassName="p-6 bg-white" className="flex flex-1">
        <Text className="typo-[24-500] text-black">Download the result</Text>
        <Text className="typo-[16-400] text-black my-2">
          Your AI-crafted results are ready! Download the CSV files of your voice data, transformed
          into tables by our advanced AI. Enjoy!
        </Text>
        <Button className="bg-primary flex-row h-11" onPress={handleDownloadCSV}>
          <FileDown size={20} className="text-white" />
          <Text className="text-white typo-[16-500] flex-1 ml-2">Download CSV file</Text>
        </Button>
        <Button className="bg-primary flex-row h-11 mt-3" onPress={handleDownloadRecording}>
          {downloading ? <Spinner size="small" /> : <PlayIcon size={20} className="text-white" />}
          <Text className="text-white typo-[16-500] flex-1 ml-2">Download Recording file</Text>
        </Button>
        <View className="w-full h-0.5 bg-gray-20 my-8" />
        {/* Second section */}
        <Text className="typo-[20-500] text-black mb-4">Project details</Text>
        <Text className="typo-[14-400] leading-snug text-gray-80 mb-2">
          <Text className="typo-[14-500]">Template</Text>: Generic
        </Text>
        <Text className="typo-[14-400] leading-snug text-gray-80 mb-2">
          <Text className="typo-[14-500]">Transcribed Text</Text>: {data.transcribed_content}
        </Text>
        <View className="w-full h-0.5 bg-gray-20 my-6" />
      </ScrollView>
    </View>
  );
};

export default ProjectDetail;
