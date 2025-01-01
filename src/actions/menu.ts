'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { Category } from '@/lib/types'

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

interface MenuItemView {
  id: string;
  name: string;
  base_price: number;
  max_price: number;
  short_description: string;
  has_protein_options: boolean;
  image_url: string;
  category_name: string;
  menu_item_proteins: Array<{
    protein_options: {
      name: string;
      is_vegetarian: boolean;
      price_addition: number;
    }
  }>;
}

export async function getMenuItemsByCategory(categoryId: string): Promise<MenuItemView[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .rpc('get_menu_items_by_category', {
      input_category_id: categoryId
    })

  if (error) {
    console.error('Failed to fetch menu items:', error)
    throw new Error('Failed to fetch menu items')
  }

  console.log(`data: ${JSON.stringify(data)}`)

  return data as MenuItemView[]
}
