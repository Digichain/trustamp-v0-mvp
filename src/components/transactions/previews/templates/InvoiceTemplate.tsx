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
    
    // If it's an array, unwrap each item
    if (Array.isArray(value)) {
      return value.map(item => unwrapValue(item));
    }
    
    // For objects, first check if it's a wrapped value
    const wrappedKey = Object.keys(value).find(k => 
      k.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}:(string|number)$/)
    );
    
    if (wrappedKey) {
      console.log("Found wrapped value with key:", wrappedKey);
      const [, type] = wrappedKey.split(':');
      const rawValue = value[wrappedKey];
      return type === 'number' ? Number(rawValue) : rawValue;
    }
    
    // If it's an object but not wrapped, process each property
    const unwrappedObj = {};
    Object.entries(value).forEach(([key, val]) => {
      unwrappedObj[key] = unwrapValue(val);
    });
    return unwrappedObj;
  };

  const renderKeyValue = (obj: any, excludeKeys: string[] = []) => {
    return Object.entries(unwrapValue(obj))
      .filter(([key]) => !excludeKeys.includes(key) && obj[key])
      .map(([key, value]) => {
        console.log("Rendering key-value:", { key, value });
        return (
          <p key={key} className="text-sm">
            <span className="font-medium text-gray-600">{formatLabel(key)}:</span>{' '}
            <span>{String(value)}</span>
          </p>
        );
      });
  };

  // Unwrap all document data
  const unwrappedDoc = unwrapValue(document);
  console.log("Unwrapped document:", unwrappedDoc);

  return (
    <Card className="p-6 space-y-6 bg-white print:shadow-none">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold">Invoice #{unwrappedDoc.invoiceDetails?.invoiceNumber || 'N/A'}</h2>
        <p className="text-gray-600">{unwrappedDoc.invoiceDetails?.date || 'N/A'}</p>
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
            {unwrappedDoc.billableItems?.map((item: any, index: number) => (
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
            <span>${Number(unwrappedDoc.subtotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax ({Number(unwrappedDoc.tax || 0)}%):</span>
            <span>${Number(unwrappedDoc.taxTotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${Number(unwrappedDoc.total || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};