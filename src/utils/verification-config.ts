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

interface Secret {
  name: string;
  value: string;
}

const getInfuraApiKey = async (): Promise<string> => {
  try {
    console.log("Fetching Infura API key from Supabase secrets...");
    const { data, error } = await supabase
      .from('secrets')
      .select('value')
      .eq('name', 'INFURA_API_KEY')
      .single() as { data: Secret | null; error: any };
    
    if (error) {
      console.error("Error fetching Infura API key:", error);
      throw new Error("Failed to fetch Infura API key");
    }

    if (!data?.value) {
      console.error("No Infura API key found in secrets");
      throw new Error("Infura API key not found");
    }

    console.log("Successfully retrieved Infura API key");
    return data.value;
  } catch (error) {
    console.error("Error in getInfuraApiKey:", error);
    throw error;
  }
};

export const getVerificationConfig = async (): Promise<VerificationConfig> => {
  console.log("Getting verification configuration...");
  
  const infuraApiKey = await getInfuraApiKey();
  console.log("Using network: sepolia");
  
  // Set up the provider configuration for Sepolia
  const providerConfig: ProviderDetails = {
    network: "sepolia",
    providerType: "infura",
    url: `https://sepolia.infura.io/v3/${infuraApiKey}`,
    apiKey: infuraApiKey
  };

  console.log("Setting up provider configuration:", {
    network: providerConfig.network,
    url: providerConfig.url,
    providerType: providerConfig.providerType
  });

  // Set this as a global configuration for OpenAttestation
  // This is crucial to prevent fallback to default configuration
  if (typeof window !== 'undefined') {
    (window as any).openAttestationEthereumProviderConfig = providerConfig;
  }
  
  console.log("Global OpenAttestation provider config set");

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
  try {
    const config = await getVerificationConfig();
    return !!config.provider.apiKey;
  } catch (error) {
    console.error("Configuration check failed:", error);
    return false;
  }
};