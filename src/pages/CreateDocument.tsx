import { useState } from "react";
import { VerifiableInvoiceForm } from "@/components/transactions/forms/VerifiableInvoiceForm";
import { DIDCreator, DIDDocument } from "@/components/transactions/identity/DIDCreator";

const CreateTransaction = () => {
  const [didDocument, setDidDocument] = useState<DIDDocument | null>(null);

  const handleDIDCreated = (doc: DIDDocument) => {
    console.log("CreateTransaction - DID Document created:", doc);
    setDidDocument(doc);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Invoice</h1>
        
        <div className="grid gap-8 md:grid-cols-1">
          <VerifiableInvoiceForm />
        </div>
      </div>
    </div>
  );
};

export default CreateTransaction;