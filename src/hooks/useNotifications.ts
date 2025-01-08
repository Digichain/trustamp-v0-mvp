import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  recipient_user_id: string;
  transaction_id: string;
  type: string;
  message: string;
  read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      console.log("Fetching notifications...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("recipient_user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }

      return data as Notification[];
    },
  });

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId);

    if (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }

    await queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  return {
    notifications,
    isLoading,
    markAsRead,
    unreadCount: notifications?.filter(n => !n.read).length || 0
  };
};