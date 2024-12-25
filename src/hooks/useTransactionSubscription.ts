import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useTransactionSubscription = (onUpdate: () => void) => {
  useEffect(() => {
    console.log("Setting up real-time subscription for transactions");
    const channel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'transactions'
        },
        async (payload) => {
          console.log("Received real-time update:", payload);
          await onUpdate();
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      console.log("Cleaning up real-time subscription");
      supabase.removeChannel(channel);
    };
  }, [onUpdate]);
};