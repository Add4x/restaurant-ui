import Image from "next/image"
import { type MenuItem } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface MenuItemCardProps {
  item: MenuItem
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  return (
    <div className="bg-gray-100 rounded-lg overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={item.image_url}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{item.short_description}</p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-2">
            {item.has_protein_options && (
              // check if any protein options are vegetarian or non-veg
              item.menu_item_proteins.some((protein) => protein.protein_options.is_vegetarian) && (
                <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                  veg
                </Badge>
              )
            )}
          </div>
          {item.has_protein_options && (
            item.menu_item_proteins.some((protein) => !protein.protein_options.is_vegetarian) && (
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-500">
                non-veg
              </Badge>
            )
          )}
          <span className="text-sm font-medium">
            ${item.base_price.toFixed(2)} - ${item.max_price.toFixed(2)}
          </span>
        </div>
        <Button className="w-full bg-orange-500 hover:bg-orange-600">
          Order Now
        </Button>
      </div>
    </div>
  )
}

