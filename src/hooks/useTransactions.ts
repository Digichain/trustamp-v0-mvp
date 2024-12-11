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
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
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
  });

  const invalidateTransactions = () => {
    console.log("Invalidating transactions cache...");
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  };

  return {
    transactions,
    isLoading,
    invalidateTransactions,
  };
};