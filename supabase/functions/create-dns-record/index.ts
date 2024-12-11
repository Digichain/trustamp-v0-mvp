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
    
    const DNS_PROVIDER_API_KEY = Deno.env.get('DNS_PROVIDER_API_KEY');
    if (!DNS_PROVIDER_API_KEY) {
      throw new Error('DNS provider API key not configured');
    }

    // Extract Ethereum address from DID
    const address = did.split(':')[2].split('#')[0];
    console.log('Extracted address:', address);

    // Format and validate the DNS TXT record
    const txtRecordValue = formatDNSTxtRecord(address);
    console.log('Formatted TXT record:', txtRecordValue);

    console.log(`Creating TXT record for ${subdomain} with value: ${txtRecordValue}`);

    // Here you would implement the actual API call to your DNS provider
    // Example with a hypothetical DNS provider API:
    /*
    const response = await fetch('https://api.dnsprovider.com/v1/txt-records', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DNS_PROVIDER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        domain: 'sandbox.openattestation.com',
        subdomain: subdomain,
        type: 'TXT',
        value: txtRecordValue
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create DNS record');
    }
    */

    return new Response(
      JSON.stringify({
        success: true,
        message: 'DNS TXT record created successfully',
        data: {
          subdomain: subdomain,
          txtRecord: txtRecordValue
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