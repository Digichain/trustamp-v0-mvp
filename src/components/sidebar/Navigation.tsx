import { Link, useLocation } from "react-router-dom";
import { User, ListCheck, CreditCard } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Account",
    url: "/account",
    icon: User,
  },
  {
    title: "Transactions",
    url: "/transactions",
    icon: ListCheck,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: CreditCard,
  },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild>
            <Link 
              to={item.url}
              className={location.pathname === item.url ? "text-primary" : ""}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};