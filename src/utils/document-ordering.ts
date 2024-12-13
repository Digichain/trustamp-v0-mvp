export const reorderDocumentData = (documentData: any) => {
  // Create a new object with the correct order based on schema
  const orderedData = {
    version: documentData.version,
    id: documentData.id,
    $template: documentData.$template,
    issuers: documentData.issuers,
    recipient: documentData.recipient,
    network: documentData.network,
    invoiceDetails: documentData.invoiceDetails
  };

  return orderedData;
};

export const createOrderedDocument = (document: any) => {
  return {
    version: "https://schema.openattestation.com/2.0/schema.json" as const,
    data: reorderDocumentData(document),
    signature: document.signature,
    proof: document.proof || [] // Add proof property, default to empty array if not present
  };
};