interface InvoicePreviewProps {
  data: any;
}

export const InvoicePreview = ({ data }: InvoicePreviewProps) => {
  console.log("InvoicePreview - Rendering with data:", data);

  if (!data) {
    console.log("InvoicePreview - No data provided");
    return <div>No invoice data available</div>;
  }

  // Safely access nested objects with default empty objects
  const invoiceDetails = data.invoiceDetails || {};
  const billFrom = invoiceDetails.billFrom || {};
  const billTo = invoiceDetails.billTo || {};
  const company = billTo.company || {};
  const billableItems = Array.isArray(data.billableItems) ? data.billableItems : [];

  return (
    <div className="space-y-6 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2">Bill From</h3>
          <div className="text-sm">
            <p>{billFrom.name || 'N/A'}</p>
            <p>{billFrom.streetAddress || 'N/A'}</p>
            <p>{billFrom.city || 'N/A'}</p>
            <p>Phone: {billFrom.phoneNumber || 'N/A'}</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Bill To</h3>
          <div className="text-sm">
            <p>{billTo.name || 'N/A'}</p>
            <p>{billTo.email || 'N/A'}</p>
            {company && (
              <>
                <p>{company.name || 'N/A'}</p>
                <p>{company.streetAddress || 'N/A'}</p>
                <p>{company.city || 'N/A'}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Invoice Details</h3>
        <div className="text-sm">
          <p>Invoice Number: {invoiceDetails.invoiceNumber || 'N/A'}</p>
          <p>Date: {invoiceDetails.date || 'N/A'}</p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Items</h3>
        <div className="space-y-2">
          {billableItems.map((item: any, index: number) => (
            <div key={index} className="border p-2 rounded">
              <p className="font-medium">{item?.description || 'N/A'}</p>
              <div className="text-sm">
                <p>Quantity: {item?.quantity || 0}</p>
                <p>Unit Price: ${item?.unitPrice || 0}</p>
                <p>Amount: ${item?.amount || 0}</p>
              </div>
            </div>
          ))}
          {billableItems.length === 0 && (
            <p className="text-gray-500">No items found</p>
          )}
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="text-right space-y-1">
          <p>Subtotal: ${data.subtotal || 0}</p>
          <p>Tax: ${data.tax || 0}</p>
          <p className="font-semibold">Total: ${data.total || 0}</p>
        </div>
      </div>
    </div>
  );
};