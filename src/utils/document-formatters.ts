export const generateDocumentId = () => {
  // Generate 4 random uppercase letters
  const letters = Array.from({ length: 4 }, () => 
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('');
  
  // Generate 4 random numbers
  const numbers = Array.from({ length: 4 }, () => 
    Math.floor(Math.random() * 10)
  ).join('');
  
  return `${letters}${numbers}`;
};

export const formatInvoiceToOpenAttestation = (invoiceData: any, didDocument: any) => {
  if (!didDocument) {
    throw new Error("DID document is required to create a verifiable document");
  }

  console.log("Starting document formatting with invoice data:", invoiceData);
  console.log("Using DID document:", didDocument);

  // The base DID without #controller
  const baseId = `did:ethr:${didDocument.ethereumAddress}`;
  
  // Generate document ID in the format (4 letters + 4 numbers)
  const documentId = generateDocumentId();
  console.log("Generated document ID:", documentId);

  // Create document with explicit ordering based on schema
  const formattedDoc = {
    version: "https://schema.openattestation.com/2.0/schema.json" as const,
    id: documentId,
    $template: {
      name: "INVOICE",
      type: "EMBEDDED_RENDERER",
      url: "https://generic-templates.openattestation.com"
    },
    issuers: [{
      id: baseId,
      name: invoiceData.billFrom.name,
      revocation: {
        type: "NONE"
      },
      identityProof: {
        type: "DNS-DID",
        location: "tempdns.trustamp.in",
        key: `${baseId}#controller`
      }
    }],
    recipient: {
      name: invoiceData.billTo.name,
      company: invoiceData.billTo.company
    },
    network: {
      chain: "sepolia",
      chainId: "11155111"
    },
    invoiceDetails: {
      invoiceNumber: invoiceData.id,
      date: invoiceData.date,
      billFrom: invoiceData.billFrom,
      billTo: invoiceData.billTo,
      billableItems: invoiceData.billableItems,
      subtotal: Number(invoiceData.subtotal),
      tax: Number(invoiceData.tax),
      taxTotal: Number(invoiceData.taxTotal),
      total: Number(invoiceData.total)
    }
  };

  console.log("FORMATTED DOCUMENT STRUCTURE:", JSON.stringify(formattedDoc, null, 2));
  console.log("FORMATTED DOCUMENT KEYS ORDER:", Object.keys(formattedDoc));
  
  return formattedDoc;
};