import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSettings } from '@/hooks';
import { supabase } from '@/lib/supabase';

type SelectTemplateProps = {
  onChange: (template: string | undefined) => void;
};

const SelectTemplate: React.FC<SelectTemplateProps> = ({ onChange = () => false }) => {
  const settings = useSettings(state => state.settings);
  const [templates, setTemplates] = useState<{ id: number; name: string; prompt: string }[]>([]);
  const [template, setTemplate] = useState<string | undefined>();
  const [templateDesc, setTemplateDesc] = useState<string | undefined>();

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
    onChange(template);
  }, [template]);

  return (
    <View className="flex flex-col">
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
    </View>
  );
};

export default SelectTemplate;
