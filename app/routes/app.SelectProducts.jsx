import {
    BlockStack,
    Thumbnail,
    Text,
    Card,
    Button,
    SkeletonThumbnail
} from '@shopify/polaris';
import {
    XSmallIcon
} from '@shopify/polaris-icons';



export default function SelectProducts({ product, setSelectProducts, setSelectProIds, selectProIds, selectProducts }) {

    function removeProduct(event) {
        let id = event.target.closest('button').id;
        selectProIds = selectProIds.filter((ele, i) => (ele.id != id));
        selectProducts = selectProducts.filter((ele, i) => (ele.id != id));
        setSelectProducts([]);
        setSelectProIds([]); 
    }

    return (
        <>
            <BlockStack gap="100">
                <Card padding="300">
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
                        <div style={{ display: 'flex', maxWidth: 'calc(100% - 115px)' }}>
                            {product.images?.length ? (
                                <Thumbnail
                                    source={product.images[0].originalSrc}
                                    alt="Black choker necklace"
                                    size="small"
                                />
                            ) : (<SkeletonThumbnail size="small" />)}
                            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '15px', justifyContent: 'center' }}>
                                <Text as="p" fontWeight="medium">{product.title}</Text>
                                {product.hasOnlyDefaultVariant ? <Text as="p" variant="bodySm" >{product.variants[0].price}</Text> : <Text as="p" variant="bodySm">({product.variants.length} of {product.totalVariants} variants selected)</Text>}
                            </div>
                        </div>
                        <div style={{ display: 'flex', maxWidth: '100px', width: '100%', justifyContent: 'flex-end', gap: '25px' }}>
                            <Button icon={XSmallIcon} onClick={removeProduct} id={product.id} variant="plain"></Button>
                        </div>
                        
                    </div>
                </Card>

            </BlockStack>
        </>
    )
}