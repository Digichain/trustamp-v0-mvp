import { Link, useLocation } from "react-router-dom";
import { User, ListCheck, CreditCard, LayoutDashboard, LineChart, Wallet2, BadgeDollarSign, Receipt, ShieldCheck } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Account",
    url: "/account",
    icon: User,
  },
  {
    title: "Documents",
    url: "/documents",
    icon: ListCheck,
  },
  {
    title: "Transactions",
    url: "/transaction-history",
    icon: Receipt,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: CreditCard,
  },
  {
    title: "Finance",
    url: "/finance",
    icon: Wallet2,
  },
  {
    title: "Compliance",
    url: "/compliance",
    icon: ShieldCheck,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: LineChart,
  },
  {
    title: "Subscription",
    url: "/subscription",
    icon: BadgeDollarSign,
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