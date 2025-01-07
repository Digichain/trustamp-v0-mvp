import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
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

  const { data: users, isLoading, error } = useQuery({
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
      <Button variant="outline" className="w-full" disabled>
        Loading users...
      </Button>
    );
  }

  // Early return for error state
  if (error) {
    console.error("Error in UserSelector:", error);
    return (
      <Button variant="outline" className="w-full text-red-500" disabled>
        Error loading users
      </Button>
    );
  }

  // Ensure users is always an array
  const safeUsers = users || [];
  const selectedUser = safeUsers.find((user) => user.id === selectedUserId);

  // Filter users based on input value
  const filteredUsers = safeUsers.filter((user) =>
    user.email?.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedUser?.email || "Enter email..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder="Type email address..." 
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandEmpty>No matching users found.</CommandEmpty>
          <CommandGroup>
            {filteredUsers.map((user) => (
              <CommandItem
                key={user.id}
                value={user.id}
                onSelect={() => {
                  onSelect(user.id);
                  setOpen(false);
                  setInputValue("");
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