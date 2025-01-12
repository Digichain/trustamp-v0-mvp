import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DocumentSelector } from "./DocumentSelector";

interface AttachDocumentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transactionId: string;
  recipientIds: string[];
}

export const AttachDocumentDialog = ({ 
  isOpen, 
  onOpenChange,
  transactionId,
  recipientIds
}: AttachDocumentDialogProps) => {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const { toast } = useToast();

  const handleAddDocument = (documentId: string) => {
    if (!selectedDocuments.includes(documentId)) {
      setSelectedDocuments([...selectedDocuments, documentId]);
    }
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

      // Get document details to determine type
      const { data: documentDetails, error: documentDetailsError } = await supabase
        .from("documents")
        .select("document_subtype")
        .in("id", selectedDocuments)
        .single();

      if (documentDetailsError) throw documentDetailsError;

      // Create transaction documents
      for (const documentId of selectedDocuments) {
        const { error: documentError } = await supabase
          .from("transaction_documents")
          .insert({
            transaction_id: transactionId,
            document_id: documentId
          });

        if (documentError) throw documentError;

        // Create notifications for all recipients
        for (const recipientId of recipientIds) {
          await createNotificationForRecipient(recipientId, documentDetails.document_subtype || "unknown");
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
          <DialogTitle>Attach Documents</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <DocumentSelector
            selectedDocument=""
            onDocumentSelect={handleAddDocument}
          />
          
          {selectedDocuments.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Selected Documents</h4>
              {selectedDocuments.map((docId) => (
                <div key={docId} className="p-2 bg-gray-50 rounded">
                  <span className="text-sm">{docId}</span>
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