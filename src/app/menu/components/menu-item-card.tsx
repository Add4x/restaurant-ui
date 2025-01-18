import Image from "next/image";
import { type MenuItem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
// import { OrderButton } from "@/components/order-button";
// import { Button } from "@/components/ui/button";

interface MenuItemCardProps {
  item: MenuItem;
}

function capitalizeWords(str: string): string {
  return str
    .toLowerCase() // Convert the entire string to lowercase
    .split(" ") // Split the string into words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(" "); // Join the words back into a single string
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  // Memoize these calculations to avoid recalculating on every render
  const hasVegetarianOptions =
    item.has_protein_options &&
    item.menu_item_proteins.some(
      (protein) => protein.protein_options.is_vegetarian
    );

  const hasNonVegetarianOptions =
    item.has_protein_options &&
    item.menu_item_proteins.some(
      (protein) => !protein.protein_options.is_vegetarian
    );

  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden shadow-md flex flex-col">
      <div className="flex flex-row items-center justify-start gap-2">
        <div className="relative aspect-square self-start h-[6rem] w-[8rem]">
          <Image
            src={item.image_url}
            alt={item.image_alt_text}
            fill
            sizes="(max-width: 768px) 8rem, 6rem"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col items-start justify-start self-start basis-2/3">
          <h3 className="text-lg font-semibold mb-2">
            {capitalizeWords(item.name)}
          </h3>
          <div className="flex justify-between mb-3 gap-2 self-ends">
            <div className="flex gap-2">
              {hasVegetarianOptions && (
                <Badge
                  variant="secondary"
                  className="bg-green-500/10 hover:bg-green-500/10 text-green-700"
                >
                  veg
                </Badge>
              )}
              {hasNonVegetarianOptions && (
                <Badge
                  variant="secondary"
                  className="bg-primary/20 hover:bg-primary/20 text-primaryDark"
                >
                  non-veg
                </Badge>
              )}
            </div>
          </div>
          <span className="text-sm font-medium mx-2">
            ${item.base_price.toFixed(2)}
            {item.menu_item_proteins.length > 1 &&
              ` - $${item.max_price.toFixed(2)}`}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex flex-col items-start justify-start gap-2 flex-1">
          <p className="text-xs text-gray-700 mb-2">{item.short_description}</p>
          {item.has_protein_options && item.menu_item_proteins.length > 1 && (
            <div className="flex flex-col items-start justify-start gap-2">
              <h4 className="text-xs">Available in</h4>
              {item.has_protein_options && (
                <div className="flex flex-row items-center justify-start gap-2 flex-wrap">
                  {item.menu_item_proteins
                    .sort(
                      (a, b) =>
                        a.protein_options.price_addition +
                        item.base_price -
                        (b.protein_options.price_addition + item.base_price)
                    )
                    .map((protein) => (
                      <Badge
                        key={protein.protein_options.name}
                        variant="secondary"
                        className={`${
                          protein.protein_options.is_vegetarian
                            ? "bg-green-500/10 hover:bg-green-500/10 text-green-700"
                            : "bg-orange-500/10 hover:bg-orange-500/10 text-primaryDark"
                        } flex items-center gap-1.5`}
                      >
                        <span>{protein.protein_options.name}</span>
                        <span className="text-gray-500/70">|</span>
                        <span className="text-xs">
                          $
                          {(
                            item.base_price +
                            protein.protein_options.price_addition
                          ).toFixed(2)}
                        </span>
                      </Badge>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-end mt-auto pt-4">
          {/* <OrderButton className="h-auto" fontSize="small" /> */}
        </div>
      </div>
    </div>
  );
}
