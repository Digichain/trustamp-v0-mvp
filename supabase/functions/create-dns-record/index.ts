import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { did } = await req.json();
    console.log("Received DID:", did);

    if (!did) {
      throw new Error("DID is required");
    }

    // Extract Ethereum address from DID
    const addressMatch = did.match(/did:ethr:(0x[a-fA-F0-9]{40})/);
    if (!addressMatch) {
      throw new Error("Invalid DID format");
    }

    const address = addressMatch[1].toLowerCase();
    console.log("Extracted address:", address);

    // Create DNS record via OpenAttestation API
    const response = await fetch("https://dns-proof-sandbox.openattestation.com/api/records", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
      }),
    });

    // Clone the response before reading it
    const responseClone = response.clone();
    
    // First, check if the response is ok
    if (!response.ok) {
      const errorText = await responseClone.text();
      throw new Error(`DNS API error: ${errorText}`);
    }

    // Then parse the JSON from the original response
    const data = await response.json();
    console.log("DNS record created:", data);

    return new Response(
      JSON.stringify({
        data: {
          dnsLocation: data.location,
          record: data.record,
        },
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );

  } catch (error) {
    console.error("Error creating DNS record:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});