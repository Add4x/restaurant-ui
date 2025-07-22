import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CartItemComponent } from '../cart-item'
import { CartItem, useCartStore } from '@/stores/cart-store'
import { MenuItem, MenuItemProtein } from '@/lib/types'

const mockRemoveItem = vi.fn()
const mockUpdateQuantity = vi.fn()

vi.mock('@/stores/cart-store', () => ({
  useCartStore: vi.fn(() => ({
    removeItem: mockRemoveItem,
    updateQuantity: mockUpdateQuantity,
  })),
}))

const mockMenuItem: MenuItem = {
  id: 1,
  name: 'Test Burger',
  description: 'A delicious test burger',
  price: 12.99,
  category: 'Burgers',
  image_url: '/test-burger.jpg',
  image_alt_text: 'Test burger image',
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

const mockCartItem: CartItem = {
  id: '1-base',
  menuItem: mockMenuItem,
  selectedProtein: null,
  quantity: 2,
  totalPrice: 25.98,
}

describe('CartItemComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render cart item with basic information', () => {
    render(<CartItemComponent item={mockCartItem} />)
    
    expect(screen.getByText('Test Burger')).toBeInTheDocument()
    expect(screen.getByText('$12.99 each')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('$25.98')).toBeInTheDocument()
  })

  it('should render cart item with protein option', () => {
    const itemWithProtein: CartItem = {
      ...mockCartItem,
      id: '1-Chicken',
      selectedProtein: mockProtein,
      totalPrice: 31.98,
    }
    
    render(<CartItemComponent item={itemWithProtein} />)
    
    expect(screen.getByText('Chicken')).toBeInTheDocument()
    expect(screen.getByText('$15.99 each')).toBeInTheDocument() // 12.99 + 3.00
  })

  it('should call removeItem when remove button is clicked', () => {
    render(<CartItemComponent item={mockCartItem} />)
    
    const removeButton = screen.getByRole('button', { name: /remove/i })
    fireEvent.click(removeButton)
    
    expect(mockRemoveItem).toHaveBeenCalledWith('1-base')
  })

  it('should increase quantity when plus button is clicked', () => {
    render(<CartItemComponent item={mockCartItem} />)
    
    const increaseButton = screen.getByRole('button', { name: /increase/i })
    fireEvent.click(increaseButton)
    
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1-base', 3)
  })

  it('should decrease quantity when minus button is clicked', () => {
    render(<CartItemComponent item={mockCartItem} />)
    
    const decreaseButton = screen.getByRole('button', { name: /decrease/i })
    fireEvent.click(decreaseButton)
    
    expect(mockUpdateQuantity).toHaveBeenCalledWith('1-base', 1)
  })

  it('should not decrease quantity below 1', () => {
    const singleItem: CartItem = {
      ...mockCartItem,
      quantity: 1,
      totalPrice: 12.99,
    }
    
    render(<CartItemComponent item={singleItem} />)
    
    const decreaseButton = screen.getByRole('button', { name: /decrease/i })
    fireEvent.click(decreaseButton)
    
    expect(mockUpdateQuantity).not.toHaveBeenCalled()
  })

  it('should render placeholder image when image_url is missing', () => {
    const itemWithoutImage: CartItem = {
      ...mockCartItem,
      menuItem: {
        ...mockMenuItem,
        image_url: null as any,
      },
    }
    
    render(<CartItemComponent item={itemWithoutImage} />)
    
    const image = screen.getByAltText('Test burger image')
    expect(image).toHaveAttribute('src', expect.stringContaining('placeholder.svg'))
  })

  it('should display correct total for items with protein', () => {
    const itemWithProtein: CartItem = {
      ...mockCartItem,
      id: '1-Chicken',
      selectedProtein: mockProtein,
      quantity: 3,
      totalPrice: 47.97, // (12.99 + 3.00) * 3
    }
    
    render(<CartItemComponent item={itemWithProtein} />)
    
    expect(screen.getByText('$47.97')).toBeInTheDocument()
    expect(screen.getByText('$15.99 each')).toBeInTheDocument()
  })
})