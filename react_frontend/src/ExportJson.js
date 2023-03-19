import React from 'react';
import Button from '@mui/material/Button';

export default function ExportButton({ data }) {
  const exportToJson = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = 'bases_data.json';
    link.click();
  };

  return (
    <Button onClick={exportToJson} variant="contained" color="primary">
      Export to JSON
    </Button>
  );
}
