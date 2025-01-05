import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";

interface PreviewDialogProps {
  title: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const PreviewDialog = ({
  title,
  isOpen,
  onOpenChange,
  children,
}: PreviewDialogProps) => {
  const handleClose = () => {
    console.log("PreviewDialog - Closing preview");
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto p-4">
          {children}
        </div>
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={handleClose}>
            <X className="mr-2" />
            Close Preview
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface PreviewButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const PreviewButton = ({ onClick, disabled }: PreviewButtonProps) => (
  <Button variant="outline" onClick={onClick} disabled={disabled}>
    <Eye className="mr-2" />
    Preview
  </Button>
);