import { NextResponse } from 'next/server';
import { publicApiClient } from '@/lib/api-client.server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const brandName = searchParams.get('brandName');
    const locationSlug = searchParams.get('locationSlug');
    const menuSlug = searchParams.get('menuSlug') || 'main-menu';
    const categorySlug = searchParams.get('categorySlug');
    
    if (!brandName || !locationSlug || !categorySlug) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    const queryParams = new URLSearchParams({
      brandName,
      locationSlug,
      menuSlug,
      categorySlug,
    });
    
    interface BackendMenuItem {
      id: number;
      name: string;
      slug: string;
      description?: string;
      price: number;
      categoryId?: string;
      imageUrl?: string;
      image_url?: string;
      isVegetarian?: boolean;
      isVegan?: boolean;
      isGlutenFree?: boolean;
      spiceLevel?: 'MILD' | 'MEDIUM' | 'HOT' | 'EXTRA_HOT';
      calories?: number;
      isActive?: boolean;
      isAvailable?: boolean;
      proteins?: Array<{
        id: number;
        name: string;
        additionalCost: number;
      }>;
      modifications?: Array<{
        id: number;
        name: string;
        description: string;
        additionalCost: number;
      }>;
      tags?: Array<{
        id: number;
        name: string;
        slug: string;
      }>;
    }
    
    const rawMenuItems = await publicApiClient.get<BackendMenuItem[]>(
      `/menu/items?${queryParams.toString()}`
    );
    
    // Transform the response to match frontend expectations
    const menuItems = rawMenuItems.map(item => ({
      ...item,
      id: String(item.id),
      categoryId: item.categoryId || '',
      imageUrl: item.imageUrl || item.image_url,
      isVegetarian: item.isVegetarian || false,
      isVegan: item.isVegan || false,
      isGlutenFree: item.isGlutenFree || false,
      isActive: item.isActive ?? true,
      isAvailable: item.isAvailable ?? true,
      // Include proteins, modifications, and tags if they exist
      proteins: item.proteins || [],
      modifications: item.modifications || [],
      tags: item.tags || [],
    }));
    
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('Failed to fetch menu items:', error);
    
    if (error && typeof error === 'object' && 'status' in error && (error as { status: number }).status === 404) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}