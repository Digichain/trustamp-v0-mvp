import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useDocumentSubscription = (onUpdate: () => void) => {
  useEffect(() => {
    console.log("Setting up real-time subscription for documents");
    const channel = supabase
      .channel('documents-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'documents'
        },
        async (payload) => {
          console.log("Received real-time update:", payload);
          await onUpdate();
        }
      )
      .subscribe();

    return () => {
      console.log("Cleaning up real-time subscription");
      supabase.removeChannel(channel);
    };
  }, [onUpdate]);
};