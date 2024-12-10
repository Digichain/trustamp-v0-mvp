import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSubTypeOptions, DOCUMENT_TYPES } from "./constants/documentTypes";

interface DocumentTypeSelectorProps {
  selectedType: string;
  selectedSubType: string;
  onTypeChange: (value: string) => void;
  onSubTypeChange: (value: string) => void;
}

export const DocumentTypeSelector = ({
  selectedType,
  selectedSubType,
  onTypeChange,
  onSubTypeChange,
}: DocumentTypeSelectorProps) => {
  return (
    <div className="space-y-4">
      <Select
        onValueChange={(value) => {
          onTypeChange(value);
          onSubTypeChange(""); // Reset sub-type when main type changes
        }}
        value={selectedType}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a document type" />
        </SelectTrigger>
        <SelectContent>
          {DOCUMENT_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedType && (
        <Select onValueChange={onSubTypeChange} value={selectedSubType}>
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
  );
};