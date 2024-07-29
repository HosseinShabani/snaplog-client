import { ScrollView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { FileDown } from 'lucide-react-native';

import { Button } from '@/components/ui/button';
import { Text as TextButton } from '@/components/ui/text';
import { supabase } from '@/lib/supabase';
import { ProjectT } from '@/constants/ProjectConst';
import Spinner from '@/components/Spinner';

const ProjectDetail = () => {
  const navigation = useNavigation();
  const [data, setData] = useState<ProjectT | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useLocalSearchParams();

  useEffect(() => {
    supabase
      .from('submissions')
      .select('*')
      .eq('id', id)
      .single()
      .then(res => {
        setData(res.data as ProjectT);
        setIsLoading(false);
      });
    navigation.setOptions({ title: `Project ${id}` });
  }, []);

  if (!data) return null;
  return (
    <View className="flex flex-1 bg-white">
      {isLoading ? (
        <Spinner isPrimaryColor size="large" className="mt-10" />
      ) : (
        <ScrollView contentContainerClassName="flex-1 p-6 bg-white" className="flex flex-1">
          <Text className="typo-[24-500] text-black">Download the result</Text>
          <Text className="typo-[16-400] text-black my-2">
            Your AI-crafted results are ready! Download the CSV files of your voice data,
            transformed into tables by our advanced AI. Enjoy!
          </Text>
          <Button className="bg-green-500 flex-row">
            <FileDown className="text-white" />
            <TextButton className="text-white typo-[16-500] flex-1 ml-2">
              Download the CSV files
            </TextButton>
            {/* <TextButton className="text-white typo-[16-500]">640 kb</TextButton> */}
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
      )}
    </View>
  );
};

export default ProjectDetail;
