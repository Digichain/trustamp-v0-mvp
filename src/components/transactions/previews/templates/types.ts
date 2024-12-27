import { v2 } from "@govtechsg/open-attestation";

// Base interface for wrapped documents
export interface WrappedDocument extends v2.OpenAttestationDocument {
  data: any;
}

// Invoice specific interfaces
export interface BillFromAddress {
  name: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
}

export interface CompanyDetails {
  name: string;
  streetAddress: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
}

export interface BillToContact {
  company: CompanyDetails;
  name: string;
  email: string;
}

export interface BillableItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface InvoiceDetails {
  invoiceNumber: string;
  date: string;
  billFrom: BillFromAddress;
  billTo: BillToContact;
}

export interface WrappedInvoice extends WrappedDocument {
  data: {
    invoiceDetails: InvoiceDetails;
    billableItems: BillableItem[];
    subtotal: number;
    tax: number;
    taxTotal: number;
    total: number;
  };
}

// Bill of Lading specific interfaces
export interface Party {
  name: string;
  address: string;
}

export interface Package {
  description: string;
  weight: string;
  measurement: string;
}

export interface BillOfLadingDetails {
  scac: string;
  blNumber: string;
  vessel: string;
  voyageNo: string;
  carrierName: string;
  portOfLoading: string;
  portOfDischarge: string;
  placeOfReceipt: string;
  placeOfDelivery: string;
  shipper: Party;
  consignee: Party;
  notifyParty: Party;
  packages: Package[];
}

export interface WrappedBillOfLading extends WrappedDocument {
  data: {
    billOfLadingDetails: BillOfLadingDetails;
  };
}