import { supabase } from "@/integrations/supabase/client";

export interface ProviderConfig {
  network: "mainnet" | "sepolia" | "local";
  provider?: string;
  apiKey?: string;
}

export interface VerificationConfig {
  provider: ProviderConfig;
}

const getInfuraApiKey = async (): Promise<string> => {
  try {
    const { data: { INFURA_API_KEY } } = await supabase.functions.invoke('get-secret', {
      body: { secretName: 'INFURA_API_KEY' }
    });
    return INFURA_API_KEY || '';
  } catch (error) {
    console.error("Error fetching Infura API key:", error);
    return '';
  }
};

export const getVerificationConfig = async (): Promise<VerificationConfig> => {
  console.log("Getting verification configuration...");
  const infuraApiKey = await getInfuraApiKey();
  
  return {
    provider: {
      network: "sepolia",  // We're using Sepolia testnet as default
      provider: `https://sepolia.infura.io/v3/${infuraApiKey}`,
      apiKey: infuraApiKey
    }
  };
};

// Helper to check if we have required configuration
export const isConfigured = async (): Promise<boolean> => {
  const config = await getVerificationConfig();
  return !!config.provider.apiKey;
};