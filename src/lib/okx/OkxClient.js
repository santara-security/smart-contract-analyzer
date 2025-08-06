import { OKXDexClient } from "@okx-dex/okx-dex-sdk";
export function getClient() {
  const {
    OKX_API_KEY,
    OKX_SECRET_KEY,
    OKX_API_PASSPHRASE,
    OKX_PROJECT_ID,
  } = process.env;

  if (!OKX_API_KEY || !OKX_SECRET_KEY || !OKX_API_PASSPHRASE || !OKX_PROJECT_ID) {
    throw new Error(
      "Missing required OKX credentials. Ensure OKX_API_KEY, OKX_SECRET_KEY, OKX_API_PASSPHRASE, OKX_PROJECT_ID are set."
    );
  }

  // Initialize OKX DEX SDK client
  // The SDK exposes multiple modules; for supported chains we can use the public client.
  // If the SDK signature changes, adjust accordingly.
  // Construct with project-specific headers/keys if required by the SDK.
  // Construct OKX DEX client using official class
  const client = new OKXDexClient({
    apiKey: OKX_API_KEY,
    secretKey: OKX_SECRET_KEY,
    apiPassphrase: OKX_API_PASSPHRASE,
    projectId: OKX_PROJECT_ID,
  });

  return client;
}

export default{
    getClient
}