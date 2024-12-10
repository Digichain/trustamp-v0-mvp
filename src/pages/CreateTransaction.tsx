import { VerifiableInvoiceForm } from "@/components/transactions/forms/VerifiableInvoiceForm";

const CreateTransaction = () => {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Invoice</h1>
        <VerifiableInvoiceForm />
      </div>
    </div>
  );
};

export default CreateTransaction;