import { ScrollView, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Link, useNavigation, useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { FileDown, PlayIcon, EllipsisVertical } from 'lucide-react-native';
import { format } from 'date-fns';
import { toast } from 'burnt';

import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { ProjectT } from '@/constants/ProjectConst';
import Spinner from '@/components/Spinner';
import { downloadFile } from '@/lib/downloadFile';
import { AudioCodec } from '@/constants/AudioCodec';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import CsvReader from '@/components/CsvReader';

const HeaderRight = ({ id }: { id: string }) => {
  const router = useRouter();
  const [removing, setRemoving] = useState(false);

  const handleRemoveProject = async () => {
    try {
      setRemoving(true);
      const req = await supabase
        .from('submissions')
        .update([
          {
            removed: true,
          },
        ])
        .eq('id', id)
        .single();
      setRemoving(false);
      if (req.error) {
        toast({ title: req.error.message, haptic: 'error', preset: 'error' });
        return;
      }
      router.replace(`/projects`);
    } catch (e) {
      setRemoving(false);
      console.error(e);
      toast({
        title: 'Please try again',
        haptic: 'error',
        preset: 'error',
      });
    }
  };

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <View className="-mr-2.5 w-8 h-8 rounded-full bg-gray-10 justify-center items-center">
            <EllipsisVertical className="text-gray-800" size={20} />
          </View>
        </DropdownMenuTrigger>
        <DropdownMenuContent insets={{ left: 20 }} className="w-40 mt-1 mr-2 bg-white ">
          <Link asChild href={`/projects/${id}/edit`}>
            <DropdownMenuItem>
              <Text>Edit & Regenrate</Text>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Text>Remove the project</Text>
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
        <DialogContent className="bg-white sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="typo-[18-500] leading-snug">Remove the project</DialogTitle>
            <DialogDescription className="typo-[14-400] leading-snug">
              Are you sure you want to remove the project?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row">
            <DialogClose asChild>
              <Button variant="destructive" size="sm">
                <Text className="typo-[14-400] text-gray-80">No</Text>
              </Button>
            </DialogClose>
            <Button variant="default" size="sm" isLoading={removing} onPress={handleRemoveProject}>
              <Text className="typo-[14-400] text-white">Yes</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </DropdownMenu>
    </Dialog>
  );
};

const ProjectDetail = () => {
  const navigation = useNavigation();
  const [data, setData] = useState<ProjectT | null>(null);
  const [downloading, setDownloading] = useState(false);
  const { id } = useLocalSearchParams();
  const title = data ? data.name || format(new Date(data.created_at), 'yyyy/MM/dd HH:mm a') : '';

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
    await downloadFile(`${title}.${AudioCodec[path.data.type.toLowerCase()]}`, path.data);
    setDownloading(false);
  };

  useEffect(() => {
    supabase
      .from('submissions')
      .select('*, template (name)')
      .eq('id', id)
      .single()
      .then(res => {
        setData(res.data as ProjectT);
      });
    const listener = supabase
      .channel('single_project_change')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'submissions' },
        payload => {
          console.log(payload);
          if (String(payload.new.id) === id) {
            setData(payload.new as ProjectT);
          }
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(listener);
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title,
      headerRight: () => <HeaderRight id={id as string} />,
    });
  }, [data]);

  if (!data)
    return (
      <View className="flex-1 bg-white p-10">
        <Spinner isPrimaryColor size="large" className="mt-10" />
      </View>
    );
  return (
    <View className="flex flex-1 bg-white">
      <ScrollView contentContainerClassName="p-6 bg-white" className="flex flex-1">
        <Text
          className={cn('typo-[22-500] text-black', {
            '!text-red': data.status !== 'Ready',
          })}
        >
          {{
            Ready: 'Your log is ready!',
            Processing: 'Your log is processing!',
            Error: 'There was an issue processing your log!',
          }[data.status] ?? ''}
        </Text>
        <Text className="typo-[14-400] leading-snug text-black my-2">
          {{
            Ready:
              'Your AI-crafted results are ready! Download the CSV files of your voice data, transformed into tables by our advanced AI. Enjoy!',
            Processing:
              'Please wait a moment while we process your request! if it takes so long you can contact us.',
            Error:
              'Something went wrong while processing your voice data. Please try again, or contact support if the problem persists.',
          }[data.status] ?? ''}
        </Text>
        {data.status === 'Ready' && (
          <Button className="bg-primary flex-row h-11 mt-2" onPress={handleDownloadCSV}>
            <FileDown size={20} className="text-white" />
            <Text className="text-white typo-[16-500] flex-1 ml-2">Download CSV file</Text>
          </Button>
        )}
        <Button className="bg-primary flex-row h-11 mt-3" onPress={handleDownloadRecording}>
          {downloading ? <Spinner size="small" /> : <PlayIcon size={20} className="text-white" />}
          <Text className="text-white typo-[16-500] flex-1 ml-2">Download Recording file</Text>
        </Button>
        <View className="w-full h-0.5 bg-gray-20 my-8" />
        {/* Second section */}
        {data.status === 'Ready' && (
          <>
            <Text className="typo-[20-500] text-black mb-4">Project details</Text>
            <Text className="typo-[14-400] leading-snug text-gray-80 mb-3">
              <Text className="typo-[14-500]">Template:</Text> {data.template?.name ?? 'Generic'}
            </Text>
            <Text className="typo-[14-400] leading-snug text-gray-80 mb-3">
              <Text className="typo-[14-500]">Transcribed Text:</Text> {data.transcribed_content}
            </Text>
            <Text className="leading-snug text-gray-80 typo-[14-500] mb-1">CSV Preview:</Text>
            <CsvReader csvString={data.modified_content} />
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default ProjectDetail;
