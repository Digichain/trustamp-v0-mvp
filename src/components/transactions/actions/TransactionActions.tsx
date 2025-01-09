import { useState } from "react";
import { MoreVertical, Trash2, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Transaction } from "@/types/transactions";
import { AttachDocumentDialog } from "../dialog/AttachDocumentDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TransactionActionsProps {
  transaction: Transaction;
  onDelete: () => void;
  documents: Array<{
    id: string;
    title: string;
    status: string;
  }>;
}

export const TransactionActions = ({ 
  transaction, 
  onDelete,
  documents 
}: TransactionActionsProps) => {
  const [isAttachDialogOpen, setIsAttachDialogOpen] = useState(false);

  // Fetch recipient IDs for notifications
  const { data: recipientIds } = useQuery({
    queryKey: ["transaction-recipients", transaction.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notification_recipients")
        .select("recipient_user_id")
        .eq("transaction_id", transaction.id);

      if (error) throw error;
      return data.map(r => r.recipient_user_id);
    }
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsAttachDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Attach Document
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={onDelete}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Transaction
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AttachDocumentDialog
        isOpen={isAttachDialogOpen}
        onOpenChange={setIsAttachDialogOpen}
        transactionId={transaction.id}
        recipientIds={recipientIds || []}
      />
    </>
  );
};