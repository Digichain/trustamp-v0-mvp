import CryptoJS from 'crypto-js';
import { ethers } from 'ethers';

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

    // Log the merkleRoot to ensure it's not undefined
    console.log("Merkle Root:", wrappedDocument.signature.merkleRoot);

    // Request wallet signature using ethers provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    console.log("Got signer from wallet:", await signer.getAddress());

    let merkleRoot = wrappedDocument.signature.merkleRoot?.toLowerCase();
    
    // Log the prepared merkleRoot
    console.log("Prepared Merkle Root:", merkleRoot);

    if (!merkleRoot) {
      throw new Error("Merkle Root is undefined or null");
    }

    // Ensure it's in a valid hex format
    if (!merkleRoot.startsWith('0x')) {
      merkleRoot = `0x${merkleRoot}`; // Add '0x' prefix if it's missing
    }

    console.log("Final Merkle Root before arrayify:", merkleRoot);

    // Check if the merkleRoot is a valid hex string
    if (!ethers.utils.isHexString(merkleRoot)) {
      throw new Error(`Invalid merkleRoot format: ${merkleRoot}`);
    }

    // Convert to bytes and sign
    try {
      const messageToSign = ethers.utils.arrayify(merkleRoot);  // Convert to bytes format
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
    } catch (signingError) {
      console.error("Error signing document:", signingError);
      throw signingError;
    }

  } catch (error: any) {
    console.error("Error in signAndStoreDocument:", error);
    throw error;
  }
};
