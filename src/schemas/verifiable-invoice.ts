export const verifiableInvoiceSchema = {
  version: "https://schema.openattestation.com/2.0/schema.json" as const,
  id: "",
  $template: {
    name: "INVOICE",
    type: "EMBEDDED_RENDERER",
    url: "https://generic-templates.openattestation.com"
  },
  issuers: [
    {
      id: "",
      name: "",
      revocation: {
        type: "NONE"
      },
      identityProof: {
        type: "DNS-DID",
        location: "tempdns.trustamp.in",
        key: ""
      }
    }
  ],
  recipient: {
    name: "",
    company: {
      name: "",
      streetAddress: "",
      city: "",
      postalCode: "",
      phoneNumber: ""
    }
  },
  network: {
    chain: "sepolia",
    chainId: "11155111"
  },
  invoiceDetails: {
    invoiceNumber: "",
    date: "",
    billFrom: {
      name: "",
      streetAddress: "",
      city: "",
      postalCode: "",
      phoneNumber: ""
    },
    billTo: {
      company: {
        name: "",
        streetAddress: "",
        city: "",
        postalCode: "",
        phoneNumber: ""
      },
      name: "",
      email: ""
    },
    billableItems: [
      {
        description: "",
        quantity: 0,
        unitPrice: 0,
        amount: 0
      }
    ],
    subtotal: 0,
    tax: 0,
    taxTotal: 0,
    total: 0
  }
};