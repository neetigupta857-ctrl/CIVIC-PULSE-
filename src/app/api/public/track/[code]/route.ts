import { NextResponse } from 'next/server';
import { getConsolidatedIncidentById, sanitizePublicIncidentView } from '@/lib/incidentsStore';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const incident = await getConsolidatedIncidentById(code);
    if (!incident) {
      return NextResponse.json({ success: false, error: 'Incident not found' }, { status: 404 });
    }

    // Only allow public viewing if incident is not REJECTED or purely pending internal moderation
    const sanitized = sanitizePublicIncidentView(incident);
    return NextResponse.json({ success: true, incident: sanitized });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: 'Tracking service error: ' + err?.message },
      { status: 500 }
    );
  }
}

