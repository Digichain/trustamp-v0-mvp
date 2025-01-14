import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

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
  console.log("PreviewDialog - Rendering with state:", { isOpen });
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto p-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface PreviewButtonProps {
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
}

export const PreviewButton = ({ onClick, disabled }: PreviewButtonProps) => (
  <Button type="button" variant="outline" onClick={onClick} disabled={disabled}>
    <Eye className="mr-2" />
    Preview
  </Button>
);