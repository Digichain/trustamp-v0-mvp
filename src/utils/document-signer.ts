import { signOA } from '@trustvc/trustvc';
import { ethers } from 'ethers';
import { supabase } from '@/integrations/supabase/client';

export enum SUPPORTED_SIGNING_ALGORITHM {
  Secp256k1VerificationKey2018 = 'Secp256k1VerificationKey2018'
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const signAndStoreDocument = async (wrappedDocument: any, walletAddress: string) => {
  try {
    console.log("Starting document signing process");
    
    if (!window.ethereum) {
      throw new Error("No ethereum wallet found");
    }

    // Request wallet signature using ethers provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    
    console.log("Got signer from wallet:", await signer.getAddress());
    
    // Create a compatible signer object
    const compatibleSigner = {
      _isSigner: true,
      getAddress: async () => signer.address,
      signMessage: async (message: string) => signer.signMessage(message),
      getBalance: async () => signer.getBalance(),
      getChainId: async () => signer.getChainId(),
      getGasPrice: async () => signer.getGasPrice(),
      getTransactionCount: async () => signer.getTransactionCount(),
      estimateGas: async (tx: any) => signer.estimateGas(tx),
      call: async (tx: any) => signer.call(tx),
      resolveName: async (name: string) => signer.resolveName(name)
    };
    
    // Sign the document using the connected wallet
    console.log("Signing document with wallet:", walletAddress);
    const signedDocument = await signOA(wrappedDocument, compatibleSigner);
    
    console.log("Document signed successfully");

    // Create filename for signed document
    const fileName = `${wrappedDocument.transactionId}_signed.json`;
    console.log("Creating signed document with filename:", fileName);

    // Upload signed document to storage
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

    // Get public URL for the signed document
    const { data: { publicUrl } } = supabase.storage
      .from('signed-documents')
      .getPublicUrl(fileName);

    console.log("Document signed and stored successfully at:", publicUrl);
    return { signedDocument, publicUrl };
  } catch (error) {
    console.error("Error in signAndStoreDocument:", error);
    throw error;
  }
};