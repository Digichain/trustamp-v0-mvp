import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const UserProfile = () => {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log("UserProfile - User found:", user.email);
        setEmail(user.email);
      }
    };

    getUser();
  }, []);

  const getInitials = (email: string) => {
    return email
      .split('@')[0]
      .slice(0, 2)
      .toUpperCase();
  };

  if (!email) return null;

  return (
    <Card className="mb-6">
      <CardContent className="flex items-center gap-4 py-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg bg-primary text-primary-foreground">
            {getInitials(email)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-gray-900">
            Welcome back!
          </h2>
          <p className="text-sm text-muted-foreground">
            {email}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};