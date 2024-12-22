export const generateDocumentId = () => {
  const letters = Array.from({ length: 4 }, () => 
    String.fromCharCode(65 + Math.floor(Math.random() * 26))
  ).join('');
  
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

  // Ensure billFrom exists and has required properties
  const billFrom = invoiceData.invoiceDetails?.billFrom || {};
  const billTo = invoiceData.invoiceDetails?.billTo || {};
  const company = billTo.company || {};

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
      name: billFrom.name || "",
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
      name: billTo.name || "",
      company: {
        name: company.name || "",
        streetAddress: company.streetAddress || "",
        city: company.city || "",
        postalCode: company.postalCode || "",
        phoneNumber: company.phoneNumber || ""
      }
    },
    network: {
      chain: "sepolia",
      chainId: "11155111"
    },
    invoiceDetails: {
      invoiceNumber: invoiceData.invoiceDetails?.invoiceNumber || "",
      date: invoiceData.invoiceDetails?.date || "",
      billFrom: {
        name: billFrom.name || "",
        streetAddress: billFrom.streetAddress || "",
        city: billFrom.city || "",
        postalCode: billFrom.postalCode || "",
        phoneNumber: billFrom.phoneNumber || ""
      },
      billTo: {
        company: {
          name: company.name || "",
          streetAddress: company.streetAddress || "",
          city: company.city || "",
          postalCode: company.postalCode || "",
          phoneNumber: company.phoneNumber || ""
        },
        name: billTo.name || "",
        email: billTo.email || ""
      }
    },
    billableItems: invoiceData.billableItems || [],
    subtotal: Number(invoiceData.subtotal) || 0,
    tax: Number(invoiceData.tax) || 0,
    taxTotal: Number(invoiceData.taxTotal) || 0,
    total: Number(invoiceData.total) || 0
  };

  console.log("FORMATTED DOCUMENT STRUCTURE:", JSON.stringify(formattedDoc, null, 2));
  console.log("FORMATTED DOCUMENT KEYS ORDER:", Object.keys(formattedDoc));
  
  return formattedDoc;
};

export const formatBillOfLadingToOpenAttestation = (bolData: any, registryDocument: any) => {
  if (!registryDocument) {
    throw new Error("Token Registry document is required to create a transferable document");
  }

  console.log("Starting BOL document formatting with data:", bolData);
  console.log("Using Registry document:", registryDocument);

  const documentId = generateDocumentId();
  console.log("Generated document ID:", documentId);

  // Create document with explicit ordering based on schema
  const formattedDoc = {
    version: "https://schema.openattestation.com/2.0/schema.json" as const,
    id: documentId,
    $template: {
      name: "BILL_OF_LADING",
      type: "EMBEDDED_RENDERER",
      url: "https://generic-templates.openattestation.com"
    },
    issuers: [{
      name: bolData.carrierName || "",
      tokenRegistry: registryDocument.contractAddress,
      documentStore: registryDocument.documentStoreAddress, // Add document store address here
      identityProof: {
        type: "DNS-TXT",
        location: "tempdns.trustamp.in"
      }
    }],
    network: {
      chain: "sepolia",
      chainId: "11155111"
    },
    billOfLadingDetails: {
      scac: bolData.scac || "",
      blNumber: bolData.blNumber || "",
      vessel: bolData.vessel || "",
      voyageNo: bolData.voyageNo || "",
      portOfLoading: bolData.portOfLoading || "",
      portOfDischarge: bolData.portOfDischarge || "",
      carrierName: bolData.carrierName || "",
      packages: bolData.packages || [],
      shipper: bolData.shipper || { name: "", address: "" },
      consignee: bolData.consignee || { name: "", address: "" },
      notifyParty: bolData.notifyParty || { name: "", address: "" },
      placeOfReceipt: bolData.placeOfReceipt || "",
      placeOfDelivery: bolData.placeOfDelivery || ""
    }
  };

  console.log("FORMATTED BOL DOCUMENT STRUCTURE:", JSON.stringify(formattedDoc, null, 2));
  console.log("FORMATTED BOL DOCUMENT KEYS ORDER:", Object.keys(formattedDoc));
  
  return formattedDoc;
};