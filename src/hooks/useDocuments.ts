import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useDocuments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents, isLoading, error } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      console.log("Fetching documents...");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.error("No authenticated session found");
        throw new Error("Authentication required");
      }

      console.log("Session found, user ID:", session.user.id);

      try {
        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error fetching documents:", error);
          throw error;
        }

        console.log("Successfully fetched documents:", data?.length || 0, "records");
        return data || [];
      } catch (error: any) {
        console.error("Error in document fetch:", error);
        toast({
          title: "Error",
          description: "Failed to fetch documents. Please try again.",
          variant: "destructive",
        });
        throw error;
      }
    },
    retry: 2,
    staleTime: 30000,
    refetchOnWindowFocus: true,
  });

  const invalidateDocuments = async () => {
    console.log("Invalidating documents cache...");
    await queryClient.invalidateQueries({ queryKey: ["documents"] });
    await queryClient.refetchQueries({ queryKey: ["documents"] });
    console.log("Documents cache invalidated and refetched");
  };

  return {
    documents,
    isLoading,
    error,
    invalidateDocuments,
  };
};