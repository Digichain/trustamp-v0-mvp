import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { DIDDocument } from "../../identity/DIDCreator";
import { formatInvoiceToOpenAttestation } from "@/utils/document-formatters";
import { useQueryClient } from "@tanstack/react-query";

export const useInvoiceSubmission = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (formData: any, didDocument: DIDDocument) => {
    console.log("Starting invoice submission with data:", { formData, didDocument });
    setIsSubmitting(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        throw new Error("No authenticated session found");
      }

      const sanitizedFormData = {
        ...formData,
        invoiceDetails: {
          ...formData.invoiceDetails,
          billFrom: formData.invoiceDetails.billFrom || {},
          billTo: {
            ...formData.invoiceDetails.billTo,
            company: formData.invoiceDetails.billTo?.company || {}
          }
        }
      };

      const openAttestationDocument = formatInvoiceToOpenAttestation(sanitizedFormData, didDocument);
      console.log("RAW DOCUMENT STRUCTURE:", JSON.stringify(openAttestationDocument, null, 2));
      console.log("RAW DOCUMENT KEYS ORDER:", Object.keys(openAttestationDocument));

      const { data: documentData, error: documentError } = await supabase
        .from("documents")
        .insert({
          transaction_hash: `0x${Math.random().toString(16).slice(2)}`,
          network: "ethereum",
          status: "document_created",
          document_subtype: "verifiable",
          title: "INVOICE",
          transaction_type: "trade",
          user_id: sessionData.session.user.id,
          raw_document: openAttestationDocument
        })
        .select()
        .single();

      if (documentError) {
        throw new Error("Failed to create document");
      }

      const { error: invoiceError } = await supabase
        .from("invoice_documents")
        .insert({
          document_id: documentData.id,
          invoice_number: sanitizedFormData.invoiceDetails.invoiceNumber,
          date: sanitizedFormData.invoiceDetails.date,
          bill_from: sanitizedFormData.invoiceDetails.billFrom,
          bill_to: sanitizedFormData.invoiceDetails.billTo,
          billable_items: sanitizedFormData.billableItems,
          subtotal: parseFloat(formData.subtotal || 0),
          tax: parseFloat(formData.tax || 0),
          tax_total: parseFloat(formData.taxTotal || 0),
          total: parseFloat(formData.total || 0)
        });

      if (invoiceError) {
        throw new Error("Failed to create invoice document");
      }

      await queryClient.invalidateQueries({ queryKey: ["documents"] });

      toast({
        title: "Success",
        description: "Invoice created successfully",
      });

      navigate("/documents");
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
