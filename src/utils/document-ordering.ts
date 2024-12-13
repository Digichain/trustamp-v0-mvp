import { utils } from "@govtechsg/open-attestation";

export const reorderDocumentData = (documentData: any) => {
  // Create a new object with the correct order
  const orderedData = {
    id: documentData.id,
    "$template": documentData.$template,
    issuers: documentData.issuers,
    recipient: documentData.recipient,
    invoiceDetails: documentData.invoiceDetails,
    network: documentData.network
  };

  return orderedData;
};

export const createOrderedDocument = (document: any) => {
  return {
    version: "https://schema.openattestation.com/2.0/schema.json" as const,
    data: reorderDocumentData(document.data),
    signature: document.signature,
    proof: document.proof || [] // Add proof property, default to empty array if not present
  };
};