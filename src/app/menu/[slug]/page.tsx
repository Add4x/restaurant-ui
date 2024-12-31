import { getMenuItemsByCategory } from "@/actions/menu"
import { MenuItemCard } from "@/app/menu/components/menu-item-card"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const items = await getMenuItemsByCategory(params.slug)

  if (!items.length) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12 capitalize">
          {params.slug.replace('-', ' ')}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

