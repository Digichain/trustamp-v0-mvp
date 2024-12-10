import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { verifiableInvoiceSchema } from "@/schemas/verifiable-invoice";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const VerifiableInvoiceForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    ...verifiableInvoiceSchema,
    billableItems: [{ description: "", quantity: 0, unitPrice: 0, amount: 0 }]
  });

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

    // Calculate amount
    if (field === 'quantity' || field === 'unitPrice') {
      newBillableItems[index].amount = 
        Number(newBillableItems[index].quantity) * Number(newBillableItems[index].unitPrice);
    }

    setFormData(prev => ({
      ...prev,
      billableItems: newBillableItems
    }));

    // Update subtotal and total
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

  const addBillableItem = () => {
    setFormData(prev => ({
      ...prev,
      billableItems: [
        ...prev.billableItems,
        { description: "", quantity: 0, unitPrice: 0, amount: 0 }
      ]
    }));
  };

  const removeBillableItem = (index: number) => {
    if (formData.billableItems.length > 1) {
      const newBillableItems = formData.billableItems.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        billableItems: newBillableItems
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);

    try {
      const { data, error } = await supabase
        .from("transactions")
        .insert([
          {
            transaction_hash: `0x${Math.random().toString(16).slice(2)}`, // Generate a random hash for demo
            network: "ethereum",
            amount: formData.total,
            status: "pending",
            document_subtype: "verifiable",
            title: "INVOICE",
          }
        ])
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
          {/* Basic Information */}
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

          {/* Bill From Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Bill From</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <Input
                  value={formData.billFrom.name}
                  onChange={(e) => handleInputChange("billFrom", "name", e.target.value)}
                  placeholder="Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Street Address</label>
                <Input
                  value={formData.billFrom.streetAddress}
                  onChange={(e) => handleInputChange("billFrom", "streetAddress", e.target.value)}
                  placeholder="Street Address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <Input
                  value={formData.billFrom.city}
                  onChange={(e) => handleInputChange("billFrom", "city", e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Postal Code</label>
                <Input
                  value={formData.billFrom.postalCode}
                  onChange={(e) => handleInputChange("billFrom", "postalCode", e.target.value)}
                  placeholder="Postal Code"
                />
              </div>
            </div>
          </div>

          {/* Bill To Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Bill To</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <Input
                  value={formData.billTo.company.name}
                  onChange={(e) => handleNestedInputChange("billTo", "company", "name", e.target.value)}
                  placeholder="Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Street Address</label>
                <Input
                  value={formData.billTo.company.streetAddress}
                  onChange={(e) => handleNestedInputChange("billTo", "company", "streetAddress", e.target.value)}
                  placeholder="Street Address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Name</label>
                <Input
                  value={formData.billTo.name}
                  onChange={(e) => handleInputChange("billTo", "name", e.target.value)}
                  placeholder="Contact Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={formData.billTo.email}
                  onChange={(e) => handleInputChange("billTo", "email", e.target.value)}
                  placeholder="Email"
                />
              </div>
            </div>
          </div>

          {/* Billable Items */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Billable Items</h3>
              <Button type="button" onClick={addBillableItem} variant="outline">
                Add Item
              </Button>
            </div>
            {formData.billableItems.map((item, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 items-end">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Input
                    value={item.description}
                    onChange={(e) => handleBillableItemChange(index, "description", e.target.value)}
                    placeholder="Item description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleBillableItemChange(index, "quantity", Number(e.target.value))}
                    placeholder="Quantity"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Unit Price</label>
                  <Input
                    type="number"
                    value={item.unitPrice}
                    onChange={(e) => handleBillableItemChange(index, "unitPrice", Number(e.target.value))}
                    placeholder="Unit price"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <Input
                      type="number"
                      value={item.amount}
                      readOnly
                      className="bg-gray-50"
                    />
                  </div>
                  {formData.billableItems.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeBillableItem(index)}
                      className="mb-1"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-4">
            <div className="flex justify-end">
              <div className="w-1/3 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${formData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Tax (%):</span>
                  <Input
                    type="number"
                    value={formData.tax}
                    onChange={(e) => {
                      const taxRate = Number(e.target.value);
                      const taxTotal = formData.subtotal * (taxRate / 100);
                      setFormData(prev => ({
                        ...prev,
                        tax: taxRate,
                        taxTotal: taxTotal,
                        total: prev.subtotal + taxTotal
                      }));
                    }}
                    className="w-20"
                  />
                </div>
                <div className="flex justify-between">
                  <span>Tax Amount:</span>
                  <span>${formData.taxTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${formData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => navigate("/transactions")}>
          Cancel
        </Button>
        <Button type="submit">Create Invoice</Button>
      </div>
    </form>
  );
};