import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useTransactions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      console.log("Fetching transactions...");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error("No authenticated session found");
        return [];
      }

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
        toast({
          title: "Error",
          description: "Failed to fetch transactions",
          variant: "destructive",
        });
        throw error;
      }

      console.log("Fetched transactions:", data);
      return data;
    },
    staleTime: 0, // Always fetch fresh data
    refetchOnWindowFocus: true, // Refetch when window gains focus
  });

  const invalidateTransactions = async () => {
    console.log("Invalidating transactions cache...");
    await queryClient.invalidateQueries({ queryKey: ["transactions"] });
    await queryClient.refetchQueries({ queryKey: ["transactions"] });
    console.log("Transactions cache invalidated and refetched");
  };

  return {
    transactions,
    isLoading,
    invalidateTransactions,
  };
};