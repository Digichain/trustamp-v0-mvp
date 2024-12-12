import { DIDDocument } from "@/components/transactions/identity/DIDCreator";

export const formatInvoiceToOpenAttestation = (invoiceData: any, didDocument: DIDDocument | null) => {
  if (!didDocument) {
    throw new Error("DID document is required to create a verifiable document");
  }

  console.log("Verifying document:", invoiceData);
  
  // Return the document as-is without any modifications
  return invoiceData;
};