import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface User {
  id: string;
  email: string;
}

interface Document {
  id: string;
  title: string;
  status: string;
}

export const CreateTransactionDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isPaymentBound, setIsPaymentBound] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string>("");
  const { toast } = useToast();

  // Fetch users for notification
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email");
      
      if (error) throw error;
      return data as User[];
    },
  });

  // Fetch signed/issued documents
  const { data: documents } = useQuery({
    queryKey: ["signed-documents"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["document_signed", "document_issued"]);
      
      if (error) throw error;
      return data as Document[];
    },
  });

  const handleCreateTransaction = async () => {
    try {
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
            <label className="text-sm font-medium">Notify Users</label>
            <Command className="border rounded-md">
              <CommandInput placeholder="Search users..." />
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup>
                {users?.map((user) => (
                  <CommandItem
                    key={user.id}
                    onSelect={() => {
                      if (!selectedUsers.find(u => u.id === user.id)) {
                        setSelectedUsers([...selectedUsers, user]);
                      }
                    }}
                  >
                    {user.email}
                    <Check
                      className={`ml-auto h-4 w-4 ${
                        selectedUsers.find(u => u.id === user.id) ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md"
                  >
                    <span className="text-sm">{user.email}</span>
                    <button
                      onClick={() => setSelectedUsers(selectedUsers.filter(u => u.id !== user.id))}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
              Payment Bound Transaction
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Attach Document</label>
            <Select
              value={selectedDocument}
              onValueChange={setSelectedDocument}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a document" />
              </SelectTrigger>
              <SelectContent>
                {documents?.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id}>
                    {doc.title || `Document ${doc.id}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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