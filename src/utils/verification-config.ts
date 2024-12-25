import { supabase } from "@/integrations/supabase/client";
import { ProviderDetails } from "@govtechsg/oa-verify";

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
    console.log("Fetching Infura API key from Supabase secrets...");
    const { data, error } = await supabase
      .from('secrets')
      .select('value')
      .eq('name', 'INFURA_API_KEY')
      .single();
    
    if (error) {
      console.error("Error fetching Infura API key:", error);
      return '6ed316896ad34f1cb4627d8564c95ab1'; // Fallback key
    }

    console.log("Successfully retrieved Infura API key");
    return data.value;
  } catch (error) {
    console.error("Error in getInfuraApiKey:", error);
    return '6ed316896ad34f1cb4627d8564c95ab1'; // Fallback key
  }
};

export const getVerificationConfig = async (): Promise<VerificationConfig> => {
  console.log("Getting verification configuration...");
  const infuraApiKey = await getInfuraApiKey();
  
  // Override the default provider configuration
  const providerConfig: ProviderDetails = {
    network: "sepolia" as const,
    providerType: "infura",
    url: `https://sepolia.infura.io/v3/${infuraApiKey}`,
    apiKey: infuraApiKey
  };

  // Set this as a global configuration for OpenAttestation
  (global as any).openAttestationEthereumProviderConfig = providerConfig;
  
  console.log("Verification config set with network:", providerConfig.network);
  console.log("Using provider URL:", providerConfig.url);

  return {
    provider: {
      network: "sepolia",
      provider: providerConfig.url,
      apiKey: infuraApiKey
    }
  };
};

// Helper to check if we have required configuration
export const isConfigured = async (): Promise<boolean> => {
  const config = await getVerificationConfig();
  return !!config.provider.apiKey;
};