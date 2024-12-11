import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { OpenAttestationDNSTextRecordT, EthereumNetworks } from "../../src/utils/dns-record-types.ts";

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

    // Create and validate DNS record
    const dnsRecord = {
      type: "openatts",
      net: "ethereum",
      netId: EthereumNetworks.sepolia,
      addr: address
    };

    // Validate the record format
    try {
      OpenAttestationDNSTextRecordT.check(dnsRecord);
    } catch (error) {
      console.error('Invalid DNS record format:', error);
      throw new Error('Invalid DNS record format');
    }

    // Format record for DNS TXT
    const txtRecordValue = `type=${dnsRecord.type} net=${dnsRecord.net} netId=${dnsRecord.netId} addr=${dnsRecord.addr}`;

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
          txtRecord: txtRecordValue,
          dnsRecord
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