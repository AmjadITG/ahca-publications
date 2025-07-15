// app/components/ProductSelector.jsx
import { TextField, Button, Icon, BlockStack , Card  } from '@shopify/polaris';
import { SearchIcon } from '@shopify/polaris-icons';
import { useState, useCallback } from 'react';
import SelectProducts from '../routes/app.SelectProducts';

export default function ProductSelector({ shopify, onProductsChange }) {
  const [selectProducts, setSelectProducts] = useState([]);
  const [selectProIds, setSelectProIds] = useState([]);

  const handleTextFieldChange = useCallback(async () => {
    const products = await shopify.resourcePicker({
      type: 'product',
      action: 'select',
      multiple: false,
      selectionIds: selectProIds,
    });
    if (products) {
      setSelectProducts(products);
      const selProId = products.map((product) => ({ id: product.id }));
      setSelectProIds(selProId);
      onProductsChange(products);
    }
  }, [shopify, selectProIds, onProductsChange]);

  return (
    <Card>
      <BlockStack gap="200">
        <TextField
          label="Search"
          type="text"
          onFocus={handleTextFieldChange}
          autoComplete="off"
          connectedRight={<Button onClick={handleTextFieldChange}>Browse</Button>}
          prefix={<Icon source={SearchIcon} tone="subdued" />}
        />
        {selectProducts.length > 0 && (
          selectProducts.map((pro, i) => (
            <SelectProducts
              product={pro}
              key={i}
              setSelectProducts={setSelectProducts}
              selectProIds={selectProIds}
              selectProducts={selectProducts}
              setSelectProIds={setSelectProIds}
            />
          ))
        )}
      </BlockStack>
    </Card>
  );
}