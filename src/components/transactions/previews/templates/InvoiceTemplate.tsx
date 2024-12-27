import { Card } from "@/components/ui/card";
import { WrappedInvoice } from "./types";

interface InvoiceTemplateProps {
  document: WrappedInvoice;
}

export const InvoiceTemplate = ({ document }: InvoiceTemplateProps) => {
  console.log("Rendering Invoice template with document:", document);
  
  // Get the unwrapped data
  const { invoiceDetails, billableItems = [], subtotal = 0, tax = 0, taxTotal = 0, total = 0 } = document.data || {};
  const { billFrom = {}, billTo = {} } = invoiceDetails || {};
  const company = billTo?.company || {};
  
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
    
    // For objects, check each property for UUID pattern
    const unwrappedObj: any = {};
    Object.entries(value).forEach(([key, val]) => {
      if (typeof val === 'string') {
        // Check for UUID pattern followed by :string or :number
        const match = val.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}:(string|number):(.+)$/);
        if (match) {
          console.log(`Found wrapped value: ${val}, extracting: ${match[2]}`);
          unwrappedObj[key] = match[1] === 'number' ? Number(match[2]) : match[2];
        } else {
          unwrappedObj[key] = val;
        }
      } else if (typeof val === 'object') {
        unwrappedObj[key] = unwrapValue(val);
      } else {
        unwrappedObj[key] = val;
      }
    });
    return unwrappedObj;
  };

  const renderKeyValue = (obj: any, excludeKeys: string[] = []) => {
    const unwrappedData = unwrapValue(obj);
    console.log("Unwrapped data for rendering:", unwrappedData);
    
    return Object.entries(unwrappedData)
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
  const unwrappedDoc = unwrapValue(document.data);
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