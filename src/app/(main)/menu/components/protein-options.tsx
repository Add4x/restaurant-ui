import { Badge } from "@/components/ui/badge";
import { MenuItem } from "@/lib/types";

interface ProteinOptionsProps {
  proteins: MenuItem["proteins"];
  basePrice: number;
}

export function ProteinOptions({ proteins, basePrice }: ProteinOptionsProps) {
  return (
    <div className="flex flex-col items-start justify-start gap-2">
      <h4 className="text-xs font-normal">Available in</h4>
      <div className="flex flex-row items-center justify-start gap-2 flex-wrap">
        {proteins.map((protein) => (
          <Badge
            key={protein.id}
            variant="secondary"
            className="bg-orange-500/10 hover:bg-orange-500/10 text-primaryDark flex items-center gap-1.5"
          >
            <span>{protein.name}</span>
            <span className="text-gray-500/70">|</span>
            <span className="text-xs">
              ${(basePrice + protein.additionalCost).toFixed(2)}
            </span>
          </Badge>
        ))}
      </div>
    </div>
  );
}
