import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { formatDNSTxtRecord } from "./dns-record-types.ts";

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
    
    // Extract Ethereum address from DID
    const address = did.split(':')[2].split('#')[0];
    console.log('Extracted address:', address);

    // Format and validate the DNS TXT record
    const txtRecordValue = formatDNSTxtRecord(address);
    console.log('Formatted TXT record:', txtRecordValue);

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
        record: txtRecordValue
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('API Error:', errorData);
      throw new Error(`Failed to create DNS record: ${errorData}`);
    }

    const apiResponse = await response.json();
    console.log('API Response:', apiResponse);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'DNS TXT record created successfully',
        data: {
          subdomain: subdomain,
          txtRecord: txtRecordValue,
          apiResponse
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
        message: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})