import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '../cart-store'
import { MenuItem, MenuItemProtein } from '@/lib/types'

const mockMenuItem: MenuItem = {
  id: 1,
  name: 'Test Burger',
  description: 'A delicious test burger',
  price: 12.99,
  category: 'Burgers',
  image_url: '/test-burger.jpg',
  availability_status: 'available',
  preparation_time: 15,
  spice_level: 'mild',
  allergens: ['gluten', 'dairy'],
  is_vegetarian: false,
  is_vegan: false,
  is_gluten_free: false,
}

const mockProtein: MenuItemProtein = {
  id: 1,
  menu_item_id: 1,
  protein_option_id: 1,
  is_available: true,
  protein_options: {
    id: 1,
    name: 'Chicken',
    description: 'Grilled chicken',
    price_addition: 3.00,
    is_available: true,
  },
}

describe('Cart Store', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart()
    useCartStore.getState().isOpen = false
  })

  it('should add an item to the cart', () => {
    const { addItem, items } = useCartStore.getState()
    
    addItem(mockMenuItem, null)
    
    const state = useCartStore.getState()
    expect(state.items).toHaveLength(1)
    expect(state.items[0]).toMatchObject({
      id: '1-base',
      menuItem: mockMenuItem,
      selectedProtein: null,
      quantity: 1,
      totalPrice: 12.99,
    })
  })

  it('should add an item with protein option', () => {
    const { addItem } = useCartStore.getState()
    
    addItem(mockMenuItem, mockProtein)
    
    const state = useCartStore.getState()
    expect(state.items).toHaveLength(1)
    expect(state.items[0]).toMatchObject({
      id: '1-Chicken',
      menuItem: mockMenuItem,
      selectedProtein: mockProtein,
      quantity: 1,
      totalPrice: 15.99, // 12.99 + 3.00
    })
  })

  it('should increment quantity when adding same item', () => {
    const { addItem } = useCartStore.getState()
    
    addItem(mockMenuItem, null)
    addItem(mockMenuItem, null)
    
    const state = useCartStore.getState()
    expect(state.items).toHaveLength(1)
    expect(state.items[0].quantity).toBe(2)
    expect(state.items[0].totalPrice).toBe(25.98) // 12.99 * 2
  })

  it('should treat items with different proteins as separate items', () => {
    const { addItem } = useCartStore.getState()
    
    addItem(mockMenuItem, null)
    addItem(mockMenuItem, mockProtein)
    
    const state = useCartStore.getState()
    expect(state.items).toHaveLength(2)
    expect(state.items[0].id).toBe('1-base')
    expect(state.items[1].id).toBe('1-Chicken')
  })

  it('should remove an item from the cart', () => {
    const { addItem, removeItem } = useCartStore.getState()
    
    addItem(mockMenuItem, null)
    const itemId = useCartStore.getState().items[0].id
    
    removeItem(itemId)
    
    const state = useCartStore.getState()
    expect(state.items).toHaveLength(0)
  })

  it('should update item quantity', () => {
    const { addItem, updateQuantity } = useCartStore.getState()
    
    addItem(mockMenuItem, null)
    const itemId = useCartStore.getState().items[0].id
    
    updateQuantity(itemId, 5)
    
    const state = useCartStore.getState()
    expect(state.items[0].quantity).toBe(5)
    expect(state.items[0].totalPrice).toBe(64.95) // 12.99 * 5
  })

  it('should update item quantity with protein option correctly', () => {
    const { addItem, updateQuantity } = useCartStore.getState()
    
    addItem(mockMenuItem, mockProtein)
    const itemId = useCartStore.getState().items[0].id
    
    updateQuantity(itemId, 3)
    
    const state = useCartStore.getState()
    expect(state.items[0].quantity).toBe(3)
    expect(state.items[0].totalPrice).toBe(47.97) // (12.99 + 3.00) * 3
  })

  it('should clear the cart', () => {
    const { addItem, clearCart } = useCartStore.getState()
    
    addItem(mockMenuItem, null)
    addItem(mockMenuItem, mockProtein)
    
    clearCart()
    
    const state = useCartStore.getState()
    expect(state.items).toHaveLength(0)
  })

  it('should toggle cart visibility', () => {
    const { toggleCart } = useCartStore.getState()
    
    expect(useCartStore.getState().isOpen).toBe(false)
    
    toggleCart()
    expect(useCartStore.getState().isOpen).toBe(true)
    
    toggleCart()
    expect(useCartStore.getState().isOpen).toBe(false)
  })

  it('should calculate total items correctly', () => {
    const { addItem, getTotalItems } = useCartStore.getState()
    
    addItem(mockMenuItem, null)
    addItem(mockMenuItem, null) // quantity becomes 2
    addItem(mockMenuItem, mockProtein) // different item, quantity 1
    
    expect(getTotalItems()).toBe(3) // 2 + 1
  })

  it('should calculate total price correctly', () => {
    const { addItem, getTotalPrice } = useCartStore.getState()
    
    addItem(mockMenuItem, null)
    addItem(mockMenuItem, null) // quantity becomes 2, price 25.98
    addItem(mockMenuItem, mockProtein) // different item, price 15.99
    
    expect(getTotalPrice()).toBe(41.97) // 25.98 + 15.99
  })
})