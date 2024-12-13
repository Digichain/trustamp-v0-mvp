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

export const signAndStoreDocument = async (wrappedDocument: any, walletAddress: string, transactionId: string) => {
  try {
    console.log("Starting document signing process with wrapped document:", wrappedDocument);
    
    if (!window.ethereum) {
      throw new Error("No ethereum wallet found");
    }

    // Use the salted document ID from the wrapped document for signing
    const documentData = wrappedDocument.data;
    if (!documentData || !documentData.id) {
      console.error("Document data or salted ID is missing from wrapped document:", wrappedDocument);
      throw new Error("Document data is required for signing");
    }

    console.log("Using salted document ID for signing:", documentData.id);

    // Request wallet signature using ethers provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    console.log("Got signer from wallet:", await signer.getAddress());

    // Convert merkle root to proper bytes format
    // First ensure the merkle root is lowercase and has 0x prefix
    const merkleRoot = wrappedDocument.signature.merkleRoot.toLowerCase();
    const merkleRootWithPrefix = merkleRoot.startsWith('0x') ? merkleRoot : `0x${merkleRoot}`;
    console.log("Merkle root prepared for signing:", merkleRootWithPrefix);
    
    // Convert to bytes
    const messageToSign = ethers.getBytes(merkleRootWithPrefix);
    console.log("Message to sign (in bytes):", messageToSign);
    
    // Sign the message using personal_sign
    const signature = await signer.signMessage(messageToSign);
    console.log("Document signed with signature:", signature);

    // Create signed document with proper proof structure
    const signedDocument = {
      ...wrappedDocument,
      proof: [{
        type: ProofType.OpenAttestationSignature2018,
        created: new Date().toISOString(),
        proofPurpose: "assertionMethod",
        verificationMethod: `did:ethr:${walletAddress}#controller`,
        signature: signature
      }]
    };

    console.log("Final signed document:", signedDocument);

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