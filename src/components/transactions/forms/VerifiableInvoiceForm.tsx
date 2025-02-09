import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BillFromSection } from "./invoice/BillFromSection";
import { BillToSection } from "./invoice/BillToSection";
import { BillableItemsSection } from "./invoice/BillableItemsSection";
import { TotalsSection } from "./invoice/TotalsSection";
import { PreviewDialog, PreviewButton } from "../previews/PreviewDialog";
import { InvoicePreview } from "../previews/InvoicePreview";
import { DIDDocument } from "../identity/DIDCreator";
import { InvoiceFormHeader } from "./invoice/InvoiceFormHeader";
import { useInvoiceSubmission } from "./invoice/useInvoiceSubmission";
import { useInvoiceForm } from "./invoice/useInvoiceForm";

export const VerifiableInvoiceForm = () => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [didDocument, setDidDocument] = useState<DIDDocument | null>(null);
  const { handleSubmit, isSubmitting } = useInvoiceSubmission();
  const {
    formData,
    handleInputChange,
    handleNestedInputChange,
    handleBillableItemChange
  } = useInvoiceForm();

  const handleDIDCreated = (doc: DIDDocument) => {
    console.log("VerifiableInvoiceForm - DID Document created:", doc);
    setDidDocument(doc);
  };

  const onSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    if (!didDocument) {
      console.log("Cannot submit form - DID document not created yet");
      return;
    }
    
    // Only submit if we have form data
    if (formData.invoiceDetails.invoiceNumber && formData.invoiceDetails.date) {
      console.log("Submitting form with data:", formData);
      await handleSubmit(formData, didDocument);
    } else {
      console.log("Form data incomplete - not submitting");
    }
  };

  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    console.log("Opening preview dialog without submitting form");
    setShowPreview(true);
  };

  const handleClosePreview = () => {
    console.log("Closing preview dialog");
    setShowPreview(false);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <InvoiceFormHeader onDIDCreated={handleDIDCreated} didDocument={didDocument} />

      {didDocument && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Invoice ID</label>
                  <Input
                    value={formData.invoiceDetails.invoiceNumber}
                    onChange={(e) => handleInputChange("invoiceDetails", "invoiceNumber", e.target.value)}
                    placeholder="Invoice ID"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <Input
                    type="date"
                    value={formData.invoiceDetails.date}
                    onChange={(e) => handleInputChange("invoiceDetails", "date", e.target.value)}
                    required
                  />
                </div>
              </div>

              <BillFromSection
                billFrom={formData.invoiceDetails.billFrom}
                onInputChange={(field, value) => handleInputChange("invoiceDetails.billFrom", field, value)}
              />

              <BillToSection
                billTo={formData.invoiceDetails.billTo}
                onInputChange={handleNestedInputChange}
              />

              <BillableItemsSection
                items={formData.billableItems}
                onItemChange={handleBillableItemChange}
                onAddItem={() => handleInputChange("billableItems", "", JSON.stringify([
                  ...formData.billableItems,
                  { description: "", quantity: 0, unitPrice: 0, amount: 0 }
                ]))}
                onRemoveItem={(index) => {
                  if (formData.billableItems.length > 1) {
                    handleInputChange("billableItems", "", JSON.stringify(
                      formData.billableItems.filter((_, i) => i !== index)
                    ));
                  }
                }}
              />

              <TotalsSection
                subtotal={formData.subtotal}
                tax={formData.tax}
                taxTotal={formData.taxTotal}
                total={formData.total}
                onTaxChange={(taxRate) => {
                  const taxTotal = formData.subtotal * (taxRate / 100);
                  handleInputChange("tax", "", taxRate.toString());
                  handleInputChange("taxTotal", "", taxTotal.toString());
                  handleInputChange("total", "", (formData.subtotal + taxTotal).toString());
                }}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate("/documents")}>
              Cancel
            </Button>
            <PreviewButton onClick={handlePreview} disabled={isSubmitting} />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Invoice"}
            </Button>
          </div>

          <PreviewDialog
            title="Invoice Preview"
            isOpen={showPreview}
            onOpenChange={handleClosePreview}
          >
            <InvoicePreview data={formData} />
          </PreviewDialog>
        </>
      )}
    </form>
  );
};