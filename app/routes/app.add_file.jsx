import { Page, Layout, PageActions, Card } from '@shopify/polaris';
import { useState, useCallback  } from 'react';
import { useNavigate,useFetcher } from '@remix-run/react';
import FileUpload from '../routes/app.FileUpload';
import ProductSelector from '../routes/app.ProductSelector';
import { useAppBridge } from '@shopify/app-bridge-react';
import { useFileContext } from '../routes/FileContext'
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  
  return null;
};

export const action = async ({ request }) => {
  console.log('Working first');
  const { admin } = await authenticate.admin(request);
  //console.log(await request.formData(),'testfcvghjbnk');
  const body = await request.formData();
  const file = body.get("File");
  const productid = body.get("Product");
   console.log('File:', file);
   console.log('Product:', productid);

    if (!file || !productid) {
      return json({ success: false, error: "File and Product ID are required." }, { status: 400 });
    }

    const metafieldMutation = `
      mutation productUpdateMetafield($input: MetafieldsSetInput!) {
        metafieldsSet(metafields: [$input]) {
        metafields {
          id
          key
          namespace
          value
        }
        userErrors {
          field
          message
        }
        }
      }
    `;

    const metafieldVariables = {
      input: {
        ownerId: productid, // Use the product ID from the created product
        namespace: "custom",
        key: "ebook_url",
        type: "single_line_text_field",
        value: file, // Ensure this is the correct URL
      },
    };

const metafieldResponse = await admin.graphql(metafieldMutation, { variables: metafieldVariables });
const metafieldResult = await metafieldResponse.json();
console.log('Metafield Update Response:', metafieldResult);
if (metafieldResult?.data?.metafieldsSet?.userErrors?.length > 0) {
  metafieldResult.data.metafieldsSet.userErrors.forEach(error => {
    console.error(`Error in field "${error.field}": ${error.message}`);
  });
  return json({ success: false, errors: metafieldResult.data.metafieldsSet.userErrors }, { status: 400 });
}
return json({ success: true });


};

export default function SelectFiles() {
  const { saveItem } = useFileContext();
  const [file, setFile] = useState(null); 
  const [products, setProducts] = useState([]);
  const [fileurl, setfileurl] = useState(null);
  const [productid, setproductid] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const shopify = useAppBridge();
  const navigate = useNavigate();
  const fetcher = useFetcher();
    let  isSaveDisabled;

  const handleFileChange = useCallback((selectedFile) => {
    setFile(selectedFile); 
    isSaveDisabled = !file || products.length === 0;
  }, [file]);

  const handleProductsChange = useCallback((selectedProducts) => {
    setProducts(selectedProducts); 
    isSaveDisabled = !file || products.length === 0;
  }, [products]);

  const handleSave = useCallback(() => {
    if (file && products.length > 0) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      //formData.append('Productid', products[0].id)
      fetch('https://ebook-management.vercel.app/upload-pdf', {
        method: 'POST',
        body: formData
      })
        .then(async (res) => {
          console.log(res);
          const isJson = res.headers.get('content-type')?.includes('application/json');
          const data = isJson ? await res.json() : await res.text();
          console.log('✅ Upload result:', data);
          setfileurl(data.fileUrl);
          const selectedProduct = products[0];
          const productId = selectedProduct.id; 
          setproductid(productId);
          generateProduct(data.fileUrl, productId);
          // console.log(data.fileUrl);
          
          saveItem(file, products[0]);
          navigate('/app');
        })
        .catch((err) => {
          console.error('Upload failed:', err);
        })
        .finally(() => {
        setIsLoading(false); // loader stop
      });
    }
  }, [file, products, saveItem, navigate]);

  const generateProduct = (x, y) => {
  const formData = new FormData();
  formData.append('File',x);
  formData.append('Product',y);
  console.log('Working');
  fetcher.submit(formData, { method: "POST"});
  };

   isSaveDisabled = !file || products.length === 0;

  return (

    <Page class="Polaris-Page">
      <Layout>
        <Layout.Section >
          <FileUpload onFileChange={handleFileChange} />
          <ProductSelector shopify={shopify} onProductsChange={handleProductsChange} />
          <PageActions
            primaryAction={{
              content: isLoading ? 'Saving...' : 'Save',
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


