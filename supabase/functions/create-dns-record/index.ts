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
    const address = did.split(':')[2];
    console.log("Extracted address:", address);

    // Format data for DNS record creation
    const data = {
      address: address.toLowerCase(),
      networkId: 11155111, // Sepolia testnet
    };

    console.log("Making request to OpenAttestation sandbox API...");
    const response = await fetch('https://dns-proof-sandbox.openattestation.com/api/records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error:", errorText);
      throw new Error(`API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log("API Response:", result);

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