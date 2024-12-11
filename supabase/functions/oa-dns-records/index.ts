import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { exec } from "https://deno.land/x/exec/mod.ts";

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
        headers: {
          ...corsHeaders,
          'Access-Control-Max-Age': '86400',
        } 
      });
    }

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

    // Use OpenAttestation CLI to manage DNS records
    const command = action === 'delete' 
      ? `open-attestation dns txt-record remove ${address}`
      : `open-attestation dns txt-record create ${address}`;

    console.log("Executing command:", command);
    
    const { output } = await exec(command);
    console.log("CLI output:", output);

    const dnsName = `${address.slice(2).toLowerCase()}.openattestation.com`;

    return new Response(
      JSON.stringify({
        data: {
          dnsLocation: dnsName,
          cliOutput: output
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