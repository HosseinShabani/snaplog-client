import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import Papa from 'papaparse';

type CsvReaderProps = {
  csvString?: string;
};

const CsvReader: React.FC<CsvReaderProps> = ({ csvString }) => {
  const [data, setData] = useState<string[][]>([]);
  const rowCount = useMemo(
    () => data.reduce((final, item) => (item.length > final ? item.length : final), 0),
    [data],
  );
  const rowChars = useMemo(
    () =>
      data.reduce((final, item) => {
        const newArr: number[] = final;
        for (let x = 0; x < rowCount; x++) {
          if ((item[x] ?? '').length > newArr[x]) newArr[x] = item[x].length;
        }
        return newArr;
      }, new Array(rowCount).fill(0)),
    [rowCount],
  );

  useEffect(() => {
    if (csvString) {
      const parsedData = Papa.parse<string[]>(csvString, {
        skipEmptyLines: true, // Skip empty lines
        delimiter: ',',
      });
      setData(parsedData.data);
    }
  }, []);

  const renderItem = ({ item, index }: { item: string[]; index: number }): JSX.Element => (
    <View className="flex flex-row flex-1 ">
      <View className="bg-gray-50 w-10 border-b border-gray-200 p-1.5 shrink-0 grow">
        <Text className="typo-[14-400] text-black">{index + 1}</Text>
      </View>
      {rowChars.map((chars, key) => (
        <View
          key={key}
          className="border-l border-b border-gray-200 max-w-36 min-w-16 p-1.5 shrink-0 grow-[2]"
          style={{ width: chars * 10 }}
        >
          <Text className="flex-1 typo-[14-400] text-gray-80">{item[key]?.trim()}</Text>
        </View>
      ))}
    </View>
  );

  if (data.length === 0) return null;

  return (
    <FlatList
      className="w-full border border-gray-200"
      contentContainerClassName="overflow-x-scroll"
      data={data}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderItem}
    />
  );
};

export default CsvReader;
