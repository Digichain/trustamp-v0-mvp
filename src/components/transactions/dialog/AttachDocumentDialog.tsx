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

export const AttachDocumentDialog = ({ 
  isOpen, 
  onOpenChange,
  transactionId,
  recipientIds
}: AttachDocumentDialogProps) => {
  const [selectedDocuments, setSelectedDocuments] = useState<Array<{ id: string; title: string }>>([]);
  const { toast } = useToast();

  const handleAddDocument = (documentId: string) => {
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

      for (let i = 0; i < selectedDocuments.length; i++) {
        const { id: documentId, title } = selectedDocuments[i];
        
        // Fetch the complete document data
        const { data: documentData, error: docError } = await supabase
          .from("documents")
          .select("*, raw_document, wrapped_document, signed_document")
          .eq("id", documentId)
          .single();

        if (docError) throw docError;

        // Get the most recent version of the document
        const documentVersion = documentData.signed_document || 
                              documentData.wrapped_document || 
                              documentData.raw_document;

        if (!documentVersion) {
          console.error("No document version available");
          continue;
        }

        const documentDataToStore = {
          ...JSON.parse(JSON.stringify(documentVersion)),
          title,
          id: documentId
        };

        // Update the transaction with the document
        const { error: updateError } = await supabase
          .from("transactions")
          .update({
            [`document${i + 1}`]: documentDataToStore
          })
          .eq("id", transactionId);

        if (updateError) throw updateError;

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