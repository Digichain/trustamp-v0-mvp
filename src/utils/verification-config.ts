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
    const { data: secretData, error: secretError } = await supabase
      .from('secrets')
      .select('value')
      .eq('name', 'INFURA_API_KEY')
      .maybeSingle();
    
    if (secretError) {
      console.error("Error fetching Infura API key:", secretError);
      throw new Error("Failed to fetch Infura API key");
    }

    if (!secretData?.value) {
      console.error("No Infura API key found in secrets");
      throw new Error("Infura API key not found in secrets. Please ensure it is configured.");
    }

    console.log("Successfully retrieved Infura API key");
    return secretData.value;
  } catch (error) {
    console.error("Error in getInfuraApiKey:", error);
    throw error;
  }
};

export const getVerificationConfig = async (): Promise<VerificationConfig> => {
  console.log("Getting verification configuration...");
  
  try {
    const infuraApiKey = await getInfuraApiKey();
    const providerUrl = `https://sepolia.infura.io/v3/${infuraApiKey}`;
    
    console.log("Setting up verification configuration with Sepolia network");
    
    return {
      provider: {
        network: "sepolia",
        provider: providerUrl,
        apiKey: infuraApiKey
      }
    };
  } catch (error) {
    console.error("Error getting verification config:", error);
    throw error;
  }
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