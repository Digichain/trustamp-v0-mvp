import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DocumentTypeSelector } from "./DocumentTypeSelector";

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
          <DocumentTypeSelector
            selectedType={selectedType}
            selectedSubType={selectedSubType}
            onTypeChange={setSelectedType}
            onSubTypeChange={setSelectedSubType}
          />

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