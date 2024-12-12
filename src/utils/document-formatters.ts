import { DIDDocument } from "@/components/transactions/identity/DIDCreator";

export const formatInvoiceToOpenAttestation = (invoiceData: any, didDocument: DIDDocument | null) => {
  if (!didDocument) {
    throw new Error("DID document is required to create a verifiable document");
  }

  console.log("Formatting document with DID:", didDocument);

  // The base DID without #controller
  const baseId = `did:ethr:${didDocument.ethereumAddress}`;
  
  // Create a clean object without prototypes
  const cleanInvoiceData = {
    billFrom: JSON.parse(JSON.stringify(invoiceData.billFrom)),
    billTo: JSON.parse(JSON.stringify(invoiceData.billTo)),
    billableItems: JSON.parse(JSON.stringify(invoiceData.billableItems)),
    subtotal: Number(invoiceData.subtotal),
    tax: Number(invoiceData.tax),
    taxTotal: Number(invoiceData.taxTotal),
    total: Number(invoiceData.total),
    id: invoiceData.id,
    date: invoiceData.date
  };

  console.log("Clean invoice data:", cleanInvoiceData);
  
  return {
    version: "https://schema.openattestation.com/2.0/schema.json",
    $template: {
      name: "INVOICE",
      type: "EMBEDDED_RENDERER",
      url: "https://generic-templates.openattestation.com"
    },
    issuers: [{
      id: baseId,
      name: cleanInvoiceData.billFrom.name,
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
      name: cleanInvoiceData.billTo.name,
      company: cleanInvoiceData.billTo.company
    },
    invoiceDetails: {
      invoiceNumber: cleanInvoiceData.id,
      date: cleanInvoiceData.date,
      billFrom: cleanInvoiceData.billFrom,
      billTo: cleanInvoiceData.billTo,
      billableItems: cleanInvoiceData.billableItems,
      subtotal: cleanInvoiceData.subtotal,
      tax: cleanInvoiceData.tax,
      taxTotal: cleanInvoiceData.taxTotal,
      total: cleanInvoiceData.total
    }
  };
};