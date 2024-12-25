import { useNavigate } from "react-router-dom";
import { LogOut, HelpCircle, LifeBuoy } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useWallet } from "@/contexts/WalletContext";
import { WalletStatus } from "./sidebar/WalletStatus";
import { Navigation } from "./sidebar/Navigation";
import { supabase } from "@/integrations/supabase/client";

export const AppSidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { disconnectWallet } = useWallet();

  const handleLogout = async () => {
    try {
      // First disconnect the wallet
      await disconnectWallet();
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Logged out successfully",
        description: "You have been logged out and disconnected from your wallet",
      });
      
      navigate('/auth');
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Error logging out",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border">
        <WalletStatus />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <Navigation />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border p-4 flex flex-col gap-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start"
          onClick={() => navigate('/faq')}
        >
          <HelpCircle className="h-5 w-5 mr-2" />
          FAQ
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start"
          onClick={() => navigate('/support')}
        >
          <LifeBuoy className="h-5 w-5 mr-2" />
          Support
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};