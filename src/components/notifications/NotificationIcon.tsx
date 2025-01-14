import { Bell, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";

export const NotificationIcon = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, deleteNotification, isLoading } = useNotifications();

  console.log("NotificationIcon - Current notifications:", notifications);
  console.log("NotificationIcon - Unread count:", unreadCount);

  const handleNotificationClick = async (notificationId: string, transactionId: string | null) => {
    console.log("NotificationIcon - Handling notification click:", { notificationId, transactionId });
    await markAsRead(notificationId);
    
    if (transactionId) {
      console.log("NotificationIcon - Navigating to transaction page");
      navigate("/transaction-history");
    }
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation(); // Prevent triggering the parent click handler
    console.log("NotificationIcon - Deleting notification:", notificationId);
    await deleteNotification(notificationId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {isLoading ? (
          <div className="p-4 text-center text-sm text-gray-500">
            Loading notifications...
          </div>
        ) : notifications?.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            No notifications
          </div>
        ) : (
          notifications?.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={`p-4 cursor-pointer ${!notification.read ? 'bg-gray-50' : ''} relative group`}
              onClick={() => handleNotificationClick(notification.id, notification.transaction_id)}
            >
              <div className="space-y-1 pr-6">
                <p className="text-sm">{notification.message}</p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleDelete(e, notification.id)}
              >
                <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
              </Button>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};