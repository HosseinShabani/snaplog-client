import { FlatList, Pressable, View, Text } from 'react-native';
import React, { FC } from 'react';
import { ProjectConst, ProjectT } from '@/constants/ProjectConst';
import { Button } from '@/components/ui/button';
import { Text as TextButton } from '@/components/ui/text';
import { DotIcon, PlusIcon } from '@/lib/icons';
import { Link } from 'expo-router';

const ProjectCard: FC<ProjectT> = ({ createdAt, id, name, status }) => {
  const renderStatus = (): JSX.Element => {
    if (status === 1) return <></>;
    if (status === 2) return <Text className="typo-[13-700] text-red">New</Text>;
    if (status === 3)
      return <Text className="typo-[13-700] text-green-500">Waiting for the result</Text>;
    else return <Text className="typo-[13-700] text-green-500">Uploading 2.4 MB/250 MB</Text>;
  };
  return (
    <Pressable className="flex flex-col py-4">
      <View className=" flex-row justify-between items-center">
        <Text className="typo-[16-600] text-gray-80">{name}</Text>
        <View className="flex flex-row gap-1">
          <View className="w-1 h-1 rounded-full bg-black" />
          <View className="w-1 h-1 rounded-full bg-black" />
          <View className="w-1 h-1 rounded-full bg-black" />
        </View>
      </View>
      <View className=" flex-row justify-between items-center mt-1">
        <Text className="typo-[13-400] text-gray-30">{createdAt}</Text>
        {renderStatus()}
      </View>
    </Pressable>
  );
};

const Projects = () => {
  return (
    <View className="flex flex-1 px-6 bg-white">
      <FlatList
        keyExtractor={i => String(i.id)}
        renderItem={({ item }) => <ProjectCard {...item} />}
        data={ProjectConst.data}
        contentContainerClassName={
          !ProjectConst.data.length ? 'flex-1 justify-center items-center' : ''
        }
        ItemSeparatorComponent={() => <View className="w-full h-[1px] bg-gray-20" />}
        ListEmptyComponent={() => (
          <View className="flex flex-col justify-center items-center">
            <Text className="typo-[24-700] text-black">Begin Your Data Collection</Text>
            <Text className="typo-[16-400] text-black mt-2 text-center">
              Your project list is empty. Ready to revolutionize data collection? Let’s create your
              first project!
            </Text>
            <Link asChild href={'/projects/new-project/template'}>
              <Button className="mt-8 flex-row gap-2 w-full">
                <PlusIcon className="text-white typo-[40] text-3xl" />
                <TextButton>Create new project</TextButton>
              </Button>
            </Link>
          </View>
        )}
      />
    </View>
  );
};

export default Projects;
