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
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    } else if (field.includes('.')) {
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

    // Calculate amount for the current item
    if (field === 'quantity' || field === 'unitPrice') {
      const quantity = Number(newBillableItems[index].quantity) || 0;
      const unitPrice = Number(newBillableItems[index].unitPrice) || 0;
      newBillableItems[index].amount = Number((quantity * unitPrice).toFixed(2));
    }

    // Calculate totals
    const subtotal = Number(newBillableItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0).toFixed(2));
    const taxRate = Number(formData.tax) || 0;
    const taxTotal = Number((subtotal * (taxRate / 100)).toFixed(2));
    const total = Number((subtotal + taxTotal).toFixed(2));
    
    setFormData(prev => ({
      ...prev,
      billableItems: newBillableItems,
      subtotal,
      taxTotal,
      total
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