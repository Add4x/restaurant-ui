import { vi } from 'vitest'

export const mockPush = vi.fn()
export const mockReplace = vi.fn()
export const mockBack = vi.fn()
export const mockPrefetch = vi.fn()
export const mockRefresh = vi.fn()

export const useRouter = () => ({
  push: mockPush,
  replace: mockReplace,
  back: mockBack,
  prefetch: mockPrefetch,
  refresh: mockRefresh,
})

export const usePathname = () => '/'
export const useSearchParams = () => new URLSearchParams()
export const useParams = () => ({})