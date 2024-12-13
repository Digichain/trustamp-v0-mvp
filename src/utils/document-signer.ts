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

interface DocumentSignature {
  type: string;
  targetHash: string;
  proof: any[];
  merkleRoot: string;
}

interface WrappedDocument {
  version: string;
  data: any;
  signature: DocumentSignature;
  proof?: any[];
}

interface Proof {
  type: ProofType;
  created: string;
  proofPurpose: string;
  verificationMethod: string;
  signature: string;
}

export const signAndStoreDocument = async (wrappedDocument: WrappedDocument, walletAddress: string, transactionId: string) => {
  try {
    console.log("Starting document signing process with wrapped document:", wrappedDocument);

    if (typeof window === "undefined" || !window.ethereum) {
      throw new Error("No Ethereum wallet found or environment is not suitable.");
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
    const merkleRoot = wrappedDocument.signature.merkleRoot.toLowerCase();
    const merkleRootWithPrefix = merkleRoot.startsWith('0x') ? merkleRoot : `0x${merkleRoot}`;
    console.log("Merkle root prepared for signing:", merkleRootWithPrefix);

    // Convert to bytes and sign
    const messageToSign = ethers.utils.arrayify(merkleRootWithPrefix);
    console.log("Message to sign (in bytes):", messageToSign);

    // Sign the message
    const signature = await signer.signMessage(messageToSign);
    console.log("Document signed with signature:", signature);

    // Create the proof separately, outside the signature object
    const proof: Proof[] = [{
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
      console.error("Error uploading signed document:", uploadError.message);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('signed-documents')
      .getPublicUrl(fileName);

    console.log("Document signed and stored successfully at:", publicUrl);

    return {
      signedDocument,
      publicUrl,
      success: true, // Confirmation flag or additional info
    };

  } catch (error: any) {
    console.error("Error in signAndStoreDocument:", error);
    throw error;
  }
};
