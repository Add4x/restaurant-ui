'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Category, MenuItem } from '@/lib/types'

// get categories ordered by display_order with selected fields
export async function getCategories(): Promise<Category[]> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase.from('menu_categories').select('id, name, display_order, description, image_url').order('display_order', { ascending: true })
  if (error) throw new Error('Failed to fetch categories')

  // return data
  return data.map((category) => ({
    ...category,
    description: category.description ?? '',
    image_url: category.image_url ?? '',
    display_order: category.display_order ?? 0
  }))
}

export async function getMenuItemsByCategory(categoryId: string): Promise<MenuItem[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .rpc('get_menu_items_by_category', {
      category_id: categoryId
    })

  if (error) throw new Error('Failed to fetch menu items')

  // Parse the JSON menu_item_proteins field
  return data.map(item => ({
    ...item,
    menu_item_proteins: JSON.parse(item.menu_item_proteins as string)
  }))
}
