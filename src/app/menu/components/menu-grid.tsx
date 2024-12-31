import { MenuCard } from "./menu-card"
import { type MenuItem } from "@/lib/types"

interface MenuGridProps {
  items: MenuItem[]
}

export function MenuGrid({ items }: MenuGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <MenuCard key={item.id} item={item} />
      ))}
    </div>
  )
}

