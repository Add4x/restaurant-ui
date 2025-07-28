import { NextResponse } from 'next/server';
import { publicApiClient } from '@/lib/api-client.server';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import type { Location } from '@/lib/api/types';

export async function GET() {
  try {
    const locations = await publicApiClient.get<Location[]>(
      API_ENDPOINTS.locations.list
    );
    
    return NextResponse.json(locations);
  } catch (error) {
    console.error('Failed to fetch locations:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    );
  }
}