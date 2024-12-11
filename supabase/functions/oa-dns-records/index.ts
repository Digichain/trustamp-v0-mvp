// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

const generateDNSName = () => {
  const adjectives = ['happy', 'clever', 'brave', 'wise', 'gentle'];
  const colors = ['red', 'blue', 'green', 'purple', 'gold'];
  const animals = ['lion', 'tiger', 'eagle', 'wolf', 'bear'];
  
  const randomElement = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
  
  return `${randomElement(adjectives)}-${randomElement(colors)}-${randomElement(animals)}.sandbox.openattestation.com`;
};

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const requestData = await req.json();
    console.log("Request data:", requestData);

    const { did } = requestData;
    if (!did) {
      throw new Error('DID is required');
    }

    const addressMatch = did.match(/did:ethr:(0x[a-fA-F0-9]{40})/);
    if (!addressMatch) {
      throw new Error('Invalid DID format');
    }

    const dnsLocation = generateDNSName();
    console.log("Generated DNS location:", dnsLocation);

    return new Response(
      JSON.stringify({
        data: {
          dnsLocation,
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