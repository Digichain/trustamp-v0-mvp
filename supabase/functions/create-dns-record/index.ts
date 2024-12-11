import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

interface CreateDNSRecordRequest {
  did: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { did } = await req.json() as CreateDNSRecordRequest;
    console.log('Creating DNS record for DID:', did);

    // Extract Ethereum address from DID
    const address = did.split(':')[2].split('#')[0];
    console.log('Extracted address:', address);

    // Format the DNS TXT record
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
        record: txtRecord
      })
    });

    console.log('API Response status:', response.status);
    const responseText = await response.text();
    console.log('Raw API Response:', responseText);

    if (!response.ok) {
      console.error('API Error Response:', responseText);
      throw new Error(`API Error: ${responseText}`);
    }

    let apiResponse;
    try {
      apiResponse = JSON.parse(responseText);
      console.log('Parsed API Response:', apiResponse);
    } catch (e) {
      console.error('Error parsing API response:', e);
      throw new Error('Invalid response format from DNS API');
    }

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