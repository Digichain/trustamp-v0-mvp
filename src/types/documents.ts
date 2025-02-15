export interface Document {
  id: string;
  user_id: string;
  transaction_hash: string | null;
  network: string;
  status: string;
  transaction_type: string;
  document_subtype: string | null;
  title: string | null;
  created_at: string;
  raw_document: any | null;
  wrapped_document: any | null;
  signed_document: any | null;
}

export enum DocumentType {
  VERIFIABLE_INVOICE = "VERIFIABLE_INVOICE",
  TRANSFERABLE_BILL_OF_LADING = "TRANSFERABLE_BILL_OF_LADING"
}