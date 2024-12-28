import { FC } from "react";
import { DocumentWrapper } from "./templates/DocumentWrapper";
import { unwrapValue } from "@/utils/document-wrapper";

interface InvoicePreviewProps {
  data: any;
}

export const InvoicePreview: FC<InvoicePreviewProps> = ({ data }) => {
  const invoiceDetails = data || {};
  const billFrom = invoiceDetails.bill_from || {};
  const billTo = invoiceDetails.bill_to || {};
  const billableItems = invoiceDetails.billable_items || [];

  return (
    <DocumentWrapper title={`Invoice #${unwrapValue(invoiceDetails?.invoice_number) || 'N/A'}`}>
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Bill From</h2>
          <div className="space-y-2">
            <p className="font-medium">Contact Person</p>
            <p>{billFrom.name}</p>
            <p>{billFrom.email}</p>
            <p className="font-medium mt-4">Company Details</p>
            <p>{billFrom.company?.name}</p>
            <p>{billFrom.company?.address}</p>
            <p>{billFrom.company?.registration}</p>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Bill To</h2>
          <div className="space-y-2">
            <p className="font-medium">Contact Person</p>
            <p>{billTo.name}</p>
            <p>{billTo.email}</p>
            <p className="font-medium mt-4">Company Details</p>
            <p>{billTo.company?.name}</p>
            <p>{billTo.company?.address}</p>
            <p>{billTo.company?.registration}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Items</h2>
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
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span>Subtotal:</span>
            <span>${invoiceDetails.subtotal || '0.00'}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Tax ({invoiceDetails.tax || '0'}%):</span>
            <span>${invoiceDetails.tax_total || '0.00'}</span>
          </div>
          <div className="flex justify-between py-2 font-bold">
            <span>Total:</span>
            <span>${invoiceDetails.total || '0.00'}</span>
          </div>
        </div>
      </div>
    </DocumentWrapper>
  );
};