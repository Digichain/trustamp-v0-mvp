import { Card } from "@/components/ui/card";

interface InvoiceTemplateProps {
  document: any;
}

export const InvoiceTemplate = ({ document }: InvoiceTemplateProps) => {
  console.log("Rendering Invoice template with document:", document);
  
  // Helper function to get clean value from wrapped data
  const getCleanValue = (value: any) => {
    if (typeof value === 'string' && value.includes(':string:')) {
      return value.split(':string:')[1];
    }
    if (typeof value === 'string' && value.includes(':number:')) {
      return Number(value.split(':number:')[1]);
    }
    return value;
  };

  // Clean up the document data
  const invoiceDetails = {
    invoiceNumber: getCleanValue(document.invoiceDetails?.invoiceNumber),
    date: getCleanValue(document.invoiceDetails?.date),
    billFrom: {
      name: getCleanValue(document.invoiceDetails?.billFrom?.name),
      streetAddress: getCleanValue(document.invoiceDetails?.billFrom?.streetAddress),
      city: getCleanValue(document.invoiceDetails?.billFrom?.city),
      postalCode: getCleanValue(document.invoiceDetails?.billFrom?.postalCode),
      phoneNumber: getCleanValue(document.invoiceDetails?.billFrom?.phoneNumber)
    },
    billTo: {
      name: getCleanValue(document.invoiceDetails?.billTo?.name),
      email: getCleanValue(document.invoiceDetails?.billTo?.email),
      company: {
        name: getCleanValue(document.invoiceDetails?.billTo?.company?.name),
        streetAddress: getCleanValue(document.invoiceDetails?.billTo?.company?.streetAddress),
        city: getCleanValue(document.invoiceDetails?.billTo?.company?.city),
        postalCode: getCleanValue(document.invoiceDetails?.billTo?.company?.postalCode),
        phoneNumber: getCleanValue(document.invoiceDetails?.billTo?.company?.phoneNumber)
      }
    }
  };

  const billableItems = Array.isArray(document.billableItems) 
    ? document.billableItems.map((item: any) => ({
        description: getCleanValue(item.description),
        quantity: getCleanValue(item.quantity),
        unitPrice: getCleanValue(item.unitPrice),
        amount: getCleanValue(item.amount)
      }))
    : [];

  const subtotal = getCleanValue(document.subtotal);
  const tax = getCleanValue(document.tax);
  const taxTotal = getCleanValue(document.taxTotal);
  const total = getCleanValue(document.total);

  return (
    <Card className="p-6 space-y-6 bg-white print:shadow-none">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">Invoice #{invoiceDetails.invoiceNumber || 'N/A'}</h2>
        <p className="text-gray-600">{invoiceDetails.date || 'N/A'}</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-2">Bill From</h3>
          <div className="space-y-1">
            <p className="font-medium">{invoiceDetails.billFrom.name || 'N/A'}</p>
            <p>{invoiceDetails.billFrom.streetAddress || 'N/A'}</p>
            <p>{invoiceDetails.billFrom.city || 'N/A'}</p>
            <p>{invoiceDetails.billFrom.postalCode || 'N/A'}</p>
            <p>{invoiceDetails.billFrom.phoneNumber || 'N/A'}</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Bill To</h3>
          <div className="space-y-1">
            <p className="font-medium">{invoiceDetails.billTo.company.name || 'N/A'}</p>
            <p>{invoiceDetails.billTo.company.streetAddress || 'N/A'}</p>
            <p>{invoiceDetails.billTo.company.city || 'N/A'}</p>
            <p>{invoiceDetails.billTo.company.postalCode || 'N/A'}</p>
            <p>{invoiceDetails.billTo.company.phoneNumber || 'N/A'}</p>
            <div className="mt-4">
              <p className="font-medium">Contact Person</p>
              <p>{invoiceDetails.billTo.name || 'N/A'}</p>
              <p>{invoiceDetails.billTo.email || 'N/A'}</p>
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
                <td className="text-right py-2">${Number(item.unitPrice || 0).toFixed(2)}</td>
                <td className="text-right py-2">${Number(item.amount || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-1/3 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${Number(subtotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax ({Number(tax || 0)}%):</span>
            <span>${Number(taxTotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${Number(total || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};