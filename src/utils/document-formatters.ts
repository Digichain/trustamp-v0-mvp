import { DIDDocument } from "@/components/transactions/identity/DIDCreator";

export const formatInvoiceToOpenAttestation = (invoiceData: any, didDocument: DIDDocument | null) => {
  if (!didDocument) {
    throw new Error("DID document is required to create a verifiable document");
  }

  // Extract the DNS record from the DID document
  // This would typically come from the DID creation process
  const dnsLocation = `${didDocument.id.split('#')[0].replace('did:ethr:', '')}.sandbox.openattestation.com`;

  return {
    $template: {
      name: "INVOICE",
      type: "EMBEDDED_RENDERER",
      url: "https://generic-templates.openattestation.com"
    },
    issuers: [{
      id: didDocument.id, // This will include the #controller suffix
      name: invoiceData.billFrom.name,
      identityProof: {
        type: "DNS-DID",
        location: dnsLocation,
        key: didDocument.id
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