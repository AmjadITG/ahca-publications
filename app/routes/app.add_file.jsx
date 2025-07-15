import { Page, Layout, PageActions, Card } from '@shopify/polaris';
import { useState, useCallback  } from 'react';
import { useNavigate } from '@remix-run/react';
import FileUpload from '../routes/app.FileUpload';
import ProductSelector from '../routes/app.ProductSelector';
import { useAppBridge } from '@shopify/app-bridge-react';
import { useFileContext } from '../routes/FileContext'

export default function SelectFiles() {
  const { saveItem } = useFileContext();
  const [file, setFile] = useState(null); 
  const [products, setProducts] = useState([]);
  const shopify = useAppBridge();
  const navigate = useNavigate();
    let  isSaveDisabled;

  const handleFileChange = useCallback((selectedFile) => {
    setFile(selectedFile); 
    isSaveDisabled = !file || products.length === 0;
  }, [file]);

  const handleProductsChange = useCallback((selectedProducts) => {
    setProducts(selectedProducts); 
    isSaveDisabled = !file || products.length === 0;
  }, [products]);

  const handleSave =  useCallback(() => {
    if (file && products.length > 0) {
      saveItem(file, products[0]);
       navigate('/app');
     }
  }, [file, products, saveItem]);
   isSaveDisabled = !file || products.length === 0;

  return (

    <Page class="Polaris-Page">
      <Layout>
        <Layout.Section >
          <FileUpload onFileChange={handleFileChange} />
          <ProductSelector shopify={shopify} onProductsChange={handleProductsChange} />
          <PageActions
            primaryAction={{
              content: 'Save',
             disabled: isSaveDisabled,
              onAction: handleSave,
            }}
            secondaryActions={[
              {
                content: 'Cancel',
                destructive: true,
                onAction: () => {
                  setFile(null);
                  setProducts([]);
                },
              },
            ]}
          />
        </Layout.Section>
        <Layout.Section variant="oneThird">
          <Card title="fileTags" sectioned>
            <p>Details</p>
            {file ? (
              <div>
                <p>File: {file.name}</p>
                <p>Size: {file.size} bytes</p>
              </div>
            ) : (
              <p>No file selected</p>
            )}

          </Card>
        </Layout.Section>
      </Layout>
    </Page >

  );
}


