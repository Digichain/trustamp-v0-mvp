import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, X, Check } from "lucide-react";

interface PreviewDialogProps {
  title: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  children: React.ReactNode;
}

export const PreviewDialog = ({
  title,
  isOpen,
  onOpenChange,
  onConfirm,
  children,
}: PreviewDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto p-4">
          {children}
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-2" />
            Cancel Preview
          </Button>
          <Button onClick={onConfirm}>
            <Check className="mr-2" />
            Create Document
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const PreviewButton = ({ onClick }: { onClick: () => void }) => (
  <Button variant="outline" onClick={onClick}>
    <Eye className="mr-2" />
    Preview
  </Button>
);