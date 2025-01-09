import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserSelector } from "./dialog/UserSelector";
import { DocumentSelector } from "./dialog/DocumentSelector";
import { Checkbox } from "@/components/ui/checkbox";

interface User {
  id: string;
  email: string;
}

export const CreateTransactionDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isPaymentBound, setIsPaymentBound] = useState(false);
  const { toast } = useToast();

  const handleCreateTransaction = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      // Create the transaction
      const { data: transaction, error: transactionError } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          status: "pending",
          transaction_type: "trade",
          transaction_hash: `0x${Math.random().toString(16).slice(2)}`,
          network: "ethereum",
          payment_bound: isPaymentBound
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Create notification recipients
      for (const recipientId of selectedUserIds) {
        const { error: notificationError } = await supabase
          .from("notification_recipients")
          .insert({
            transaction_id: transaction.id,
            recipient_user_id: recipientId
          });

        if (notificationError) throw notificationError;

        // Create notification
        const { error: notifError } = await supabase
          .from("notifications")
          .insert({
            recipient_user_id: recipientId,
            transaction_id: transaction.id,
            type: "transaction_created",
            message: "You have been added to a new transaction"
          });

        if (notifError) throw notifError;
      }

      // Create transaction documents
      for (const documentId of selectedDocuments) {
        const { error: documentError } = await supabase
          .from("transaction_documents")
          .insert({
            transaction_id: transaction.id,
            document_id: documentId
          });

        if (documentError) throw documentError;
      }

      console.log("Transaction created successfully:", transaction);
      toast({
        title: "Success",
        description: "Transaction created successfully",
      });
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error creating transaction:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create transaction",
        variant: "destructive",
      });
    }
  };

  const handleAddRecipient = (userId: string) => {
    if (!selectedUserIds.includes(userId)) {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };

  const handleRemoveRecipient = (userId: string) => {
    setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
  };

  const handleAddDocument = (documentId: string) => {
    if (!selectedDocuments.includes(documentId)) {
      setSelectedDocuments([...selectedDocuments, documentId]);
    }
  };

  const handleRemoveDocument = (documentId: string) => {
    setSelectedDocuments(selectedDocuments.filter(id => id !== documentId));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Transaction</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Recipients</label>
            <div className="space-y-2">
              {selectedUserIds.map((userId) => (
                <div key={userId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{userId}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveRecipient(userId)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <UserSelector
                selectedUserId={undefined}
                onSelect={handleAddRecipient}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Documents</label>
            <div className="space-y-2">
              {selectedDocuments.map((docId) => (
                <div key={docId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{docId}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveDocument(docId)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <DocumentSelector
                selectedDocument=""
                onDocumentSelect={handleAddDocument}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="payment-bound"
              checked={isPaymentBound}
              onCheckedChange={(checked) => setIsPaymentBound(checked as boolean)}
            />
            <label
              htmlFor="payment-bound"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Payment Bound
            </label>
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTransaction}
              disabled={selectedUserIds.length === 0}
            >
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};