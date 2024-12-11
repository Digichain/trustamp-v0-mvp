import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

console.log("Loading create-dns-record function...");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { did } = await req.json();
    console.log("Received request with DID:", did);

    if (!did) {
      throw new Error('DID is required');
    }

    // Extract Ethereum address from DID
    const addressMatch = did.match(/did:ethr:(0x[a-fA-F0-9]{40})/);
    if (!addressMatch) {
      throw new Error('Invalid DID format');
    }

    const address = addressMatch[1].toLowerCase();
    console.log("Extracted address:", address);

    // Format data for DNS record creation according to OpenAttestation requirements
    const data = {
      address,
      network: "sepolia",
      networkId: "11155111",
      type: "openatts",
      identifier: `did:ethr:${address}`
    };

    console.log("Making request to OpenAttestation sandbox API with data:", data);
    
    const response = await fetch('https://dns-proof-sandbox.openattestation.com/api/records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const responseText = await response.text();
    console.log("Raw API Response:", responseText);

    if (!response.ok) {
      console.error("API Error Status:", response.status);
      throw new Error(`API error: ${response.status} ${responseText}`);
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse API response:", e);
      throw new Error("Invalid response from DNS API");
    }

    console.log("Parsed API Response:", result);

    if (!result.location) {
      throw new Error("DNS location not returned from API");
    }

    return new Response(
      JSON.stringify({
        data: {
          dnsLocation: result.location,
          record: result.record
        }
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error("Error in create-dns-record:", error);
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});