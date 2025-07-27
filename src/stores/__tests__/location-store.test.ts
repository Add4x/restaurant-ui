import { describe, it, expect, beforeEach } from 'vitest'
import { useLocationStore } from '../location-store'
import { Location } from '@/lib/types'

const mockLocation1: Location = {
  id: 1,
  name: 'Downtown Location',
  slug: 'downtown',
  address: '123 Main St',
  city: 'New York',
  state: 'NY',
  zip_code: '10001',
  phone: '555-0100',
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
}

const mockLocation2: Location = {
  id: 2,
  name: 'Uptown Location',
  slug: 'uptown',
  address: '456 Park Ave',
  city: 'New York',
  state: 'NY',
  zip_code: '10002',
  phone: '555-0200',
  is_active: true,
  opening_hours: {
    monday: '10:00-21:00',
    tuesday: '10:00-21:00',
    wednesday: '10:00-21:00',
    thursday: '10:00-21:00',
    friday: '10:00-22:00',
    saturday: '11:00-22:00',
    sunday: '11:00-20:00',
  },
}

describe('Location Store', () => {
  beforeEach(() => {
    const { setBrandName, setLocations, setSelectedLocation } = useLocationStore.getState()
    setBrandName('')
    setLocations([])
    setSelectedLocation(null)
  })

  it('should set brand name', () => {
    const { setBrandName } = useLocationStore.getState()
    
    setBrandName('Test Restaurant')
    
    const state = useLocationStore.getState()
    expect(state.brandName).toBe('Test Restaurant')
  })

  it('should set locations', () => {
    const { setLocations } = useLocationStore.getState()
    
    setLocations([mockLocation1, mockLocation2])
    
    const state = useLocationStore.getState()
    expect(state.locations).toHaveLength(2)
    expect(state.locations[0]).toEqual(mockLocation1)
    expect(state.locations[1]).toEqual(mockLocation2)
  })

  it('should set selected location', () => {
    const { setSelectedLocation } = useLocationStore.getState()
    
    setSelectedLocation(mockLocation1)
    
    const state = useLocationStore.getState()
    expect(state.selectedLocation).toEqual(mockLocation1)
  })

  it('should get selected location slug', () => {
    const { setSelectedLocation, getSelectedLocationSlug } = useLocationStore.getState()
    
    expect(getSelectedLocationSlug()).toBeNull()
    
    setSelectedLocation(mockLocation1)
    expect(getSelectedLocationSlug()).toBe('downtown')
    
    setSelectedLocation(mockLocation2)
    expect(getSelectedLocationSlug()).toBe('uptown')
  })

  it('should handle empty state correctly', () => {
    const state = useLocationStore.getState()
    
    expect(state.brandName).toBe('')
    expect(state.locations).toEqual([])
    expect(state.selectedLocation).toBeNull()
    expect(state.getSelectedLocationSlug()).toBeNull()
  })

  it('should update brand name without affecting other state', () => {
    const { setBrandName, setLocations, setSelectedLocation } = useLocationStore.getState()
    
    setLocations([mockLocation1])
    setSelectedLocation(mockLocation1)
    setBrandName('New Brand Name')
    
    const state = useLocationStore.getState()
    expect(state.brandName).toBe('New Brand Name')
    expect(state.locations).toHaveLength(1)
    expect(state.selectedLocation).toEqual(mockLocation1)
  })
})