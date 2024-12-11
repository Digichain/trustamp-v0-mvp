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

  const saveDocumentToStorage = async (document: any, fileName: string) => {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('raw-documents')
      .upload(`${fileName}.json`, new Blob([JSON.stringify(document)], {
        type: 'application/json'
      }));

    if (uploadError) {
      console.error("Error uploading document:", uploadError);
      throw new Error("Failed to upload document");
    }

    return uploadData.path;
  };

  const handleSubmit = async (formData: any, didDocument: DIDDocument) => {
    setIsSubmitting(true);
    console.log("Submitting form data:", formData);

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error("Authentication error: " + sessionError.message);
      }

      if (!sessionData.session?.user) {
        throw new Error("Please sign in to create an invoice");
      }

      const user = sessionData.session.user;
      console.log("Authenticated user:", user.id);

      // Format the document in OpenAttestation schema
      const openAttestationDocument = formatInvoiceToOpenAttestation(formData, didDocument);
      console.log("OpenAttestation document:", openAttestationDocument);

      // Generate a unique filename using timestamp and random string
      const fileName = `invoice_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      
      // Save document to storage
      const documentPath = await saveDocumentToStorage(openAttestationDocument, fileName);
      console.log("Document saved at path:", documentPath);

      // Create transaction record
      const { data: transactionData, error: transactionError } = await supabase
        .from("transactions")
        .insert({
          transaction_hash: `0x${Math.random().toString(16).slice(2)}`,
          network: "ethereum",
          amount: formData.total,
          status: "document_created",
          document_subtype: "verifiable",
          title: "INVOICE",
          transaction_type: "trade",
          user_id: user.id,
          raw_document: openAttestationDocument
        })
        .select()
        .single();

      if (transactionError) {
        console.error("Error inserting transaction:", transactionError);
        throw new Error("Failed to save transaction: " + transactionError.message);
      }

      // Save invoice document data
      const { error: invoiceError } = await supabase
        .from("invoice_documents")
        .insert({
          transaction_id: transactionData.id,
          invoice_number: formData.id,
          date: formData.date,
          bill_from: formData.billFrom,
          bill_to: formData.billTo,
          billable_items: formData.billableItems,
          subtotal: formData.subtotal,
          tax: formData.tax,
          tax_total: formData.taxTotal,
          total: formData.total
        });

      if (invoiceError) {
        console.error("Error inserting invoice document:", invoiceError);
        throw new Error("Failed to save invoice document: " + invoiceError.message);
      }

      toast({
        title: "Success",
        description: "Invoice created and stored successfully",
      });

      navigate("/transactions");
    } catch (error: any) {
      console.error("Error creating transaction:", error);
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