import { MoreVertical, Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useDocumentHandlers } from "./handlers/useDocumentHandlers";
import { Document } from "@/types/documents";

interface DocumentActionsProps {
  document: Document;
  onPreviewClick: () => void;
  onDelete: () => void;
}

export const DocumentActions = ({ 
  document
}: DocumentActionsProps) => {
  const { handleDownloadDocument } = useDocumentHandlers();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleDownloadDocument(document)}>
          <Download className="mr-2 h-4 w-4" />
          Download Document
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};