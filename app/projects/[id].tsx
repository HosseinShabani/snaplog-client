import { ScrollView, Text, View } from 'react-native';
import React from 'react';
import NavBar from '@/components/navigation/NavBar';
import { Link, useNavigation } from 'expo-router';
import { Button } from '@/components/ui/button';
import { useLocalSearchParams } from 'expo-router';
import { Text as TextButton } from '@/components/ui/text';
import { FileDown } from 'lucide-react-native';

const ProjectDetail = () => {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  return (
    <View className="flex flex-1">
      <NavBar.Back
        navigation={navigation}
        options={{ title: `Project ${id}` }}
        renderRightContent={() => (
          <View className="flex flex-row gap-1">
            <View className="w-1 h-1 rounded-full bg-black" />
            <View className="w-1 h-1 rounded-full bg-black" />
            <View className="w-1 h-1 rounded-full bg-black" />
          </View>
        )}
      />
      <ScrollView contentContainerClassName="flex-1 p-6 bg-white" className="flex flex-1">
        <Text className="typo-[24-700] text-black">Download the result</Text>
        <Text className="typo-[16-400] text-black my-2">
          Your AI-crafted results are ready! Download the CSV files of your voice data, transformed
          into tables by our advanced AI. Enjoy!
        </Text>
        <Button className="bg-green-500 flex-row">
          <FileDown className="text-white" />
          <TextButton className="text-white typo-[16-500] flex-1 ml-2">
            Download the CSV files
          </TextButton>
          <TextButton className="text-white typo-[16-500]">640 kb</TextButton>
        </Button>
        <View className="w-full h-0.5 bg-gray-20 my-16" />
        {/* Second section */}
        <Text className="typo-[24-700] text-black">Project details</Text>
        <Text className="typo-[16-600] text-gray-80 my-6">Template: Saeid’s template</Text>
        <View className="w-full h-0.5 bg-gray-20 my-6" />
      </ScrollView>
    </View>
  );
};

export default ProjectDetail;
