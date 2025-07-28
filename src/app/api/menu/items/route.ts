import { NextResponse } from 'next/server';
import { publicApiClient } from '@/lib/api-client.server';
import type { MenuItem } from '@/lib/api/types';

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
    
    const menuItems = await publicApiClient.get<MenuItem[]>(
      `/menu/items?${queryParams.toString()}`
    );
    
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