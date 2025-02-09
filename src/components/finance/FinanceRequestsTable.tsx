import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

interface FinanceRequest {
  id: string;
  finance_type: string;
  transaction_id: string;
  amount: number;
  status: string;
  created_at: string;
  transaction?: {
    title: string;
  };
}

export const FinanceRequestsTable = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests, isLoading } = useQuery({
    queryKey: ["finance-requests"],
    queryFn: async () => {
      console.log("Fetching finance requests...");
      const { data, error } = await supabase
        .from('finance_requests')
        .select(`
          *,
          transaction:transactions(title)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching finance requests:", error);
        throw error;
      }
      console.log("Finance requests fetched:", data);
      return data as FinanceRequest[];
    },
  });

  const handleCancelRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('finance_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Finance request cancelled successfully",
      });

      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["finance-requests"] });
    } catch (error) {
      console.error("Error cancelling finance request:", error);
      toast({
        title: "Error",
        description: "Failed to cancel finance request",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Transaction</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests?.map((request) => (
          <TableRow key={request.id}>
            <TableCell>{format(new Date(request.created_at), 'dd MMM yyyy')}</TableCell>
            <TableCell>{request.finance_type}</TableCell>
            <TableCell>
              {request.transaction?.title || 'N/A'}
            </TableCell>
            <TableCell>${request.amount.toFixed(2)}</TableCell>
            <TableCell>
              <span className="capitalize">{request.status}</span>
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => handleCancelRequest(request.id)}
                  >
                    Cancel Request
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};