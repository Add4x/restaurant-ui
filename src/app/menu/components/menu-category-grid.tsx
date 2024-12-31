import { MenuCard } from "@/app/menu/components/menu-card"
import { Category } from "@/lib/types"

interface MenuCategoryGridProps {
  items: Category[]
}

export async function MenuCategoryGrid({ items }: MenuCategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <MenuCard key={item.id} item={item} />
      ))}
    </div>
  )
}

