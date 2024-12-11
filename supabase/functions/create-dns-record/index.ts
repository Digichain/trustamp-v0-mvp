import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

interface CreateDNSRecordRequest {
  did: string;
  subdomain: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { did, subdomain } = await req.json() as CreateDNSRecordRequest;
    console.log('Creating DNS record for:', { did, subdomain });

    // Extract Ethereum address from DID
    const address = did.split(':')[2].split('#')[0];
    console.log('Extracted address:', address);

    // Format the DNS TXT record
    const txtRecord = `openatts net=ethereum netId=11155111 addr=${address}`;
    console.log('Formatted TXT record:', txtRecord);

    // Create the DNS record using the OpenAttestation sandbox API
    const apiUrl = `https://sandbox.openattestation.com/dns-txt`;
    console.log(`Making API request to: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subdomain: subdomain,
        record: txtRecord
      })
    });

    const responseText = await response.text();
    console.log('API Response text:', responseText);

    if (!response.ok) {
      throw new Error(`API Error: ${responseText}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'DNS TXT record created successfully',
        data: {
          subdomain: subdomain,
          txtRecord: txtRecord,
          apiResponse: responseText
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error creating DNS record:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: `Failed to create DNS record: ${error.message}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})