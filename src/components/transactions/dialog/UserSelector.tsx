import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserSelectorProps {
  onSelect: (userId: string) => void;
  selectedUserId?: string;
}

export function UserSelector({ onSelect, selectedUserId }: UserSelectorProps) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Find matching user
    const matchingUser = users.find(
      user => user.email?.toLowerCase() === value.toLowerCase()
    );
    
    if (matchingUser) {
      onSelect(matchingUser.id);
    }
  };

  return (
    <div className="relative">
      <Input
        type="email"
        placeholder="Enter email address..."
        value={selectedUser?.email || inputValue}
        onChange={handleInputChange}
        className="w-full"
      />
      {inputValue && !selectedUser && (
        <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto z-50">
          {users
            .filter(user => 
              user.email?.toLowerCase().includes(inputValue.toLowerCase())
            )
            .map(user => (
              <div
                key={user.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  onSelect(user.id);
                  setInputValue(user.email || "");
                }}
              >
                {user.email}
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}