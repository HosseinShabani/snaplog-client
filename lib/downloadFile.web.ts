export const downloadFile = async (fileName: string, content: string | Blob) => {
  // Create a blob from the CSV content
  const blob = typeof content === 'string' ? new Blob([content], { type: 'text/csv' }) : content;
  const url = URL.createObjectURL(blob);
  // Create a temporary anchor element to trigger the download
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  // Cleanup
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
