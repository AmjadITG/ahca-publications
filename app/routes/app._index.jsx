import { useEffect, useState, useCallback } from 'react';
import {
  Page, EmptyState, Card, BlockStack, Thumbnail, Text, InlineStack, TextField,
  IndexTable, IndexFilters, useSetIndexFiltersMode,
  useBreakpoints, Box 
} from '@shopify/polaris';
import { useNavigate } from '@remix-run/react';
import { NoteIcon } from '@shopify/polaris-icons';
import { useFileContext } from '../routes/FileContext';

export default function IndexPage() {
  const { savedItems } = useFileContext();
  const navigate = useNavigate();

  const [queryValue, setQueryValue] = useState('');
  
  const [sortSelected, setSortSelected] = useState(['name asc']);
  const { mode, setMode } = useSetIndexFiltersMode();

  const handleFiltersQueryChange = useCallback((value) => setQueryValue(value), []);
  const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);

  const sortOptions = [
    { label: 'File Name', value: 'name asc', directionLabel: 'A-Z' },
    { label: 'File Name', value: 'name desc', directionLabel: 'Z-A' },
    { label: 'File Size', value: 'size asc', directionLabel: 'Smallest First' },
    { label: 'File Size', value: 'size desc', directionLabel: 'Largest First' },
    { label: 'Product', value: 'product asc', directionLabel: 'A-Z' },
    { label: 'Product', value: 'product desc', directionLabel: 'Z-A' },
  ];

  const tabs = [
    {
      content: 'All',
      index: 0,
      id: 'All-0',
    },
  ];
  const [selected, setSelected] = useState(0);

  const resourceName = {
    singular: 'file',
    plural: 'files',
  };

  // Filter by search query
  const filteredItems = savedItems.filter(({ file, product }) =>
    file.name.toLowerCase().includes(queryValue.toLowerCase()) ||
    file.type?.toLowerCase().includes(queryValue.toLowerCase()) ||
    product?.title?.toLowerCase().includes(queryValue.toLowerCase())
  );

  const rowMarkup = filteredItems.map(({ id, file, product }, index) => (
    <IndexTable.Row
      id={id}
      key={id}
      position={index}
    >
      <IndexTable.Cell>
        <InlineStack gap="200" blockAlign="center">
          <Thumbnail
            source={
              ['image/gif', 'image/jpeg', 'image/png'].includes(file.type)
                ? window.URL.createObjectURL(file)
                : NoteIcon
            }
            alt={file.name}
            size="small"
          />
          <Text variant="bodyMd" fontWeight="bold" as="span">
            {file.name}
          </Text>
        </InlineStack>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" alignment="end" numeric>
          {(file.size / 1024).toFixed(2)} KB
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{file.type}</IndexTable.Cell>
      <IndexTable.Cell>
        {product ? product.title || product.id : 'No Product'}
      </IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Page sectioned>
      {savedItems.length < 1 && (
        <EmptyState
          heading="Manage your inventory transfers"
          action={{ content: 'Add First File', url: '/app/add_file' }}
          image="https://cdn.shopify.com/s/files/1/0909/0206/9619/files/emptystate-files.avif?width=500&v=1750777601"
        >
          <p>Track and receive your incoming inventory from suppliers.</p>
        </EmptyState>
      )}

      {savedItems.length > 0 && (
        <Box>
           <InlineStack  align="end" gap="400" paddingBlockEnd="200">
      <button
      onClick={() => navigate('/app/add_file')}
      style={{
        backgroundColor: '#008060',
        color: 'white',
        border: 'none',
        padding: '10px 16px',
        borderRadius: '4px',
        cursor: 'pointer',
        margin:'20px 0',
      }}
    >
      + Add File
    </button>
  </InlineStack>
          <IndexFilters
             
            queryValue={queryValue}
            queryPlaceholder="Search files"
            onQueryChange={handleFiltersQueryChange}
            onQueryClear={handleQueryValueRemove}
            onSort={setSortSelected}
            tabs={tabs}
            selected={selected}
            onSelect={setSelected}
            canCreateNewView={false}
            mode={mode}
            setMode={setMode}
            filters={[]} // No filters now
            appliedFilters={[]} // No filters now
          />
          <IndexTable
            condensed={useBreakpoints().smDown}
            resourceName={resourceName}
            itemCount={filteredItems.length}
            selectedItemsCount={0}
            selectable={false}
            headings={[
              { title: 'File Name' },
              { title: 'Size', alignment: 'end' },
              { title: 'File Type' },
              { title: 'Product' },
            ]}
          >
            {rowMarkup}
          </IndexTable>
        </Box>
      )}
    </Page>
  );
}
