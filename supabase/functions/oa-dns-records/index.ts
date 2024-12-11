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

    const requestData = await req.json();
    console.log("Request data:", requestData);

    const { did, action } = requestData;
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

    // Create DNS record using OpenAttestation API
    const apiUrl = 'https://api.openattestation.com/dns-txt';
    const requestBody = {
      address: address,
      network: 'sepolia',
      type: "openatts"
    };

    console.log("Sending request to OpenAttestation API:", {
      url: apiUrl,
      body: requestBody
    });

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await apiResponse.text();
    console.log("Raw API response:", responseText);

    if (!apiResponse.ok) {
      console.error("Error from OpenAttestation API:", {
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        response: responseText
      });
      throw new Error(`Failed to create DNS record: ${responseText}`);
    }

    const apiData = responseText ? JSON.parse(responseText) : null;
    console.log("Parsed OpenAttestation API response:", apiData);

    // Format the response
    const dnsName = `${address.slice(2).toLowerCase()}.openattestation.com`;

    return new Response(
      JSON.stringify({
        data: {
          dnsLocation: dnsName,
          apiResponse: apiData
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
    console.error("Error in oa-dns-records:", {
      error: error.message,
      stack: error.stack,
      type: error.constructor.name
    });
    
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.stack
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