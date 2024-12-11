import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

serve(async (req) => {
  try {
    console.log("Received request:", {
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries())
    });

    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      console.log("Handling CORS preflight request");
      return new Response(null, { 
        headers: corsHeaders 
      });
    }

    const { did, action } = await req.json();
    console.log(`Processing request with DID: ${did}, action: ${action}`);

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

    // Create DNS record using OpenAttestation sandbox API
    const sandboxResponse = await fetch('https://dns-proof-sandbox.openattestation.com/api/records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address: address,
        networkId: 11155111, // Sepolia testnet
        type: "openatts"
      })
    });

    if (!sandboxResponse.ok) {
      const errorData = await sandboxResponse.text();
      console.error("Error from sandbox API:", errorData);
      throw new Error(`Failed to create DNS record: ${errorData}`);
    }

    const sandboxData = await sandboxResponse.json();
    console.log("Sandbox API response:", sandboxData);

    // Format the response
    const dnsName = `${address.slice(2).toLowerCase()}.openattestation.com`;

    return new Response(
      JSON.stringify({
        data: {
          dnsLocation: dnsName,
          sandboxResponse: sandboxData
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
    console.error("Error in oa-dns-records:", error);
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