import React, { FC, useEffect, useState } from 'react';
import { FlatList, Pressable, View, Text } from 'react-native';
import { Link, useNavigation } from 'expo-router';
import { format } from 'date-fns';

import { ProjectT } from '@/constants/ProjectConst';
import { Button } from '@/components/ui/button';
import { Text as TextButton } from '@/components/ui/text';
import { PlusIcon } from '@/lib/icons';
import { supabase } from '@/lib/supabase';
import Spinner from '@/components/Spinner';

const ProjectCard: FC<ProjectT> = ({ created_at, id, status }) => {
  const renderStatus = (): JSX.Element => {
    if (status === 'Error') return <Text className="typo-[13-500] text-red">Error</Text>;
    if (status === 'Ready') return <Text className="typo-[13-500] text-green-500">Ready</Text>;
    return <Text className="typo-[13-500] text-blue-500">Processing</Text>;
  };
  return (
    <Link asChild href={`/projects/${id}`}>
      <Pressable className="flex flex-col py-4">
        <View className=" flex-row justify-between items-center">
          <Text className="typo-[16-500] text-gray-80">
            {format(new Date(created_at), 'yyyy/MM/dd HH:mm a')}
          </Text>
        </View>
        <View className=" flex-row justify-between items-center mt-1">
          <Text className="typo-[13-400] text-gray-30">Click to view details</Text>
          {renderStatus()}
        </View>
      </Pressable>
    </Link>
  );
};

const Projects = () => {
  const [data, setData] = useState<ProjectT[]>([]);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      title: 'Projects',
    });
  }, [navigation]);

  useEffect(() => {
    supabase
      .from('submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .then(res => {
        setData(res.data as ProjectT[]);
        setIsLoading(false);
      });
    supabase
      .channel('room1')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'submissions' }, payload => {
        if (payload.eventType === 'UPDATE') {
          setData(state =>
            state.map(i => (i.id === payload.new.id ? (payload.new as ProjectT) : i)),
          );
        }
      })
      .subscribe();
    return () => {
      setIsLoading(false);
      supabase.removeAllChannels();
    };
  }, []);

  return (
    <View className="flex flex-1 px-6 bg-white">
      {isLoading ? (
        <Spinner isPrimaryColor size="large" className="mt-10" />
      ) : (
        <FlatList
          keyExtractor={i => String(i.id)}
          renderItem={({ item }) => <ProjectCard {...item} />}
          data={data}
          contentContainerClassName={!data.length ? 'flex-1 justify-center items-center' : ''}
          ItemSeparatorComponent={() => <View className="w-full h-[1px] bg-gray-20" />}
          ListEmptyComponent={() => (
            <View className="flex flex-col justify-center items-center">
              <Text className="typo-[24-500] text-black">Begin Your Data Collection</Text>
              <Text className="typo-[16-400] text-black mt-2 text-center">
                Your project list is empty. Ready to revolutionize data collection? Let’s create
                your first project!
              </Text>
              <Link asChild href={'/projects/new-project'}>
                <Button className="mt-8 flex-row gap-2 w-full">
                  <PlusIcon className="text-white typo-[40] text-3xl" />
                  <TextButton>Create new project</TextButton>
                </Button>
              </Link>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Projects;
