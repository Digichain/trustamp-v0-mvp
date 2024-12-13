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
    let merkleRoot = wrappedDocument.signature.merkleRoot.toLowerCase();
    if (!merkleRoot.startsWith('0x')) {
      merkleRoot = `0x${merkleRoot}`; // Ensure it's a valid hex format with '0x' prefix
    }

    console.log("Merkle root prepared for signing:", merkleRoot);
    
    // Ensure merkleRoot is a valid hex string
    if (!ethers.utils.isHexString(merkleRoot)) {
      throw new Error(`Invalid merkleRoot format: ${merkleRoot}`);
    }

    // Convert to bytes and sign
    const messageToSign = ethers.utils.arrayify(merkleRoot);  // Use arrayify to ensure it's in proper bytes format
    console.log("Message to sign (in bytes):", messageToSign);
    
    // Sign the message
    const signature = await signer.signMessage(messageToSign);
    console.log("Document signed with signature:", signature);

    // Create the proof separately, outside the signature object
    const proof = [{
      type: ProofType.OpenAttestationSignature2018,
      created: new Date().toISOString(),
      proofPurpose: "assertionMethod",
      verificationMethod: `did:ethr:${walletAddress}#controller`,
      signature: signature
    }];

    // Prepare the signed document with signature (no proof in signature)
    const signedDocument = {
      version: wrappedDocument.version,
      data: wrappedDocument.data,
      signature: {
        type: "SHA3MerkleProof",
        targetHash: wrappedDocument.signature.targetHash,
        proof: [], // No proof here, as it will be placed separately
        merkleRoot: wrappedDocument.signature.merkleRoot
      },
      proof: proof // Add proof separately
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
