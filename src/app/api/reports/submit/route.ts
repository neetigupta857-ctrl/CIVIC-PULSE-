import { NextResponse } from 'next/server';
import { submitCitizenReport } from '@/lib/incidentsStore';
import { CreateReportInput } from '@/types/incident';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validation
    const { category, description, city, locationName, coordinates, isUrgentHazard, photoUrl, user } = body;

    if (!category || !locationName || !coordinates || typeof coordinates.lat !== 'number' || typeof coordinates.lng !== 'number') {
      return NextResponse.json(
        { error: 'Missing required report fields: category, locationName, coordinates' },
        { status: 400 }
      );
    }

    if (!photoUrl) {
      return NextResponse.json(
        { error: 'Photograph is mandatory for civic hazard verification' },
        { status: 400 }
      );
    }

    // Require authenticated citizen
    const userId = user?.id || 'citizen-anon';
    const userName = user?.name || 'Concerned Citizen';
    const userEmail = user?.email || undefined;
    const userPhone = user?.phone || undefined;

    const input: CreateReportInput = {
      category,
      description: description?.trim() || `${category} hazard reported on ${locationName}. Immediate municipal inspection requested.`,
      city: city || 'New Delhi',
      locationName,
      coordinates,
      isUrgentHazard: Boolean(isUrgentHazard),
      photoUrl,
      userId,
      userName,
      userEmail,
      userPhone
    };

    const result = await submitCitizenReport(input);

    return NextResponse.json({
      success: true,
      isDuplicateJoined: result.isDuplicateJoined,
      distanceMeters: result.distanceMeters,
      message: result.isDuplicateJoined
        ? 'A pothole has already been reported nearby. Your report has been added to the existing complaint.'
        : 'Complaint submitted successfully and queued for verification.',
      trackingCode: result.incident.trackingCode,
      incidentId: result.incident.id,
      status: result.incident.status
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Submission service error: ' + (err?.message || 'Unknown') },
      { status: 500 }
    );
  }
}

