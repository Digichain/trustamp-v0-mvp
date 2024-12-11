import { signOA } from '@trustvc/trustvc';
import { Wallet } from 'ethers';
import { supabase } from '@/integrations/supabase/client';

export enum SUPPORTED_SIGNING_ALGORITHM {
  Secp256k1VerificationKey2018 = 'Secp256k1VerificationKey2018'
}

export const signAndStoreDocument = async (wrappedDocument: any, walletAddress: string) => {
  try {
    console.log("Starting document signing process");
    
    // Create a wallet instance from the connected wallet
    const wallet = new Wallet(walletAddress);
    
    // Sign the document
    console.log("Signing document with wallet:", walletAddress);
    const signedDocument = await signOA(
      wrappedDocument,
      SUPPORTED_SIGNING_ALGORITHM.Secp256k1VerificationKey2018,
      wallet
    );
    
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