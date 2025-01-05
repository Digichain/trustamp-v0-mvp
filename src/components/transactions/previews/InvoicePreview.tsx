import { FC } from "react";
import { DocumentWrapper } from "./templates/DocumentWrapper";
import { unwrapValue } from "@/utils/document-wrapper";

interface InvoicePreviewProps {
  data: any;
}

export const InvoicePreview: FC<InvoicePreviewProps> = ({ data }) => {
  console.log("Rendering invoice preview with data:", data);

  // Extract data from the correct location in the document
  const invoiceNumber = unwrapValue(data?.invoiceDetails?.invoiceNumber) || unwrapValue(data?.invoice_number) || 'N/A';
  const billFrom = data?.invoiceDetails?.billFrom || data?.bill_from || {};
  const billTo = data?.invoiceDetails?.billTo || data?.bill_to || {};
  const billableItems = data?.billableItems || data?.billable_items || [];
  const subtotal = unwrapValue(data?.subtotal);
  const tax = unwrapValue(data?.tax);
  const taxTotal = unwrapValue(data?.taxTotal) || unwrapValue(data?.tax_total);
  const total = unwrapValue(data?.total);

  return (
    <DocumentWrapper title={`Invoice #${invoiceNumber}`}>
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-semibold mb-4">Bill From</h2>
          <div className="space-y-2">
            <p className="font-medium">Contact Person</p>
            <p>{unwrapValue(billFrom?.name)}</p>
            <p>{unwrapValue(billFrom?.email)}</p>
            <p className="font-medium mt-4">Company Details</p>
            <p>{unwrapValue(billFrom?.company?.name)}</p>
            <p>{unwrapValue(billFrom?.company?.streetAddress) || unwrapValue(billFrom?.streetAddress)}</p>
            <p>{unwrapValue(billFrom?.company?.city) || unwrapValue(billFrom?.city)}</p>
            <p>{unwrapValue(billFrom?.company?.postalCode) || unwrapValue(billFrom?.postalCode)}</p>
            <p>{unwrapValue(billFrom?.company?.phoneNumber) || unwrapValue(billFrom?.phoneNumber)}</p>
            <p>{unwrapValue(billFrom?.company?.registration)}</p>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-4">Bill To</h2>
          <div className="space-y-2">
            <p className="font-medium">Contact Person</p>
            <p>{unwrapValue(billTo?.name)}</p>
            <p>{unwrapValue(billTo?.email)}</p>
            <p className="font-medium mt-4">Company Details</p>
            <p>{unwrapValue(billTo?.company?.name)}</p>
            <p>{unwrapValue(billTo?.company?.streetAddress) || unwrapValue(billTo?.streetAddress)}</p>
            <p>{unwrapValue(billTo?.company?.city) || unwrapValue(billTo?.city)}</p>
            <p>{unwrapValue(billTo?.company?.postalCode) || unwrapValue(billTo?.postalCode)}</p>
            <p>{unwrapValue(billTo?.company?.phoneNumber) || unwrapValue(billTo?.phoneNumber)}</p>
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
                <td className="py-2">{unwrapValue(item.description)}</td>
                <td className="text-right py-2">{unwrapValue(item.quantity)}</td>
                <td className="text-right py-2">${unwrapValue(item.unitPrice)}</td>
                <td className="text-right py-2">${unwrapValue(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <span>Subtotal:</span>
            <span>${subtotal || '0.00'}</span>
          </div>
          <div className="flex justify-between py-2">
            <span>Tax ({tax || '0'}%):</span>
            <span>${taxTotal || '0.00'}</span>
          </div>
          <div className="flex justify-between py-2 font-bold">
            <span>Total:</span>
            <span>${total || '0.00'}</span>
          </div>
        </div>
      </div>
    </DocumentWrapper>
  );
};