import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { DIDDocument } from "../../identity/DIDCreator";
import { formatInvoiceToOpenAttestation } from "@/utils/document-formatters";

export const useInvoiceSubmission = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: any, didDocument: DIDDocument) => {
    console.log("Starting invoice submission with data:", { formData, didDocument });
    setIsSubmitting(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        throw new Error("No authenticated session found");
      }

      // Format the document according to OpenAttestation schema
      const openAttestationDocument = formatInvoiceToOpenAttestation(formData, didDocument);
      console.log("Formatted OpenAttestation document:", openAttestationDocument);

      // Ensure numeric values are properly formatted
      const total = typeof formData.total === 'object' ? 
        parseFloat(formData.total[""] || 0) : 
        parseFloat(formData.total || 0);

      console.log("Parsed total value:", total);

      // Create transaction record
      const { data: transactionData, error: transactionError } = await supabase
        .from("transactions")
        .insert({
          transaction_hash: `0x${Math.random().toString(16).slice(2)}`,
          network: "ethereum",
          amount: total,
          status: "document_created",
          document_subtype: "verifiable",
          title: "INVOICE",
          transaction_type: "trade",
          user_id: sessionData.session.user.id,
          raw_document: openAttestationDocument
        })
        .select()
        .single();

      if (transactionError) {
        console.error("Error creating transaction:", transactionError);
        throw new Error("Failed to create transaction");
      }

      console.log("Created transaction:", transactionData);

      // Ensure numeric values are properly formatted for invoice document
      const subtotal = parseFloat(formData.subtotal || 0);
      const tax = typeof formData.tax === 'object' ? 
        parseFloat(formData.tax[""] || 0) : 
        parseFloat(formData.tax || 0);
      const taxTotal = typeof formData.taxTotal === 'object' ? 
        parseFloat(formData.taxTotal[""] || 0) : 
        parseFloat(formData.taxTotal || 0);

      // Create invoice document record
      const { error: invoiceError } = await supabase
        .from("invoice_documents")
        .insert({
          transaction_id: transactionData.id,
          invoice_number: formData.id,
          date: formData.date,
          bill_from: formData.billFrom,
          bill_to: formData.billTo,
          billable_items: formData.billableItems,
          subtotal: subtotal,
          tax: tax,
          tax_total: taxTotal,
          total: total
        });

      if (invoiceError) {
        console.error("Error creating invoice document:", invoiceError);
        throw new Error("Failed to create invoice document");
      }

      toast({
        title: "Success",
        description: "Invoice created successfully",
      });

      navigate("/transactions");
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create invoice",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
};