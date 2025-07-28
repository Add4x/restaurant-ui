import { NextResponse } from 'next/server';
import { publicApiClient } from '@/lib/api-client.server';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Category } from '@/lib/api/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const category = await publicApiClient.get<Category>(
      API_ENDPOINTS.menu.categoryBySlug(slug)
    );
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Failed to fetch category:', error);
    
    if (error && typeof error === 'object' && 'status' in error && (error as { status: number }).status === 404) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}