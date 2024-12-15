// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const requestData = await req.json();
    console.log("Request data:", requestData);

    const { did, contractAddress, action, type } = requestData;
    
    if (action !== 'create') {
      throw new Error('Only create action is supported');
    }

    if (type === 'token-registry' && !contractAddress) {
      throw new Error('Contract address is required for token registry');
    } else if (!type && !did) {
      throw new Error('DID is required for DID records');
    }

    // For token registry, use contract address instead of DID
    const address = type === 'token-registry' ? contractAddress : did.match(/did:ethr:(0x[a-fA-F0-9]{40})/)?.[1];
    
    if (!address) {
      throw new Error('Invalid address format');
    }

    return new Response(
      JSON.stringify({
        data: {
          dnsLocation: 'tempdns.trustamp.in',
          status: 'simulated'
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