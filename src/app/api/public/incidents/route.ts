import { NextResponse } from 'next/server';
import { getPublicActiveIncidents } from '@/lib/incidentsStore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || undefined;
    const incidents = await getPublicActiveIncidents(city);
    return NextResponse.json({ success: true, incidents });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch public incidents: ' + err?.message },
      { status: 500 }
    );
  }
}

