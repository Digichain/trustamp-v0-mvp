import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SignatureV4 } from "https://deno.land/x/aws_sign_v4@1.0.2/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

const AWS_REGION = Deno.env.get('AWS_REGION') || 'us-east-1';
const HOSTED_ZONE_ID = Deno.env.get('AWS_ROUTE53_HOSTED_ZONE_ID');
const AWS_ACCESS_KEY_ID = Deno.env.get('AWS_ACCESS_KEY_ID');
const AWS_SECRET_ACCESS_KEY = Deno.env.get('AWS_SECRET_ACCESS_KEY');

console.log("Loading manage-dns-records function...");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { did, action } = await req.json();
    console.log(`Received request with DID: ${did}, action: ${action}`);

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

    // Format DNS record value according to OpenAttestation requirements
    const recordValue = `"type=openatts net=ethereum netId=1 addr=${address}"`;
    const dnsName = `${address.slice(2).toLowerCase()}.sandbox.openattestation.com`; // Using sandbox domain

    // Create AWS Route 53 request
    const signer = new SignatureV4({
      service: "route53",
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID!,
        secretAccessKey: AWS_SECRET_ACCESS_KEY!,
      },
    });

    const changeRecordRequest = {
      ChangeBatch: {
        Changes: [
          {
            Action: action === 'delete' ? 'DELETE' : 'UPSERT',
            ResourceRecordSet: {
              Name: dnsName,
              Type: 'TXT',
              TTL: 300,
              ResourceRecords: [{ Value: recordValue }],
            },
          },
        ],
      },
    };

    const endpoint = `https://route53.amazonaws.com/2013-04-01/hostedzone/${HOSTED_ZONE_ID}/rrset`;
    
    const signedRequest = await signer.sign({
      method: 'POST',
      url: endpoint,
      body: JSON.stringify(changeRecordRequest),
      headers: {
        'Content-Type': 'application/json',
        'Host': 'route53.amazonaws.com',
      },
    });

    console.log("Making request to AWS Route 53");
    const response = await fetch(endpoint, signedRequest);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("AWS Route 53 API Error:", errorText);
      throw new Error(`AWS Route 53 API error: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log("AWS Route 53 Response:", result);

    return new Response(
      JSON.stringify({
        data: {
          dnsLocation: dnsName,
          changeInfo: result.ChangeInfo,
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
    console.error("Error in manage-dns-records:", error);
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