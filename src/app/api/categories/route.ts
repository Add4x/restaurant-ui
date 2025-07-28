import { NextResponse } from 'next/server';
import { publicApiClient } from '@/lib/api-client.server';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Category } from '@/lib/api/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandName = searchParams.get('brandName') || process.env.RESTAURANT_BRAND || 'Burger Palace';
    const locationSlug = searchParams.get('locationSlug') || process.env.MAIN_LOCATION_SLUG || 'burger-palace-downtown';
    const menuSlug = searchParams.get('menuSlug') || 'main-menu';
    
    const queryParams = new URLSearchParams({
      brandName,
      locationSlug,
      menuSlug,
    });
    
    // Define backend response type
    interface BackendCategory {
      id: number;
      name: string;
      slug: string;
      description?: string;
      displayOrder: number;
      isActive?: boolean;
      image_url?: string;
    }
    
    // Get raw response from backend
    const rawCategories = await publicApiClient.get<BackendCategory[]>(
      `${API_ENDPOINTS.menu.categories}?${queryParams.toString()}`
    );
    
    // Transform the response to match our TypeScript types
    const categories: Category[] = rawCategories.map(cat => ({
      id: String(cat.id),
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      displayOrder: cat.displayOrder,
      isActive: cat.isActive ?? true,
      imageUrl: cat.image_url || undefined,
    }));
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}