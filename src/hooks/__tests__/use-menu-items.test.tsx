import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMenuItems, useMenuItemsByCategory, useMenuItemDetails } from '../use-menu-items'
import { useLocationStore } from '@/stores/location-store'
import * as menuActions from '@/actions/menu'

vi.mock('@/actions/menu')

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  Wrapper.displayName = 'QueryWrapper'
  return Wrapper
}

describe('useMenuItems', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch menu items by category ID', async () => {
    const mockData = [
      { id: 1, name: 'Test Item', category: 'test-category' },
    ]
    
    vi.mocked(menuActions.getMenuItemsByCategory).mockResolvedValue({
      success: true,
      data: mockData,
    })

    const { result } = renderHook(() => useMenuItems('test-category'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual({
      error: false,
      data: mockData,
    })
    expect(menuActions.getMenuItemsByCategory).toHaveBeenCalledWith('test-category')
  })

  it('should handle missing category ID', async () => {
    const { result } = renderHook(() => useMenuItems(''), {
      wrapper: createWrapper(),
    })

    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.isFetching).toBe(false)
  })

  it('should handle API errors', async () => {
    vi.mocked(menuActions.getMenuItemsByCategory).mockResolvedValue({
      success: false,
      error: 'Category not found',
      code: 'NOT_FOUND',
      status: 404,
    })

    const { result } = renderHook(() => useMenuItems('invalid-category'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual({
      error: true,
      message: 'Category not found',
      code: 'NOT_FOUND',
      status: 404,
    })
  })
})

describe('useMenuItemsByCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useLocationStore.setState({
      brandName: 'test-brand',
      selectedLocation: {
        id: 1,
        name: 'Test Location',
        slug: 'test-location',
        address: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zip_code: '12345',
        phone: '555-1234',
        is_active: true,
        opening_hours: {
          monday: '9:00-22:00',
          tuesday: '9:00-22:00',
          wednesday: '9:00-22:00',
          thursday: '9:00-22:00',
          friday: '9:00-23:00',
          saturday: '10:00-23:00',
          sunday: '10:00-21:00',
        },
      },
    })
  })

  it('should fetch menu items by category slug', async () => {
    const mockData = [
      { id: 1, name: 'Test Item', category: 'test-category' },
    ]
    
    vi.mocked(menuActions.getMenuItemsByCategorySlug).mockResolvedValue({
      success: true,
      data: mockData,
    })

    const { result } = renderHook(
      () => useMenuItemsByCategory('test-menu', 'test-category'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual({
      error: false,
      data: mockData,
    })
    expect(menuActions.getMenuItemsByCategorySlug).toHaveBeenCalledWith(
      'test-brand',
      'test-location',
      'test-menu',
      'test-category'
    )
  })

  it('should not fetch when brand or location is missing', () => {
    useLocationStore.setState({
      brandName: '',
      selectedLocation: null,
    })

    const { result } = renderHook(
      () => useMenuItemsByCategory('test-menu', 'test-category'),
      { wrapper: createWrapper() }
    )

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isFetching).toBe(false)
    expect(menuActions.getMenuItemsByCategorySlug).not.toHaveBeenCalled()
  })

  it('should handle API errors', async () => {
    vi.mocked(menuActions.getMenuItemsByCategorySlug).mockResolvedValue({
      success: false,
      error: 'Category not found',
      code: 'NOT_FOUND',
      status: 404,
    })

    const { result } = renderHook(
      () => useMenuItemsByCategory('test-menu', 'invalid-category'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual({
      error: true,
      message: 'Category not found',
      code: 'NOT_FOUND',
      status: 404,
    })
  })
})

describe('useMenuItemDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useLocationStore.setState({
      brandName: 'test-brand',
      selectedLocation: {
        id: 1,
        name: 'Test Location',
        slug: 'test-location',
        address: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zip_code: '12345',
        phone: '555-1234',
        is_active: true,
        opening_hours: {
          monday: '9:00-22:00',
          tuesday: '9:00-22:00',
          wednesday: '9:00-22:00',
          thursday: '9:00-22:00',
          friday: '9:00-23:00',
          saturday: '10:00-23:00',
          sunday: '10:00-21:00',
        },
      },
    })
  })

  it('should fetch menu item details', async () => {
    const mockData = {
      id: 1,
      name: 'Test Item',
      description: 'Test description',
      price: 9.99,
    }
    
    vi.mocked(menuActions.getMenuItemDetails).mockResolvedValue({
      success: true,
      data: mockData,
    })

    const { result } = renderHook(
      () => useMenuItemDetails('test-menu', 'test-category', 'test-item'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual({
      error: false,
      data: mockData,
    })
    expect(menuActions.getMenuItemDetails).toHaveBeenCalledWith(
      'test-brand',
      'test-location',
      'test-menu',
      'test-category',
      'test-item'
    )
  })

  it('should not fetch when required params are missing', () => {
    const { result } = renderHook(
      () => useMenuItemDetails('', '', ''),
      { wrapper: createWrapper() }
    )

    expect(result.current.isLoading).toBe(false)
    expect(result.current.isFetching).toBe(false)
    expect(menuActions.getMenuItemDetails).not.toHaveBeenCalled()
  })

  it('should handle API errors', async () => {
    vi.mocked(menuActions.getMenuItemDetails).mockResolvedValue({
      success: false,
      error: 'Item not found',
      code: 'NOT_FOUND',
      status: 404,
    })

    const { result } = renderHook(
      () => useMenuItemDetails('test-menu', 'test-category', 'invalid-item'),
      { wrapper: createWrapper() }
    )

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual({
      error: true,
      message: 'Item not found',
      code: 'NOT_FOUND',
      status: 404,
    })
  })
})