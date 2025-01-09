import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

// Define the type for a transaction
interface Transaction {
  id: string;
  user_id: string;
  created_at: string;
  // Add other transaction fields as needed
}

export const useTransactions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions, isLoading, error } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      console.log("Fetching transactions...");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error("No authenticated session found");
        throw new Error("Authentication required");
      }

      console.log("Session found, user ID:", session.user.id);

      try {
        // First, fetch transactions where user is the owner
        const { data: ownedTransactions, error: ownedError } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (ownedError) {
          console.error("Error fetching owned transactions:", ownedError);
          throw ownedError;
        }

        // First, get the transaction IDs where the user is a recipient
        const { data: recipientIds, error: recipientIdsError } = await supabase
          .from("notification_recipients")
          .select("transaction_id")
          .eq("recipient_user_id", session.user.id);

        if (recipientIdsError) {
          console.error("Error fetching recipient IDs:", recipientIdsError);
          throw recipientIdsError;
        }

        // Then, fetch the actual transactions using those IDs
        const transactionIds = recipientIds?.map(r => r.transaction_id) || [];
        
        let recipientTransactions: any[] = [];
        if (transactionIds.length > 0) {
          const { data: recipientTxs, error: recipientTxError } = await supabase
            .from("transactions")
            .select("*")
            .in("id", transactionIds)
            .order("created_at", { ascending: false });

          if (recipientTxError) {
            console.error("Error fetching recipient transactions:", recipientTxError);
            throw recipientTxError;
          }

          recipientTransactions = recipientTxs || [];
        }

        // Combine and deduplicate transactions
        const allTransactions = [...(ownedTransactions || []), ...recipientTransactions];
        const uniqueTransactions = Array.from(
          new Map(allTransactions.map(tx => [tx.id, tx])).values()
        );

        console.log("Successfully fetched transactions:", uniqueTransactions.length, "records");
        console.log("- Owned transactions:", ownedTransactions?.length || 0);
        console.log("- Recipient transactions:", recipientTransactions.length);

        return uniqueTransactions;
      } catch (error: any) {
        console.error("Error in transaction fetch:", error);
        toast({
          title: "Error",
          description: "Failed to fetch transactions. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    retry: 2,
    staleTime: 30000, // Cache for 30 seconds
    refetchOnWindowFocus: true,
  });

  // Function to invalidate and refetch the transactions query
  const invalidateTransactions = async () => {
    console.log("Invalidating transactions cache...");
    await queryClient.invalidateQueries({ queryKey: ["transactions"] });
    await queryClient.refetchQueries({ queryKey: ["transactions"] });
    console.log("Transactions cache invalidated and refetched");
  };

  // If there's an error, show toast
  if (error) {
    console.error("Query error in useTransactions:", error);
    toast({
      title: "Error",
      description: "Failed to load transactions. Please refresh the page.",
      variant: "destructive",
    });
  }

  return {
    transactions,
    isLoading,
    error,
    invalidateTransactions,
  };
};