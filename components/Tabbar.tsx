import { Text } from 'react-native';
import React, { FC, ReactNode, useState } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

type PropsT = {
  data: { label: string; value: string }[];
  className?: string;
  children: ReactNode;
};
const Tabbar: FC<PropsT> = ({ data, className, children }) => {
  const [value, setValue] = useState(data[0].value);

  return (
    <Tabs
      value={value}
      onValueChange={setValue}
      className={cn('w-full mx-auto flex-col gap-2', className)}
    >
      <TabsList className="flex-row w-full bg-gray-200">
        {data.map(i => (
          <TabsTrigger key={i.value} value={i.value} className="flex-1">
            <Text>{i.label}</Text>
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </Tabs>
  );
};

export default Tabbar;
