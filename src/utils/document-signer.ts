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

export const signAndStoreDocument = async (wrappedDocument: any, walletAddress: string) => {
  try {
    console.log("Starting document signing process with wrapped document:", wrappedDocument);
    
    if (!window.ethereum) {
      throw new Error("No ethereum wallet found");
    }

    // Check for document ID in the wrapped document
    const documentId = wrappedDocument.data?.id;
    if (!documentId) {
      console.error("Document ID is missing from wrapped document:", wrappedDocument);
      throw new Error("Document ID is required for signing");
    }

    console.log("Found document ID:", documentId);

    // Request wallet signature using ethers provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    console.log("Got signer from wallet:", await signer.getAddress());

    // Create signature using the document's merkle root
    const messageToSign = wrappedDocument.signature.merkleRoot;
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

    // Store signed document using the document ID
    const fileName = `${documentId}_signed.json`;
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