import { VerifiableInvoiceForm } from "@/components/transactions/forms/VerifiableInvoiceForm";
import { DIDCreator } from "@/components/transactions/identity/DIDCreator";

const CreateTransaction = () => {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Invoice</h1>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold mb-4">Document Identity</h2>
            <DIDCreator />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>
            <VerifiableInvoiceForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTransaction;