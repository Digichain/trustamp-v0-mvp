import { useState } from "react";
import { Plus } from "lucide-react";
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
  const [selectedUserId, setSelectedUserId] = useState<string>();
  const [selectedDocument, setSelectedDocument] = useState<string>("");
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

      // Create notification recipient if a user is selected
      if (selectedUserId) {
        const { error: notificationError } = await supabase
          .from("notification_recipients")
          .insert({
            transaction_id: transaction.id,
            recipient_user_id: selectedUserId
          });

        if (notificationError) throw notificationError;

        // Create notification
        const { error: notifError } = await supabase
          .from("notifications")
          .insert({
            recipient_user_id: selectedUserId,
            transaction_id: transaction.id,
            type: "transaction_created",
            message: "You have been added to a new transaction"
          });

        if (notifError) throw notifError;
      }

      // Create transaction document if a document is selected
      if (selectedDocument) {
        const { error: documentError } = await supabase
          .from("transaction_documents")
          .insert({
            transaction_id: transaction.id,
            document_id: selectedDocument
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
            <label className="text-sm font-medium">Recipient Email</label>
            <UserSelector
              selectedUserId={selectedUserId}
              onSelect={setSelectedUserId}
            />
          </div>

          <DocumentSelector
            selectedDocument={selectedDocument}
            onDocumentSelect={setSelectedDocument}
          />

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
              disabled={!selectedUserId}
            >
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};