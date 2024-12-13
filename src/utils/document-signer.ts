import { supabase } from "@/integrations/supabase/client";
import { ethers } from "ethers";

enum ProofType {
  OpenAttestationSignature2018 = 'OpenAttestationSignature2018'
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

const toBytes = (hex: string): Uint8Array => {
  return ethers.utils.arrayify(hex);
};

export const signAndStoreDocument = async (wrappedDocument: any, walletAddress: string, transactionId: string) => {
  try {
    console.log("Starting document signing process with wrapped document:", wrappedDocument);

    if (!window.ethereum) {
      throw new Error("No ethereum wallet found");
    }

    // Validate wrapped document structure
    if (!wrappedDocument.signature?.merkleRoot || !wrappedDocument.signature?.targetHash) {
      console.error("Invalid wrapped document structure:", wrappedDocument);
      throw new Error("Document missing required signature properties");
    }

    // Request wallet signature using ethers provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    console.log("Got signer from wallet:", await signer.getAddress());

    // Convert merkle root to proper bytes format
    const merkleRootHex = wrappedDocument.signature.merkleRoot.toLowerCase();
    const merkleRootWithPrefix = merkleRootHex.startsWith('0x') ? merkleRootHex : `0x${merkleRootHex}`;
    const merkleRootBytes = toBytes(merkleRootWithPrefix);
    console.log("Merkle root prepared for signing:", merkleRootBytes);

    // Convert to bytes and sign
    const messageToSign = merkleRootBytes;
    console.log("Message to sign (in bytes):", messageToSign);

    // Sign the message
    const signature = await signer.signMessage(messageToSign);
    console.log("Document signed with signature:", signature);

    // Create signed document with OpenAttestation V2 structure
    const signedDocument = {
      version: wrappedDocument.version,
      data: wrappedDocument.data,
      signature: {
        ...wrappedDocument.signature,
        proof: [{
          type: ProofType.OpenAttestationSignature2018,
          created: new Date().toISOString(),
          proofPurpose: "assertionMethod",
          verificationMethod: `did:ethr:${walletAddress}#controller`,
          signature: signature
        }]
      }
    };

    console.log("Final signed document structure:", signedDocument);

    // Store signed document using transaction ID
    const fileName = `${transactionId}_signed.json`;
    console.log("Storing signed document with filename:", fileName);

    const { error: uploadError } = await supabase.storage
      .from('signed-documents')
      .upload(fileName, JSON.stringify(signedDocument, null, 2), {
        contentType: 'application/json',
        upsert: true
      });

    if (uploadError) {
      console.error("Error uploading signed document:", uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('signed-documents')
      .getPublicUrl(fileName);

    console.log("Document signed and stored successfully at:", publicUrl);

    return {
      signedDocument,
      publicUrl
    };

  } catch (error: any) {
    console.error("Error in signAndStoreDocument:", error);
    throw error;
  }
};
