import { supabase } from "@/integrations/supabase/client";

export const useDocumentStorage = () => {
  const storeWrappedDocument = async (transactionId: string, wrappedDocument: any) => {
    console.log("Storing wrapped document for transaction:", transactionId);
    console.log("Wrapped document content:", JSON.stringify(wrappedDocument, null, 2));
    
    const fileName = `${transactionId}_wrapped.json`;
    const documentContent = JSON.stringify(wrappedDocument, null, 2);
    
    const { error: uploadError } = await supabase.storage
      .from('wrapped-documents')
      .upload(fileName, documentContent, {
        contentType: 'application/json',
        upsert: true
      });

    if (uploadError) {
      console.error("Error uploading wrapped document:", uploadError);
      throw uploadError;
    }

    console.log("Wrapped document stored successfully");
  };

  const storeSignedDocument = async (transactionId: string, signedDocument: any) => {
    console.log("Storing signed document for transaction:", transactionId);
    
    const fileName = `${transactionId}_signed.json`;
    const documentContent = JSON.stringify(signedDocument, null, 2);
    
    const { error: uploadError } = await supabase.storage
      .from('signed-documents')
      .upload(fileName, documentContent, {
        contentType: 'application/json',
        upsert: true
      });

    if (uploadError) {
      console.error("Error uploading signed document:", uploadError);
      throw uploadError;
    }

    console.log("Signed document stored successfully");
  };

  return {
    storeWrappedDocument,
    storeSignedDocument
  };
};