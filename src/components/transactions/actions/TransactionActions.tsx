import { useState } from "react";
import { MoreVertical, Trash2, Plus, DollarSign, RefreshCw } from "lucide-react";
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
import { useToast } from "@/components/ui/use-toast";

interface TransactionActionsProps {
  transaction: Transaction;
  onDelete: () => void;
  documents: Array<{
    id: string;
    title: string;
    status: string;
    raw_document?: {
      invoiceDetails?: {
        total?: number;
      };
      total?: number;
    };
  }>;
}

export const TransactionActions = ({ 
  transaction, 
  onDelete,
  documents 
}: TransactionActionsProps) => {
  const [isAttachDialogOpen, setIsAttachDialogOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { toast } = useToast();

  // Check if user is admin
  const { data: session } = useQuery({
    queryKey: ["user-session"],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    }
  });

  const isAdmin = session?.user?.email === 'digichaininnovations@gmail.com';

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

  const createPaymentNotification = async (recipientId: string, amount: number) => {
    console.log("Creating payment notification for recipient:", recipientId);
    const { error: notifError } = await supabase
      .from("notifications")
      .insert({
        recipient_user_id: recipientId,
        transaction_id: transaction.id,
        type: "payment_made",
        message: `Payment of AUD ${amount.toFixed(2)} has been made and held in escrow`
      });

    if (notifError) {
      console.error("Error creating payment notification:", notifError);
      throw notifError;
    }
  };

  const handlePayment = async () => {
    console.log("Processing payment for transaction:", transaction.id);
    setIsProcessingPayment(true);

    try {
      // Find invoice amount
      const invoiceDoc = documents.find(doc => {
        if (!doc.raw_document) return false;
        return (
          (doc.raw_document.invoiceDetails?.total !== undefined) ||
          (doc.raw_document.total !== undefined)
        );
      });

      const amount = invoiceDoc?.raw_document?.invoiceDetails?.total || 
                    invoiceDoc?.raw_document?.total || 
                    0;

      const { error } = await supabase
        .from('transactions')
        .update({ 
          status: 'payment_made',
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      if (error) throw error;

      // Create notifications for all recipients
      if (recipientIds?.length) {
        console.log("Creating payment notifications for recipients:", recipientIds);
        for (const recipientId of recipientIds) {
          await createPaymentNotification(recipientId, amount);
        }
      }

      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully",
      });
    } catch (error: any) {
      console.error("Error processing payment:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleRefresh = async () => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ 
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.id);

      if (error) throw error;

      toast({
        title: "Refresh Successful",
        description: "Transaction has been refreshed",
      });
    } catch (error: any) {
      console.error("Error refreshing transaction:", error);
      toast({
        title: "Refresh Failed",
        description: error.message || "Failed to refresh transaction",
        variant: "destructive",
      });
    }
  };

  const isPaymentMade = transaction.status === 'payment_made';
  const shouldShowPayButton = transaction.payment_bound && !isPaymentMade;
  const canDelete = isAdmin || transaction.status === 'completed';
  const canRefresh = session?.user?.email === 'digichaininnovations@gmail.com';

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {shouldShowPayButton && (
            <DropdownMenuItem 
              onClick={handlePayment}
              disabled={isProcessingPayment}
              className="text-green-600 focus:text-green-600"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              {isProcessingPayment ? "Processing..." : "Pay Now"}
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={() => setIsAttachDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Attach Document
          </DropdownMenuItem>

          <DropdownMenuItem 
            onClick={handleRefresh}
            disabled={!canRefresh}
            className={`text-blue-600 focus:text-blue-600 ${!canRefresh ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Transaction
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={onDelete}
            disabled={!canDelete}
            className={`text-red-600 focus:text-red-600 ${!canDelete ? 'opacity-50 cursor-not-allowed' : ''}`}
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
