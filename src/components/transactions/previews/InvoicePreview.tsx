import { Card } from "@/components/ui/card";

interface InvoicePreviewProps {
  data: any; // We'll type this properly when implementing OpenAttestation
}

export const InvoicePreview = ({ data }: InvoicePreviewProps) => {
  console.log("Preview data received:", data); // Debug log
  
  // Add null checks with default empty objects
  const billFrom = data?.billFrom || {};
  const billTo = data?.billTo || {};
  const company = billTo?.company || {};
  const billableItems = data?.billableItems || [];

  return (
    <Card className="p-6 space-y-6 bg-white">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">Invoice #{data?.id || 'N/A'}</h2>
        <p className="text-gray-600">{data?.date || 'N/A'}</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-2">Bill From</h3>
          <div className="space-y-1">
            <p className="font-medium">{billFrom.name || 'N/A'}</p>
            <p>{billFrom.streetAddress || 'N/A'}</p>
            <p>{billFrom.city || 'N/A'}</p>
            <p>{billFrom.postalCode || 'N/A'}</p>
            <p>{billFrom.phoneNumber || 'N/A'}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Bill To</h3>
          <div className="space-y-1">
            <p className="font-medium">{company.name || 'N/A'}</p>
            <p>{company.streetAddress || 'N/A'}</p>
            <p>{company.city || 'N/A'}</p>
            <p>{company.postalCode || 'N/A'}</p>
            <p>{company.phoneNumber || 'N/A'}</p>
            <div className="mt-4">
              <p className="font-medium">Contact Person</p>
              <p>{billTo.name || 'N/A'}</p>
              <p>{billTo.email || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Items</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Description</th>
              <th className="text-right py-2">Quantity</th>
              <th className="text-right py-2">Unit Price</th>
              <th className="text-right py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {billableItems.map((item: any, index: number) => (
              <tr key={index} className="border-b">
                <td className="py-2">{item.description || 'N/A'}</td>
                <td className="text-right py-2">{item.quantity || 0}</td>
                <td className="text-right py-2">${item.unitPrice || 0}</td>
                <td className="text-right py-2">${item.amount || 0}</td>
              </tr>
            ))}
            {billableItems.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-1/3 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${(data?.subtotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax ({data?.tax || 0}%):</span>
            <span>${(data?.taxTotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${(data?.total || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};