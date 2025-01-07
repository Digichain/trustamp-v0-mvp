import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserSelectorProps {
  onSelect: (userId: string) => void;
  selectedUserId?: string;
}

export function UserSelector({ onSelect, selectedUserId }: UserSelectorProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      console.log("Fetching users...");
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email");

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }

      console.log("Fetched users:", data);
      return data || [];
    },
  });

  // Early return for loading state
  if (isLoading) {
    return (
      <Input
        placeholder="Loading users..."
        disabled
      />
    );
  }

  // Early return for error state
  if (error) {
    console.error("Error in UserSelector:", error);
    return (
      <Input
        placeholder="Error loading users"
        className="text-red-500"
        disabled
      />
    );
  }

  const selectedUser = users.find((user) => user.id === selectedUserId);

  // Filter users based on input value
  const filteredUsers = users.filter((user) =>
    user.email?.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          type="email"
          placeholder="Enter email address..."
          value={selectedUser?.email || inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (!open) setOpen(true);
          }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandEmpty>No matching users found.</CommandEmpty>
          <CommandGroup>
            {filteredUsers.map((user) => (
              <CommandItem
                key={user.id}
                value={user.id}
                onSelect={() => {
                  onSelect(user.id);
                  setInputValue(user.email || "");
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedUserId === user.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {user.email}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}