import { useState } from "react";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { UserSelector } from "./dialog/UserSelector";
import { DocumentSelector } from "./dialog/DocumentSelector";

interface User {
  id: string;
  email: string;
}

export const CreateTransactionDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isPaymentBound, setIsPaymentBound] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string>("");
  const { toast } = useToast();

  const handleCreateTransaction = async () => {
    try {
      console.log("Creating transaction with:", {
        selectedUsers,
        isPaymentBound,
        selectedDocument
      });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      // Create the transaction
      const { data: transaction, error: transactionError } = await supabase
        .from("transactions")
        .insert({
          user_id: user.id,
          payment_bound: isPaymentBound,
          attached_document_id: selectedDocument || null,
          status: "pending",
          transaction_type: "trade",
          transaction_hash: `0x${Math.random().toString(16).slice(2)}`,
          network: "ethereum"
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Create notification recipients
      if (selectedUsers.length > 0) {
        const { error: notificationError } = await supabase
          .from("notification_recipients")
          .insert(
            selectedUsers.map(user => ({
              transaction_id: transaction.id,
              recipient_user_id: user.id
            }))
          );

        if (notificationError) throw notificationError;
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
          <UserSelector
            selectedUsers={selectedUsers}
            onUserSelect={(user) => setSelectedUsers([...selectedUsers, user])}
            onUserRemove={(userId) => setSelectedUsers(selectedUsers.filter(u => u.id !== userId))}
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
              Payment Bound Transaction
            </label>
          </div>

          <DocumentSelector
            selectedDocument={selectedDocument}
            onDocumentSelect={setSelectedDocument}
          />

          <div className="flex justify-end space-x-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTransaction}
              disabled={!selectedUsers.length}
            >
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};