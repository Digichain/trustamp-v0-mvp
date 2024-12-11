import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CreateDNSRequest {
  did: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { did } = await req.json() as CreateDNSRequest;
    console.log('Creating DNS record for DID:', did);

    // Extract Ethereum address from DID
    const address = did.split(':')[2].toLowerCase();
    console.log('Extracted address:', address);

    // Format the DNS TXT record according to OpenAttestation specs
    const txtRecord = `openatts net=ethereum netId=11155111 addr=${address}`;
    console.log('Formatted TXT record:', txtRecord);

    // Create the DNS record using the OpenAttestation sandbox API
    const response = await fetch('https://dns-proof-sandbox.openattestation.com/api/records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sandbox'
      },
      body: JSON.stringify({
        record: txtRecord,
        type: 'TXT'
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DNS API Error Response:', errorText);
      throw new Error(`DNS API Error: ${errorText}`);
    }

    const apiResponse = await response.json();
    console.log('DNS API Response:', apiResponse);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'DNS TXT record created successfully',
        data: {
          dnsLocation: apiResponse.location,
          txtRecord,
          apiResponse
        }
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error in create-dns-record function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: `Failed to create DNS record: ${error.message}`,
        error: error.stack
      }),
      {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 400,
      },
    )
  }
})