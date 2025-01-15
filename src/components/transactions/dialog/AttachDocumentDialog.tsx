import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DocumentSelector } from "./DocumentSelector";

interface AttachDocumentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string;
  recipientIds: string[];
}

interface SelectedDocument {
  id: string;
  title: string;
}

export const AttachDocumentDialog = ({ 
  isOpen, 
  onOpenChange,
  transactionId,
  recipientIds
}: AttachDocumentDialogProps) => {
  const [selectedDocuments, setSelectedDocuments] = useState<SelectedDocument[]>([]);
  const { toast } = useToast();

  const handleAddDocument = (documentId: string) => {
    console.log("Attempting to add document:", documentId);
    if (!selectedDocuments.some(doc => doc.id === documentId)) {
      if (selectedDocuments.length < 2) {
        setSelectedDocuments([...selectedDocuments, { id: documentId, title: "" }]);
      } else {
        toast({
          title: "Maximum documents reached",
          description: "You can only attach up to 2 documents",
          variant: "destructive",
        });
      }
    }
  };

  const handleTitleChange = (documentId: string, title: string) => {
    setSelectedDocuments(selectedDocuments.map(doc => 
      doc.id === documentId ? { ...doc, title } : doc
    ));
  };

  const createNotificationForRecipient = async (recipientId: string, documentType: string) => {
    console.log("Creating notification for recipient:", recipientId);
    const { error: notifError } = await supabase
      .from("notifications")
      .insert({
        recipient_user_id: recipientId,
        transaction_id: transactionId,
        type: "document_attached",
        message: `A new ${documentType} document has been attached to the transaction`
      });

    if (notifError) {
      console.error("Error creating notification:", notifError);
      throw notifError;
    }
  };

  const handleAttachDocuments = async () => {
    try {
      console.log("Attaching documents to transaction:", transactionId);
      console.log("Selected documents:", selectedDocuments);

      // Validate document titles
      if (selectedDocuments.some(doc => !doc.title)) {
        toast({
          title: "Missing document title",
          description: "Please provide a title for each document",
          variant: "destructive",
        });
        return;
      }

      // Get current transaction state
      const { data: transaction, error: txError } = await supabase
        .from("transactions")
        .select("document1, document2")
        .eq("id", transactionId)
        .maybeSingle();

      if (txError) {
        console.error("Error fetching transaction:", txError);
        throw txError;
      }

      if (!transaction) {
        console.error("Transaction not found");
        toast({
          title: "Error",
          description: "Transaction not found",
          variant: "destructive",
        });
        return;
      }

      console.log("Current transaction state:", transaction);

      // Check available document slots
      const documentSlots: { [key: string]: any } = {
        document1: transaction.document1,
        document2: transaction.document2
      };

      for (const selectedDoc of selectedDocuments) {
        // Find first available slot
        const availableSlot = Object.keys(documentSlots).find(slot => !documentSlots[slot]);
        console.log("Looking for available slot. Current slots:", documentSlots);
        console.log("Found available slot:", availableSlot);

        if (!availableSlot) {
          toast({
            title: "No available slots",
            description: "This transaction already has the maximum number of documents",
            variant: "destructive",
          });
          return;
        }

        // Fetch complete document data
        const { data: documentData, error: docError } = await supabase
          .from("documents")
          .select("*, raw_document, wrapped_document, signed_document")
          .eq("id", selectedDoc.id)
          .maybeSingle();

        if (docError) {
          console.error("Error fetching document data:", docError);
          throw docError;
        }

        if (!documentData) {
          console.error("Document not found:", selectedDoc.id);
          continue;
        }

        // Get the most recent version of the document
        const documentVersion = documentData.signed_document || 
                              documentData.wrapped_document || 
                              documentData.raw_document;

        if (!documentVersion) {
          console.error("No document version available");
          continue;
        }

        // Prepare document data for storage
        const documentDataToStore = {
          ...JSON.parse(JSON.stringify(documentVersion)),
          title: selectedDoc.title,
          id: selectedDoc.id
        };

        // Update transaction with the document in the available slot
        const updateData = { [availableSlot]: documentDataToStore };
        console.log("Updating transaction with data:", updateData);

        const { error: updateError } = await supabase
          .from("transactions")
          .update(updateData)
          .eq("id", transactionId);

        if (updateError) {
          console.error("Error updating transaction:", updateError);
          throw updateError;
        }

        // Mark the slot as used
        documentSlots[availableSlot] = documentDataToStore;

        // Create notifications for all recipients
        for (const recipientId of recipientIds) {
          await createNotificationForRecipient(
            recipientId, 
            documentData.document_subtype || "unknown"
          );
        }
      }

      console.log("Documents attached successfully");
      toast({
        title: "Success",
        description: "Documents attached successfully",
      });
      onOpenChange(false);
      setSelectedDocuments([]);
    } catch (error: any) {
      console.error("Error attaching documents:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to attach documents",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Attach Documents (Max 2)</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <DocumentSelector
            selectedDocument=""
            onDocumentSelect={handleAddDocument}
          />
          
          {selectedDocuments.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Selected Documents</h4>
              {selectedDocuments.map((doc) => (
                <div key={doc.id} className="space-y-2 p-3 bg-gray-50 rounded">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{doc.id}</span>
                  </div>
                  <Input
                    placeholder="Document Title"
                    value={doc.title}
                    onChange={(e) => handleTitleChange(doc.id, e.target.value)}
                    className="mt-2"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAttachDocuments}
              disabled={selectedDocuments.length === 0}
            >
              Attach
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};