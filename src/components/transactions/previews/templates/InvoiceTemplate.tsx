import { WrappedInvoice, BillToContact, CompanyDetails } from "./types";
import { DocumentWrapper } from "./DocumentWrapper";

interface InvoiceTemplateProps {
  document: WrappedInvoice;
}

export const InvoiceTemplate = ({ document }: InvoiceTemplateProps) => {
  console.log("Rendering Invoice template with document:", document);
  
  if (!document?.data) {
    console.warn("No document data provided to InvoiceTemplate");
    return <div>No document data available</div>;
  }
  
  const { invoiceDetails, billableItems = [], subtotal = 0, tax = 0, taxTotal = 0, total = 0 } = document.data;
  
  if (!invoiceDetails) {
    console.warn("No invoice details found in document");
    return <div>No invoice details available</div>;
  }

  const { billFrom = {}, billTo = {} as BillToContact } = invoiceDetails;
  const company = (billTo.company || {}) as CompanyDetails;
  
  const formatLabel = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  const unwrapValue = (value: any): any => {
    if (!value || typeof value !== 'object') return value;
    
    if (Array.isArray(value)) {
      return value.map(item => unwrapValue(item));
    }
    
    const unwrappedObj: any = {};
    Object.entries(value).forEach(([key, val]) => {
      if (typeof val === 'string') {
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

  const renderKeyValue = (obj: any) => {
    const unwrappedData = unwrapValue(obj);
    console.log("Unwrapped data for rendering:", unwrappedData);
    
    return Object.entries(unwrappedData)
      .filter(([_, value]) => value)
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

  return (
    <DocumentWrapper title={`Invoice #${invoiceDetails?.invoiceNumber || 'N/A'}`}>
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
              {renderKeyValue(billTo)}
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
            {document.data.billableItems?.map((item: any, index: number) => (
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
            <span>${Number(document.data.subtotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax ({Number(document.data.tax || 0)}%):</span>
            <span>${Number(document.data.taxTotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${Number(document.data.total || 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </DocumentWrapper>
  );
};