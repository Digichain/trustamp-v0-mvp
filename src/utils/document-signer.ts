import { supabase } from "@/integrations/supabase/client";
import { ethers } from 'ethers';

// Add type declaration for the ethereum property on window
declare global {
  interface Window {
    ethereum?: any;
  }
}

const signDocument = async (merkleRoot: string, walletAddress: string): Promise<string> => {
  try {
    if (!merkleRoot) {
      throw new Error("Merkle root is undefined or empty");
    }

    console.log("Preparing to sign merkle root:", merkleRoot);

    // Ensure merkleRoot has 0x prefix
    const prefixedMerkleRoot = merkleRoot.startsWith('0x') ? merkleRoot : `0x${merkleRoot}`;
    console.log("Prefixed merkle root:", prefixedMerkleRoot);

    // Convert to bytes using ethers v6 syntax
    const messageBytes = ethers.getBytes(prefixedMerkleRoot);
    console.log("Message bytes:", messageBytes);

    // Request signature from wallet
    if (!window.ethereum) {
      throw new Error("Ethereum provider not found");
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    // Sign the message bytes
    const signature = await signer.signMessage(messageBytes);
    console.log("Generated signature:", signature);

    return signature;
  } catch (error) {
    console.error("Error in signDocument:", error);
    throw error;
  }
};

export const signAndStoreDocument = async (
  wrappedDocument: any,
  walletAddress: string,
  transactionId: string
) => {
  try {
    console.log("Starting document signing process with wrapped document:", wrappedDocument);

    // Validate wrapped document structure
    if (!wrappedDocument.signature?.merkleRoot) {
      throw new Error("Invalid wrapped document: missing merkle root");
    }

    // Get signature for the merkle root
    const signature = await signDocument(wrappedDocument.signature.merkleRoot, walletAddress);

    // Create the proof object according to OpenAttestation format
    const proof = {
      type: "OpenAttestationSignature2018",
      created: new Date().toISOString(),
      proofPurpose: "assertionMethod",
      verificationMethod: `did:ethr:${walletAddress}#controller`,
      signature: signature
    };

    // Create the signed document with the proof in the correct structure
    const signedDocument = {
      version: wrappedDocument.version,
      data: wrappedDocument.data,
      signature: {
        ...wrappedDocument.signature,
        proof: [proof]
      }
    };

    console.log("Final signed document structure:", signedDocument);

    // Store the signed document
    const fileName = `${transactionId}_signed.json`;
    const { error: uploadError } = await supabase.storage
      .from('signed-documents')
      .upload(fileName, JSON.stringify(signedDocument, null, 2), {
        contentType: 'application/json',
        upsert: true
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('signed-documents')
      .getPublicUrl(fileName);

    return {
      signedDocument,
      publicUrl
    };
  } catch (error) {
    console.error("Error in signAndStoreDocument:", error);
    throw error;
  }
};