import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BillableItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface BillableItemsSectionProps {
  items: BillableItem[];
  onItemChange: (index: number, field: string, value: string | number) => void;
  onAddItem: () => void;
  onRemoveItem: (index: number) => void;
}

export const BillableItemsSection = ({
  items,
  onItemChange,
  onAddItem,
  onRemoveItem,
}: BillableItemsSectionProps) => {
  console.log("BillableItemsSection - Rendering with items:", items);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Billable Items</h3>
        <Button type="button" onClick={onAddItem} variant="outline">
          Add Item
        </Button>
      </div>
      {items.map((item, index) => (
        <div key={index} className="grid grid-cols-5 gap-4 items-end">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input
              value={item.description}
              onChange={(e) => onItemChange(index, "description", e.target.value)}
              placeholder="Item description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <Input
              type="number"
              min="0"
              step="1"
              value={item.quantity}
              onChange={(e) => onItemChange(index, "quantity", Number(e.target.value))}
              placeholder="Quantity"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Unit Price</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={item.unitPrice}
              onChange={(e) => onItemChange(index, "unitPrice", Number(e.target.value))}
              placeholder="Unit price"
            />
          </div>
          <div className="flex items-center gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <Input
                type="number"
                value={Number(item.amount).toFixed(2)}
                readOnly
                className="bg-gray-50"
              />
            </div>
            {items.length > 1 && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => onRemoveItem(index)}
                className="mb-1"
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};