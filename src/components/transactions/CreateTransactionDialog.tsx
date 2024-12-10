import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface SubTypeOption {
  value: string;
  label: string;
}

const getSubTypeOptions = (type: string): SubTypeOption[] => {
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

export const CreateTransactionDialog = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedSubType, setSelectedSubType] = useState<string>("");
  const [open, setOpen] = useState(false);

  const handleCreate = () => {
    console.log("Creating transaction:", { selectedType, selectedSubType });
    setOpen(false);
    
    // Navigate to the appropriate form based on the selected subtype
    if (selectedSubType === "verifiable") {
      navigate("/transactions/create");
    }
    
    // Reset selections after closing
    setSelectedType("");
    setSelectedSubType("");
  };

  const handleCancel = () => {
    setOpen(false);
    // Reset selections after closing
    setSelectedType("");
    setSelectedSubType("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              <SelectItem value="authentication">
                Certificate of Authentication
              </SelectItem>
              <SelectItem value="government">
                Government Issued Document
              </SelectItem>
              <SelectItem value="environmental">
                Environmental Product Declaration
              </SelectItem>
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!selectedType || !selectedSubType}
            >
              Create
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};