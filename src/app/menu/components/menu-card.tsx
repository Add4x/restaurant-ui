import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Category } from "@/lib/types"

interface MenuCardProps {
  item: Category
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
        <p className="text-sm text-zinc-400 mb-4">{item.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <p className="text-lg font-bold text-green-500">test</p>
            <p className="text-lg font-bold text-green-500">test</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

