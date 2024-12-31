import { getCategories } from '@/actions/menu'
import { MenuCategoryGrid } from '@/app/menu/components/menu-category-grid'


export default async function MenuPage() {
  // These will run on the server
  const categories = await getCategories()

  console.log(categories)

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <MenuCategoryGrid items={categories} />
    </div>
  )
}

