import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, parseSessionToken } from '@/lib/auth';
import {
  getAllConsolidatedIncidents,
  updateIncidentStatus,
  updateIncidentPriority,
  assignIncidentToTeam,
  resolveIncidentProof
} from '@/lib/incidentsStore';

// GET all incidents for the administration operations workspace
export async function GET() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  const session = sessionCookie ? parseSessionToken(sessionCookie.value) : null;

  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 401 });
  }

  const incidents = await getAllConsolidatedIncidents();
  return NextResponse.json({ success: true, incidents });
}

// POST actions: status, priority, assign, resolve
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME);
  const session = sessionCookie ? parseSessionToken(sessionCookie.value) : null;

  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized: Admin privileges required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, incidentId, ...params } = body;

    const actor = { id: session.id, name: session.name };

    let updated = null;

    if (action === 'UPDATE_STATUS') {
      updated = await updateIncidentStatus(incidentId, params.status, actor, params.reason);
    } else if (action === 'UPDATE_PRIORITY') {
      updated = await updateIncidentPriority(incidentId, params.priorityLevel, actor, params.reason);
    } else if (action === 'ASSIGN_TEAM') {
      updated = await assignIncidentToTeam(incidentId, params.teamId, params.teamName, actor);
    } else if (action === 'RESOLVE_PROOF') {
      updated = await resolveIncidentProof(incidentId, params.afterPhotoUrl, params.remarks, actor.name);
    } else {
      return NextResponse.json({ error: 'Unknown admin action' }, { status: 400 });
    }

    if (!updated) {
      return NextResponse.json({ error: 'Incident not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, incident: updated });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Admin action failed: ' + (err?.message || 'Unknown') },
      { status: 500 }
    );
  }
}

