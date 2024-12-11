import { useState } from "react";
import { verifiableInvoiceSchema } from "@/schemas/verifiable-invoice";

export const useInvoiceForm = () => {
  const [formData, setFormData] = useState({
    ...verifiableInvoiceSchema,
    billableItems: [{ description: "", quantity: 0, unitPrice: 0, amount: 0 }],
    subtotal: 0,
    tax: 0,
    taxTotal: 0,
    total: 0
  });

  const handleInputChange = (section: string, field: string, value: string) => {
    console.log("handleInputChange called with:", { section, field, value });
    
    if (section === "") {
      // Handle top-level fields
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    } else if (field.includes('.')) {
      // Handle nested fields (e.g., billTo.company.name)
      const [parentField, childField] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [parentField]: {
            ...prev[section][parentField],
            [childField]: value
          }
        }
      }));
    } else {
      // Handle first-level nested fields
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    }
  };

  const handleNestedInputChange = (section: string, field: string, value: string) => {
    console.log("handleNestedInputChange called with:", { section, field, value });
    handleInputChange(section, field, value);
  };

  const handleBillableItemChange = (index: number, field: string, value: string | number) => {
    console.log("handleBillableItemChange called with:", { index, field, value });
    const newBillableItems = [...formData.billableItems];
    newBillableItems[index] = {
      ...newBillableItems[index],
      [field]: value
    };

    // Ensure quantity and unitPrice are numbers
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = Number(newBillableItems[index].quantity) || 0;
      const unitPrice = Number(newBillableItems[index].unitPrice) || 0;
      newBillableItems[index].amount = quantity * unitPrice;
    }

    // Calculate totals
    const subtotal = newBillableItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const taxRate = Number(formData.tax) || 0;
    const taxTotal = subtotal * (taxRate / 100);
    const total = subtotal + taxTotal;
    
    setFormData(prev => ({
      ...prev,
      billableItems: newBillableItems,
      subtotal: subtotal,
      taxTotal: taxTotal,
      total: total
    }));
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleNestedInputChange,
    handleBillableItemChange
  };
};