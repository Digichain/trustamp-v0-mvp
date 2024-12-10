import { Card } from "@/components/ui/card";

interface InvoicePreviewProps {
  data: any; // We'll type this properly when implementing OpenAttestation
}

export const InvoicePreview = ({ data }: InvoicePreviewProps) => {
  return (
    <Card className="p-6 space-y-6 bg-white">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">Invoice #{data.id}</h2>
        <p className="text-gray-600">{data.date}</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-2">Bill From</h3>
          <div className="space-y-1">
            <p>{data.billFrom.name}</p>
            <p>{data.billFrom.streetAddress}</p>
            <p>{data.billFrom.city}</p>
            <p>{data.billFrom.postalCode}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Bill To</h3>
          <div className="space-y-1">
            <p>{data.billTo.company.name}</p>
            <p>{data.billTo.company.streetAddress}</p>
            <p>{data.billTo.name}</p>
            <p>{data.billTo.email}</p>
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
            {data.billableItems.map((item: any, index: number) => (
              <tr key={index} className="border-b">
                <td className="py-2">{item.description}</td>
                <td className="text-right py-2">{item.quantity}</td>
                <td className="text-right py-2">${item.unitPrice}</td>
                <td className="text-right py-2">${item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-1/3 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${data.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax ({data.tax}%):</span>
            <span>${data.taxTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${data.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};