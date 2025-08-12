// src/components/ui/ProductDropdown.tsx
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductOption = {
  _id: string;
  name: string;
};

type Props = {
  label?: string;
  selected: string;
  onChange: (value: string) => void;
  options: ProductOption[];
};

export function ProductDropdown({
  label = "Select Product",
  selected,
  onChange,
  options,
}: Props) {
  return (
    <div className="space-y-2">
      {/* <Label>{label}</Label> */}
      <Select value={selected} onValueChange={onChange}>
        <SelectTrigger className="bg-primaryColor_1 border-none">
          <SelectValue placeholder="Select product" />
        </SelectTrigger>
        <SelectContent className="bg-primaryColor_1 text-white border-none">
          {options.map((product) => (
            <SelectItem
              key={product._id}
              value={product._id}
              className="font-body"
            >
              {product.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
