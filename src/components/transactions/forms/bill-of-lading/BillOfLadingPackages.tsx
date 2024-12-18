import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash } from "lucide-react";

interface Package {
  description: string;
  weight: string;
  measurement: string;
}

interface BillOfLadingPackagesProps {
  packages: Package[];
  onPackageChange: (index: number, field: string, value: string) => void;
  onAddPackage: () => void;
  onRemovePackage: (index: number) => void;
  isSubmitting: boolean;
}

export const BillOfLadingPackages = ({
  packages,
  onPackageChange,
  onAddPackage,
  onRemovePackage,
  isSubmitting
}: BillOfLadingPackagesProps) => {
  return (
    <div className="space-y-4">
      {packages.map((pkg, index) => (
        <div key={index} className="grid grid-cols-3 gap-4 items-end">
          <div>
            <Label>Description</Label>
            <Input
              value={pkg.description}
              onChange={(e) => onPackageChange(index, "description", e.target.value)}
              placeholder="Package Description"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label>Weight</Label>
            <Input
              value={pkg.weight}
              onChange={(e) => onPackageChange(index, "weight", e.target.value)}
              placeholder="Weight"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label>Measurement</Label>
            <div className="flex gap-2">
              <Input
                value={pkg.measurement}
                onChange={(e) => onPackageChange(index, "measurement", e.target.value)}
                placeholder="Measurement"
                disabled={isSubmitting}
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                onClick={() => onRemovePackage(index)}
                disabled={isSubmitting || packages.length === 1}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={onAddPackage}
        disabled={isSubmitting}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Package
      </Button>
    </div>
  );
};