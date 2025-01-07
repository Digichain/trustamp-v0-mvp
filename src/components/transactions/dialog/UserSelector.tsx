import { Check, X } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  email: string;
}

interface UserSelectorProps {
  selectedUsers: User[];
  onUserSelect: (user: User) => void;
  onUserRemove: (userId: string) => void;
}

export const UserSelector = ({ selectedUsers, onUserSelect, onUserRemove }: UserSelectorProps) => {
  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      console.log("Fetching users from profiles table");
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email");
      
      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
      console.log("Fetched users:", data);
      return data as User[];
    },
  });

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Notify Users</label>
      <Command className="border rounded-md">
        <CommandInput placeholder="Search users..." />
        <CommandEmpty>No users found.</CommandEmpty>
        <CommandGroup>
          {users?.map((user) => (
            <CommandItem
              key={user.id}
              onSelect={() => {
                if (!selectedUsers.find(u => u.id === user.id)) {
                  onUserSelect(user);
                }
              }}
            >
              {user.email}
              <Check
                className={`ml-auto h-4 w-4 ${
                  selectedUsers.find(u => u.id === user.id) ? "opacity-100" : "opacity-0"
                }`}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </Command>
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md"
            >
              <span className="text-sm">{user.email}</span>
              <button
                onClick={() => onUserRemove(user.id)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};