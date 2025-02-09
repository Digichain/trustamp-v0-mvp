import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  recipient_user_id: string;
  transaction_id: string | null;
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
      if (!user) {
        console.log("No authenticated user found");
        throw new Error("No authenticated user");
      }

      console.log("Fetching notifications for user:", user.id);
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("recipient_user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notifications:", error);
        throw error;
      }

      console.log("Fetched notifications:", data);
      return data as Notification[];
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const markAsRead = async (notificationId: string) => {
    console.log("Marking notification as read:", notificationId);
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

  const deleteNotification = async (notificationId: string) => {
    console.log("Deleting notification:", notificationId);
    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }

    await queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  const unreadCount = notifications?.filter(n => !n.read).length || 0;
  console.log("Current unread count:", unreadCount);

  return {
    notifications: notifications || [],
    isLoading,
    markAsRead,
    deleteNotification,
    unreadCount
  };
};