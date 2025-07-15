import { DropZone, Card, InlineStack, Thumbnail, BlockStack, Text } from '@shopify/polaris';
import { NoteIcon } from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';
export default function FileUpload({ onFileChange }) {
  const [file, setFile] = useState(null);
  const [selectfile_outline, setselectfile_outline] = useState(true);
  const handleDropZoneDrop = useCallback(
    (_, acceptedFiles) => {
      const selectedFile = acceptedFiles[0];

  if (selectedFile && selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
        setselectfile_outline(false);
        onFileChange(selectedFile);
      } else {
       
        setFile(null);
        setselectfile_outline(true);
        alert("Only PDF files are allowed.");
      }
    },
    [onFileChange]
  );

  const uploadedFile = file && (
    <InlineStack alignment="center" gap="200" wrap="true">
      <Thumbnail
        size="small"
        alt={file.name}
        source={NoteIcon}
      />
      <BlockStack gap="100">
        <Text>{file.name}</Text>
        <Text variant="bodySm" as="p">
          {(file.size / 1024).toFixed(2)} KB
        </Text>
      </BlockStack>
    </InlineStack>
  );

  return (
    <Card title="Select file details" sectioned>
      <DropZone
        accept="application/pdf"
        allowMultiple={false}
        outline={selectfile_outline}
        label="Select PDF File"
        onDrop={handleDropZoneDrop}
      >
        {uploadedFile ? <Card>{uploadedFile}</Card> : <DropZone.FileUpload />}
      </DropZone>
    </Card>
  );
}
