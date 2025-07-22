import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AddToCartButton } from '../add-to-cart-button'
import { MenuItem } from '@/lib/types'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    prefetch: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}))

vi.mock('@/lib/feature-flags', () => ({
  isCartEnabled: vi.fn(() => true),
}))

import { isCartEnabled } from '@/lib/feature-flags'

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

describe('AddToCartButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPush.mockClear()
    vi.mocked(isCartEnabled).mockReturnValue(true)
  })

  it('should render the button when cart is enabled', () => {
    render(<AddToCartButton item={mockMenuItem} />)
    
    const button = screen.getByRole('button', { name: /order now/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Order Now')
  })

  it('should not render when cart is disabled', () => {
    vi.mocked(isCartEnabled).mockReturnValue(false)
    
    const { container } = render(<AddToCartButton item={mockMenuItem} />)
    
    expect(container.firstChild).toBeNull()
  })

  it('should navigate to order page with item data when clicked', () => {
    render(<AddToCartButton item={mockMenuItem} />)
    
    const button = screen.getByRole('button', { name: /order now/i })
    fireEvent.click(button)
    
    const expectedData = encodeURIComponent(JSON.stringify(mockMenuItem))
    expect(mockPush).toHaveBeenCalledWith(`/order/1?data=${expectedData}`)
  })

  it('should apply custom className', () => {
    render(<AddToCartButton item={mockMenuItem} className="custom-class" />)
    
    const container = screen.getByRole('button').parentElement
    expect(container).toHaveClass('custom-class')
  })

  it('should render shopping cart icon', () => {
    render(<AddToCartButton item={mockMenuItem} />)
    
    const button = screen.getByRole('button')
    const icon = button.querySelector('svg')
    expect(icon).toBeInTheDocument()
  })

  it('should handle items with special characters in data', () => {
    const specialItem: MenuItem = {
      ...mockMenuItem,
      name: 'Test & Special "Burger"',
      description: 'A burger with <special> characters',
    }
    
    render(<AddToCartButton item={specialItem} />)
    
    const button = screen.getByRole('button', { name: /order now/i })
    fireEvent.click(button)
    
    const expectedData = encodeURIComponent(JSON.stringify(specialItem))
    expect(mockPush).toHaveBeenCalledWith(`/order/1?data=${expectedData}`)
  })
})