import { DIDDocument } from "@/components/transactions/identity/DIDCreator";

export const formatInvoiceToOpenAttestation = (invoiceData: any, didDocument: DIDDocument | null) => {
  if (!didDocument) {
    throw new Error("DID document is required to create a verifiable document");
  }

  console.log("Formatting document with DID:", didDocument);

  // The base DID without #controller
  const baseId = `did:ethr:${didDocument.ethereumAddress}`;
  
  return {
    $template: {
      name: "INVOICE",
      type: "EMBEDDED_RENDERER",
      url: "https://generic-templates.openattestation.com"
    },
    issuers: [{
      id: baseId,
      name: invoiceData.billFrom.name,
      identityProof: {
        type: "DNS-DID",
        location: "tempdns.trustamp.in",
        key: `${baseId}#controller`
      }
    }],
    network: {
      chain: "sepolia",
      chainId: "11155111"
    },
    recipient: {
      name: invoiceData.billTo.name,
      company: invoiceData.billTo.company
    },
    invoiceDetails: {
      invoiceNumber: invoiceData.id,
      date: invoiceData.date,
      billFrom: invoiceData.billFrom,
      billTo: invoiceData.billTo,
      billableItems: invoiceData.billableItems,
      subtotal: invoiceData.subtotal,
      tax: invoiceData.tax,
      taxTotal: invoiceData.taxTotal,
      total: invoiceData.total
    }
  };
};