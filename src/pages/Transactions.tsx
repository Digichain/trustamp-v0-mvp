import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const Transactions = () => {
  console.log("Transactions page rendered");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedSubType, setSelectedSubType] = useState<string>("");

  const getSubTypeOptions = (type: string) => {
    switch (type) {
      case "trade":
        return [
          { value: "verifiable", label: "Verifiable Document" },
          { value: "transferable", label: "Transferable Document" },
        ];
      case "authentication":
        return [
          { value: "achievement", label: "Certificate of Achievement" },
          { value: "halal", label: "Halal Certificate" },
          { value: "medical", label: "Medical Certificate" },
          { value: "membership", label: "Membership Certificate" },
        ];
      case "government":
        return [
          { value: "driver", label: "Driver's License" },
          { value: "birth", label: "Birth Certificate" },
          { value: "citizenship", label: "Citizenship Certificate" },
        ];
      case "environmental":
        return [
          { value: "type1", label: "Type 1" },
          { value: "type2", label: "Type 2" },
          { value: "type3", label: "Type 3" },
        ];
      default:
        return [];
    }
  };

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error);
        throw error;
      }

      return data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Transactions</h1>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2" />
                  Create new Transaction
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select type of transaction</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <Select 
                    onValueChange={(value) => {
                      setSelectedType(value);
                      setSelectedSubType(""); // Reset sub-type when main type changes
                    }} 
                    value={selectedType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trade">Trade Document</SelectItem>
                      <SelectItem value="authentication">Certificate of Authentication</SelectItem>
                      <SelectItem value="government">Government Issued Document</SelectItem>
                      <SelectItem value="environmental">Environmental Product Declaration</SelectItem>
                    </SelectContent>
                  </Select>

                  {selectedType && (
                    <Select onValueChange={setSelectedSubType} value={selectedSubType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document sub-type" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSubTypeOptions(selectedType).map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline">
              <FileCheck className="mr-2" />
              Verify Document
            </Button>
          </div>
        </div>
        <p className="text-gray-600 mb-8">
          View and manage your trade documentation transactions.
        </p>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction Hash</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Network</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-mono">
                    {tx.transaction_hash.slice(0, 10)}...
                    {tx.transaction_hash.slice(-8)}
                  </TableCell>
                  <TableCell className="capitalize">{tx.transaction_type}</TableCell>
                  <TableCell>{tx.network}</TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>
                    <span className={getStatusColor(tx.status)}>
                      {tx.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(tx.created_at || ""), {
                      addSuffix: true,
                    })}
                  </TableCell>
                </TableRow>
              ))}
              {(!transactions || transactions.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;