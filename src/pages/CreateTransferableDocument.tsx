import { TransferableBillOfLadingForm } from "@/components/transactions/forms/TransferableBillOfLadingForm";

const CreateTransferableTransaction = () => {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Bill of Lading</h1>
        <TransferableBillOfLadingForm />
      </div>
    </div>
  );
};

export default CreateTransferableTransaction;