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
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error fetching transactions:", error);
          throw error;
        }

        console.log("Successfully fetched transactions:", data?.length || 0, "records");
        return data || [];
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