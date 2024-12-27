import { Card } from "@/components/ui/card";

interface InvoiceTemplateProps {
  document: any;
}

export const InvoiceTemplate = ({ document }: InvoiceTemplateProps) => {
  console.log("Rendering Invoice template with document:", document);
  
  // Get the unwrapped data
  const invoiceDetails = document?.invoiceDetails || {};
  const billFrom = invoiceDetails?.billFrom || {};
  const billTo = invoiceDetails?.billTo || {};
  const company = billTo?.company || {};
  const billableItems = document?.billableItems || [];
  
  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  const unwrapValue = (value: any): any => {
    // If value is not an object or is null/undefined, return as is
    if (!value || typeof value !== 'object') return value;
    
    // Check if it's an OpenAttestation wrapped value
    const key = Object.keys(value).find(k => k.includes(':'));
    if (key) {
      console.log("Unwrapping value:", { value, key });
      return value[key];
    }
    
    // If it's an object but not wrapped, return as is
    return value;
  };

  const renderKeyValue = (obj: any, excludeKeys: string[] = []) => {
    return Object.entries(obj)
      .filter(([key]) => !excludeKeys.includes(key) && obj[key])
      .map(([key, value]) => {
        const cleanValue = unwrapValue(value);
        console.log("Rendering key-value:", { key, value, cleanValue });
        
        return (
          <p key={key} className="text-sm">
            <span className="font-medium text-gray-600">{formatLabel(key)}:</span>{' '}
            <span>{String(cleanValue)}</span>
          </p>
        );
      });
  };

  return (
    <Card className="p-6 space-y-6 bg-white print:shadow-none">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">Invoice #{unwrapValue(invoiceDetails.invoiceNumber) || 'N/A'}</h2>
        <p className="text-gray-600">{unwrapValue(invoiceDetails.date) || 'N/A'}</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-semibold mb-2">Bill From</h3>
          <div className="space-y-1">
            {renderKeyValue(billFrom)}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Bill To</h3>
          <div className="space-y-1">
            <div className="mb-4">
              <p className="font-medium mb-1">Company Details</p>
              {renderKeyValue(company)}
            </div>
            <div>
              <p className="font-medium mb-1">Contact Person</p>
              {renderKeyValue(billTo, ['company'])}
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
                <td className="py-2">{unwrapValue(item.description) || 'N/A'}</td>
                <td className="text-right py-2">{unwrapValue(item.quantity) || 0}</td>
                <td className="text-right py-2">${Number(unwrapValue(item.unitPrice) || 0).toFixed(2)}</td>
                <td className="text-right py-2">${Number(unwrapValue(item.amount) || 0).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-1/3 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${Number(unwrapValue(document.subtotal) || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax ({Number(unwrapValue(document.tax) || 0)}%):</span>
            <span>${Number(unwrapValue(document.taxTotal) || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${Number(unwrapValue(document.total) || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};