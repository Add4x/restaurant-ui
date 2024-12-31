import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { type MenuItem } from "@/lib/types"

interface MenuCardProps {
  item: MenuItem
}

export function MenuCard({ item }: MenuCardProps) {
  return (
    <Card className="overflow-hidden bg-black/5 backdrop-blur-sm border-zinc-800">
      <div className="aspect-square relative">
        <Image
          src={item.image_url || '/default-menu-item.jpg'}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-400 mb-4">{item.short_description}</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {item.has_protein_options && (
              <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                veg
              </Badge>
            )}
            {item.has_protein_options && (
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-500">
                Non-veg
              </Badge>
            )}
          </div>
          <p className="text-lg font-bold text-green-500">${item.base_price.toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  )
}

