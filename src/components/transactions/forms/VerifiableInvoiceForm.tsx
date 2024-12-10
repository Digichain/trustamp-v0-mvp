import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { verifiableInvoiceSchema } from "@/schemas/verifiable-invoice";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { BillFromSection } from "./invoice/BillFromSection";
import { BillToSection } from "./invoice/BillToSection";
import { BillableItemsSection } from "./invoice/BillableItemsSection";
import { TotalsSection } from "./invoice/TotalsSection";
import { PreviewDialog, PreviewButton } from "../previews/PreviewDialog";
import { InvoicePreview } from "../previews/InvoicePreview";

export const VerifiableInvoiceForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    ...verifiableInvoiceSchema,
    billableItems: [{ description: "", quantity: 0, unitPrice: 0, amount: 0 }]
  });
  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (
    section: string,
    nestedSection: string,
    field: string,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nestedSection]: {
          ...prev[section][nestedSection],
          [field]: value
        }
      }
    }));
  };

  const handleBillableItemChange = (index: number, field: string, value: string | number) => {
    const newBillableItems = [...formData.billableItems];
    newBillableItems[index] = {
      ...newBillableItems[index],
      [field]: value
    };

    if (field === 'quantity' || field === 'unitPrice') {
      newBillableItems[index].amount = 
        Number(newBillableItems[index].quantity) * Number(newBillableItems[index].unitPrice);
    }

    setFormData(prev => ({
      ...prev,
      billableItems: newBillableItems
    }));

    const subtotal = newBillableItems.reduce((sum, item) => sum + Number(item.amount), 0);
    const taxTotal = subtotal * (Number(formData.tax) / 100);
    
    setFormData(prev => ({
      ...prev,
      billableItems: newBillableItems,
      subtotal: subtotal,
      taxTotal: taxTotal,
      total: subtotal + taxTotal
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No user found");
      }

      const { data, error } = await supabase
        .from("transactions")
        .insert({
          transaction_hash: `0x${Math.random().toString(16).slice(2)}`,
          network: "ethereum",
          amount: formData.total,
          status: "pending",
          document_subtype: "verifiable",
          title: "INVOICE",
          transaction_type: "trade",
          user_id: user.id
        })
        .select();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Invoice created successfully",
      });

      navigate("/transactions");
    } catch (error) {
      console.error("Error creating transaction:", error);
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Invoice ID</label>
              <Input
                value={formData.id}
                onChange={(e) => setFormData(prev => ({ ...prev, id: e.target.value }))}
                placeholder="Invoice ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>

          <BillFromSection
            billFrom={formData.billFrom}
            onInputChange={(field, value) => handleInputChange("billFrom", field, value)}
          />

          <BillToSection
            billTo={formData.billTo}
            onInputChange={handleNestedInputChange}
          />

          <BillableItemsSection
            items={formData.billableItems}
            onItemChange={handleBillableItemChange}
            onAddItem={() => setFormData(prev => ({
              ...prev,
              billableItems: [...prev.billableItems, { description: "", quantity: 0, unitPrice: 0, amount: 0 }]
            }))}
            onRemoveItem={(index) => {
              if (formData.billableItems.length > 1) {
                const newItems = formData.billableItems.filter((_, i) => i !== index);
                setFormData(prev => ({
                  ...prev,
                  billableItems: newItems
                }));
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
              setFormData(prev => ({
                ...prev,
                tax: taxRate,
                taxTotal: taxTotal,
                total: prev.subtotal + taxTotal
              }));
            }}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => navigate("/transactions")}>
          Cancel
        </Button>
        <PreviewButton onClick={() => setShowPreview(true)} />
        <Button type="submit">Create Invoice</Button>
      </div>

      <PreviewDialog
        title="Invoice Preview"
        isOpen={showPreview}
        onOpenChange={setShowPreview}
        onConfirm={handleSubmit}
      >
        <InvoicePreview data={formData} />
      </PreviewDialog>
    </form>
  );
};