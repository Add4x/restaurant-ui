import { NextResponse } from 'next/server';
import { publicApiClient } from '@/lib/api-client.server';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Location } from '@/lib/api/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  try {
    const location = await publicApiClient.get<Location>(
      API_ENDPOINTS.locations.bySlug(slug)
    );
    
    return NextResponse.json(location);
  } catch (error) {
    console.error('Failed to fetch location:', error);
    
    if (error && typeof error === 'object' && 'status' in error && (error as { status: number }).status === 404) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch location' },
      { status: 500 }
    );
  }
}