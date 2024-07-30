import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const downloadFile = async (fileName: string, content: string | Blob) => {
  // Define the file path
  const fileUri = FileSystem.documentDirectory + fileName;
  if (typeof content === 'string') {
    // Write the CSV content to the file
    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    // Share the file
    await Sharing.shareAsync(fileUri);
  } else {
    // Convert blob to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64data = reader.result as string;
      await FileSystem.writeAsStringAsync(fileUri, base64data.split(',')[1], {
        encoding: FileSystem.EncodingType.Base64,
      });
      // Share the file
      await Sharing.shareAsync(fileUri);
    };
    reader.readAsDataURL(content);
  }
};
