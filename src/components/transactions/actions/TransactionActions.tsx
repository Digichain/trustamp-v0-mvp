import {
  MoreVertical,
  Package,
  Trash2,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface TransactionActionsProps {
  transaction: any;
  onPreviewClick: () => void;
  onDelete: () => void;
}

export const TransactionActions = ({ 
  transaction, 
  onPreviewClick,
  onDelete,
}: TransactionActionsProps) => {
  const { toast } = useToast();

  const handleWrapDocument = async () => {
    toast({
      title: "Coming Soon",
      description: "Document wrapping functionality will be available soon.",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onPreviewClick}>
          <Eye className="mr-2 h-4 w-4" />
          Preview Document
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleWrapDocument}>
          <Package className="mr-2 h-4 w-4" />
          Wrap Document
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={onDelete}
          className="text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Document
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};