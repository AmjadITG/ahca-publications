import {
  BlockStack,
  reactExtension,
  TextBlock,
  Banner,
  useApi,
  useStorage,
} from "@shopify/ui-extensions-react/customer-account";
import { useEffect, useState } from "react";

export default reactExtension(
  "customer-account.order-status.block.render",
  () => <PromotionBanner />
);

function PromotionBanner() {
  const { i18n } = useApi();
  const storage = useStorage();
  const [masterDeviceId, setMasterDeviceId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDeviceId() {
      try {
        const value = await storage.read("master_device_id");
        if (value) {
          setMasterDeviceId(value);
        } else {
          setError("Device ID not found.");
        }
      } catch (err) {
        console.error("Error reading from storage:", err);
        setError("Error fetching device ID.");
      }
    }

    fetchDeviceId();
  }, [storage]);

  return (
    <Banner>
      <BlockStack inlineAlignment="center">
        <TextBlock>{i18n.translate("earnPoints")}</TextBlock>
        {error ? (
          <TextBlock tone="critical">{error}</TextBlock>
        ) : (
          <TextBlock>
            {masterDeviceId ? `Device ID: ${masterDeviceId}` : "Loading..."}
          </TextBlock>
        )}
      </BlockStack>
    </Banner>
  );
}
