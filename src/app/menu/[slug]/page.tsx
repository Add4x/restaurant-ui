import { getMenuItemsByCategory } from "@/actions/menu"
import { MenuItemCard } from "@/app/menu/components/menu-item-card"
import { notFound } from "next/navigation"
import { subMenuItems } from "@/data/submenu-items"
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const slug = (await params).slug

  // get the value from subMenuItems and use it to get the categoryId from subMenuItemMap
  const categoryId = subMenuItems[slug as keyof typeof subMenuItems]

  console.log(`categoryId: ${JSON.stringify(categoryId)}`)
  console.log(`slug: ${slug}`)

  const items = await getMenuItemsByCategory(categoryId)

  console.log(`########################## items: ${JSON.stringify(items)}`)
  const storage_url = process.env.SUPABASE_STORAGE_URL

  // append the image_url to each item
  items.forEach((item) => {
    item.image_url = `${storage_url}/${item.image_url}`
  })

  if (!items.length) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-12 capitalize">
          {slug.replace('-', ' ')}
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
