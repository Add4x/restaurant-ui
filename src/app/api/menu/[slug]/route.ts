import { NextResponse } from 'next/server';
import { publicApiClient } from '@/lib/api-client.server';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { MenuItem } from '@/lib/api/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const menuItem = await publicApiClient.get<MenuItem>(
      API_ENDPOINTS.menu.itemBySlug(slug)
    );
    
    return NextResponse.json(menuItem);
  } catch (error) {
    console.error('Failed to fetch menu item:', error);
    
    if (error && typeof error === 'object' && 'status' in error && (error as { status: number }).status === 404) {
      return NextResponse.json(
        { error: 'Menu item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch menu item' },
      { status: 500 }
    );
  }
}