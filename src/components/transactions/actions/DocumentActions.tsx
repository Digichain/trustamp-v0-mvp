import { Download, MoreVertical, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Document } from "@/types/documents";
import { useDownloadHandler } from "./handlers/useDownloadHandler";

interface DocumentActionsProps {
  document: Document;
  onDelete: () => void;
}

export const DocumentActions = ({ document, onDelete }: DocumentActionsProps) => {
  const { handleDownloadDocument } = useDownloadHandler();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleDownloadDocument(document)}>
          <Download className="mr-2 h-4 w-4" />
          Download Document
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete} className="text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          Delete Document
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};