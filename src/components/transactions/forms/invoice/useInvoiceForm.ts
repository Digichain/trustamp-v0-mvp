import { useState } from "react";
import { verifiableInvoiceSchema } from "@/schemas/verifiable-invoice";
import { DIDDocument } from "../../identity/DIDCreator";

export const useInvoiceForm = () => {
  const [formData, setFormData] = useState({
    ...verifiableInvoiceSchema,
    billableItems: [{ description: "", quantity: 0, unitPrice: 0, amount: 0 }]
  });
  const [didDocument, setDidDocument] = useState<DIDDocument | null>(null);

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section: string, field: string, value: string) => {
    const [nestedField, subField] = field.split('.');
    if (subField) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [nestedField]: {
            ...prev[section][nestedField],
            [subField]: value
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

  return {
    formData,
    setFormData,
    didDocument,
    setDidDocument,
    handleInputChange,
    handleNestedInputChange,
    handleBillableItemChange
  };
};