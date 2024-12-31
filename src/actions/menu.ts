'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { MenuItem } from '@/lib/types'

// export async function getMenuItems(): Promise<MenuItem[]> {
//   const supabase = createServerSupabaseClient()

//   const { data, error } = await supabase
//     .from('menu_items')
//     .select(`
//       *,
//       menu_item_proteins (
//         protein_options (*)
//       )
//     `)

//   if (error) {
//     console.error('Error fetching menu items:', error)
//     throw new Error('Failed to fetch menu items')
//   }

//   return data
// }

// export async function getCategories(): Promise<Category[]> {
//   const supabase = createServerSupabaseClient()

//   const { data, error } = await supabase
//     .from('categories')
//     .select('*')

//   if (error) {
//     console.error('Error fetching categories:', error)
//     throw new Error('Failed to fetch categories')
//   }

//   return data
// }

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

// export async function getMenuItemsByName(itemName: string): Promise<MenuItem[]> {
//   const supabase = createServerSupabaseClient()

//   const { data, error } = await supabase
//     .rpc('get_menu_items_by_category', {
//       : itemName
// })

// if (error) {
//   console.error('Error fetching menu item:', error)
//   throw new Error('Failed to fetch menu item')
// }

// return data
// } 