import { supabase } from "@/integrations/supabase/client";
import { wrapDocument } from "@govtechsg/open-attestation";

export const issueAndStoreDocument = async (
  document: any,
  walletAddress: string,
  transactionId: string
) => {
  console.log("Starting document issuance process with document:", document);
  console.log("Using wallet address:", walletAddress);

  try {
    // Use OpenAttestation's wrap function
    const wrappedDoc = wrapDocument(document);
    console.log("Document wrapped successfully:", wrappedDoc);

    // Store the wrapped document
    const wrappedFileName = `${transactionId}_wrapped.json`;
    const { error: uploadError } = await supabase.storage
      .from('wrapped-documents')
      .upload(wrappedFileName, JSON.stringify(wrappedDoc, null, 2), {
        contentType: 'application/json',
        upsert: true
      });

    if (uploadError) {
      console.error("Error uploading wrapped document:", uploadError);
      throw uploadError;
    }

    // Get the public URL for the wrapped document
    const { data: { publicUrl } } = supabase.storage
      .from('wrapped-documents')
      .getPublicUrl(wrappedFileName);

    console.log("Document issued and stored successfully");
    return {
      wrappedDocument: wrappedDoc,
      publicUrl
    };
  } catch (error) {
    console.error("Error in document issuance process:", error);
    throw error;
  }
};