import { ConsolidatedIncident, CreateReportInput, PublicIncidentView, ContributionReport } from '@/types/incident';

// Calculate Haversine distance in meters between two lat/lng points
export function calculateHaversineDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// In-Memory Database store with pre-seeded realistic production-ready data
let INCIDENTS_STORE: ConsolidatedIncident[] = [
  {
    id: 'CASE-101',
    trackingCode: 'CP-DEL-8821',
    category: 'POTHOLE',
    categoryLabelEn: 'Dangerous Pothole',
    categoryLabelHi: 'सड़क का गड्ढा',
    city: 'New Delhi',
    locationName: 'Outer Ring Road, Near DPS Mathura Road, New Delhi',
    coordinates: { lat: 28.5983, lng: 77.2435 },
    isUrgentHazard: true,
    status: 'APPROVED',
    priorityLevel: 'CRITICAL',
    priorityScore: 94,
    priorityReasons: [
      'High-risk pedestrian school zone (<80m of DPS)',
      'Major heavy arterial transit ring road',
      'High severity hazard confirmed by multi-citizen reports'
    ],
    approvedPhotoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=700&q=80',
    approvedDescription: 'Large 8-inch deep crater causing vehicle rim damage and extreme two-wheeler swerving near the bus terminal.',
    reportCount: 3,
    evidenceReports: [
      {
        id: 'RPT-101-A',
        userId: 'google-usr-901',
        userName: 'Aarav Malhotra',
        userEmail: 'aarav.m@example.com',
        userPhone: '+91 98110 54321',
        photoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=700&q=80',
        description: 'Large 8-inch deep crater causing vehicle rim damage.',
        coordinates: { lat: 28.5983, lng: 77.2435 },
        submittedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
        moderation: { status: 'APPROVED', moderatedAt: new Date().toISOString(), moderatedBy: 'Er. R. K. Mishra' }
      },
      {
        id: 'RPT-101-B',
        userId: 'google-usr-902',
        userName: 'Priya Sharma',
        userEmail: 'priya.s@example.com',
        userPhone: '+91 98110 99887',
        photoUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=700&q=80',
        description: 'Deep road cavity right next to the school bus boarding spot.',
        coordinates: { lat: 28.59838, lng: 77.2436 },
        submittedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        moderation: { status: 'APPROVED', moderatedAt: new Date().toISOString(), moderatedBy: 'Er. R. K. Mishra' }
      }
    ],
    assignedTeamId: 'TEAM-EAST-01',
    assignedTeamName: 'PWD Rapid Road Repair Unit - East',
    assignedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    workUpdates: [
      {
        id: 'WU-01',
        teamId: 'TEAM-EAST-01',
        teamName: 'PWD Rapid Road Repair Unit - East',
        note: 'Cold-mix asphalt machinery dispatched to site. Traffic police notified for lane cordoning.',
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    auditTrail: [
      {
        id: 'AUD-01',
        action: 'CREATED',
        actorId: 'google-usr-901',
        actorName: 'Aarav Malhotra',
        details: 'Initial report logged with GPS coordinates',
        timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString()
      },
      {
        id: 'AUD-02',
        action: 'APPROVED',
        actorId: 'admin-delhi',
        actorName: 'Er. R. K. Mishra',
        details: 'Photo approved and case prioritized to CRITICAL',
        timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString()
      }
    ]
  },
  {
    id: 'CASE-102',
    trackingCode: 'CP-LKO-4419',
    category: 'OPEN_MANHOLE',
    categoryLabelEn: 'Open Manhole',
    categoryLabelHi: 'खुला मैनहोल',
    city: 'Lucknow',
    locationName: 'Hazratganj Main Market, Near Cathedral School, Lucknow',
    coordinates: { lat: 26.8504, lng: 80.9497 },
    isUrgentHazard: true,
    status: 'IN_PROGRESS',
    priorityLevel: 'CRITICAL',
    priorityScore: 92,
    priorityReasons: [
      'Missing cast-iron manhole frame on commercial footway',
      'Severe pedestrian fall hazard'
    ],
    approvedPhotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=700&q=80',
    approvedDescription: 'Cover stolen or broken on high-density foot corridor.',
    reportCount: 2,
    evidenceReports: [
      {
        id: 'RPT-102-A',
        userId: 'google-usr-903',
        userName: 'Vikramaditya Sharma',
        userEmail: 'vikram.sharma@example.com',
        photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=700&q=80',
        description: 'Cover missing on pedestrian pathway.',
        coordinates: { lat: 26.8504, lng: 80.9497 },
        submittedAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
        moderation: { status: 'APPROVED', moderatedAt: new Date().toISOString(), moderatedBy: 'Er. S. N. Sharma' }
      }
    ],
    assignedTeamId: 'TEAM-JAL-02',
    assignedTeamName: 'Jal Sansthan Drain Intervention Squad',
    assignedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    workUpdates: [
      {
        id: 'WU-02',
        teamId: 'TEAM-JAL-02',
        teamName: 'Jal Sansthan Drain Intervention Squad',
        note: 'Reinforced concrete replacement lid measured and fabricated. Temporary barricades erected.',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 500).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    auditTrail: []
  },
  {
    id: 'CASE-103',
    trackingCode: 'CP-BLR-9042',
    category: 'POTHOLE',
    categoryLabelEn: 'Dangerous Pothole',
    categoryLabelHi: 'सड़क का गड्ढा',
    city: 'Bengaluru',
    locationName: 'Outer Ring Road, Near Ecospace Flyover, Bellandur, Bengaluru',
    coordinates: { lat: 12.926, lng: 77.6834 },
    isUrgentHazard: false,
    status: 'RESOLVED',
    priorityLevel: 'HIGH',
    priorityScore: 82,
    priorityReasons: ['High-speed tech corridor commuter artery', 'Rainwater ponding risk'],
    approvedPhotoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=700&q=80',
    approvedDescription: 'Multi-layer asphalt erosion across left lane.',
    reportCount: 1,
    evidenceReports: [],
    assignedTeamId: 'TEAM-BBMP-04',
    assignedTeamName: 'BBMP Zonal Patchwork Team',
    workUpdates: [],
    resolvedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    resolvedAfterPhotoUrl: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=700&q=80',
    resolutionRemarks: 'Milled surface, hot-mix bituminous concrete laid and roller-compacted. Road cleared.',
    resolvedByOfficer: 'Er. K. Swamy (BBMP Executive Engineer)',
    createdAt: new Date(Date.now() - 1000 * 60 * 1200).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    auditTrail: []
  }
];

export async function getAllConsolidatedIncidents(): Promise<ConsolidatedIncident[]> {
  return [...INCIDENTS_STORE];
}

export async function getConsolidatedIncidentById(idOrCode: string): Promise<ConsolidatedIncident | null> {
  const norm = idOrCode.trim().toUpperCase();
  const match = INCIDENTS_STORE.find(
    (c) => c.id.toUpperCase() === norm || c.trackingCode.toUpperCase() === norm
  );
  return match ? { ...match } : null;
}

export function sanitizePublicIncidentView(item: ConsolidatedIncident): PublicIncidentView {
  return {
    id: item.id,
    trackingCode: item.trackingCode,
    category: item.category,
    categoryLabelEn: item.categoryLabelEn,
    categoryLabelHi: item.categoryLabelHi,
    city: item.city,
    locationName: item.locationName,
    coordinates: item.coordinates,
    status: item.status,
    priorityLevel: item.priorityLevel,
    priorityScore: item.priorityScore,
    priorityReasons: item.priorityReasons,
    approvedPhotoUrl: item.approvedPhotoUrl,
    approvedDescription: item.approvedDescription,
    reportCount: item.reportCount,
    resolvedAt: item.resolvedAt,
    resolvedAfterPhotoUrl: item.resolvedAfterPhotoUrl,
    resolutionRemarks: item.resolutionRemarks,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt
  };
}

export async function getPublicActiveIncidents(filterCity?: string): Promise<PublicIncidentView[]> {
  return INCIDENTS_STORE
    .filter((inc) => {
      // Must be approved, assigned, in-progress, or resolved (not REJECTED, NEW, or UNDER_REVIEW)
      const isPublic = ['APPROVED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].includes(inc.status);
      if (!isPublic) return false;
      if (!filterCity || filterCity === 'All India (National)') return true;
      return inc.city.toLowerCase() === filterCity.toLowerCase();
    })
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .map(sanitizePublicIncidentView);
}

// 20-Meter Pothole Duplicate Detection Engine
export async function submitCitizenReport(
  input: CreateReportInput
): Promise<{ incident: ConsolidatedIncident; isDuplicateJoined: boolean; distanceMeters?: number }> {
  // Candidate active cases for duplicate detection (same category, not closed or rejected)
  const activeCandidates = INCIDENTS_STORE.filter(
    (c) =>
      c.category === input.category &&
      c.status !== 'REJECTED' &&
      c.status !== 'CLOSED'
  );

  let nearestCase: ConsolidatedIncident | null = null;
  let minDistance = Infinity;

  // Threshold: EXACT 20 meters for POTHOLE (and same rule for other localized hazards)
  const DUPLICATE_RADIUS_METERS = 20.0;

  for (const candidate of activeCandidates) {
    const dist = calculateHaversineDistanceMeters(
      input.coordinates.lat,
      input.coordinates.lng,
      candidate.coordinates.lat,
      candidate.coordinates.lng
    );

    if (dist <= DUPLICATE_RADIUS_METERS && dist < minDistance) {
      minDistance = dist;
      nearestCase = candidate;
    }
  }

  const userId = input.userId || 'usr-anon';
  const userName = input.userName || 'Citizen Reporter';

  const individualReport: ContributionReport = {
    id: `RPT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId,
    userName,
    userEmail: input.userEmail,
    userPhone: input.userPhone,
    photoUrl: input.photoUrl,
    description: input.description,
    coordinates: input.coordinates,
    submittedAt: new Date().toISOString(),
    moderation: { status: 'PENDING' }
  };

  if (nearestCase) {
    // ATTACH TO EXISTING CONSOLIDATED CASE
    nearestCase.reportCount += 1;
    nearestCase.evidenceReports.push(individualReport);
    nearestCase.priorityScore = Math.min(99, nearestCase.priorityScore + 4);
    if (!nearestCase.priorityReasons.some((r) => r.includes('duplicate citizen reports'))) {
      nearestCase.priorityReasons.unshift(`Merged duplicate citizen reports (${nearestCase.reportCount} nearby confirmations)`);
    }
    nearestCase.updatedAt = new Date().toISOString();
    nearestCase.auditTrail.push({
      id: `AUD-${Date.now()}`,
      action: 'DUPLICATE_MERGED',
      actorId: userId,
      actorName: userName,
      details: `Citizen report auto-merged at ${minDistance.toFixed(1)}m from primary case`,
      timestamp: new Date().toISOString()
    });

    return {
      incident: nearestCase,
      isDuplicateJoined: true,
      distanceMeters: Math.round(minDistance)
    };
  }

  // CREATE NEW CONSOLIDATED INCIDENT
  const categoryLabels: Record<string, { en: string; hi: string; baseScore: number }> = {
    POTHOLE: { en: 'Dangerous Pothole', hi: 'सड़क का गड्ढा', baseScore: 55 },
    OPEN_WIRE: { en: 'Open Electrical Wire', hi: 'खुला बिजली का तार', baseScore: 85 },
    OPEN_MANHOLE: { en: 'Open Manhole', hi: 'खुला मैनहोल', baseScore: 80 },
    GARBAGE: { en: 'Garbage Dump', hi: 'कचरा / अवैध डंप', baseScore: 40 },
    WATER_LEAKAGE: { en: 'Water Pipe Leakage', hi: 'पानी की पाइप लीकेज', baseScore: 50 },
    BROKEN_STREETLIGHT: { en: 'Broken Streetlight', hi: 'टूटी स्ट्रीटलाइट', baseScore: 45 }
  };

  const meta = categoryLabels[input.category] || { en: 'Civic Hazard', hi: 'नागरिक समस्या', baseScore: 50 };
  let score = meta.baseScore;
  const reasons: string[] = [];

  if (input.isUrgentHazard) {
    score += 15;
    reasons.push('High-risk immediate safety concern flagged by citizen');
  }

  const loc = input.locationName.toLowerCase();
  if (loc.includes('school') || loc.includes('hospital') || loc.includes('metro') || loc.includes('dps')) {
    score += 12;
    reasons.push('Pedestrian vulnerable zone (School / Hospital / Metro corridor)');
  }
  if (loc.includes('highway') || loc.includes('ring road') || loc.includes('flyover') || loc.includes('junction')) {
    score += 10;
    reasons.push('Major transit highway / arterial commuter route');
  }

  score = Math.min(99, Math.max(20, score));

  let priorityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM';
  if (score >= 85) priorityLevel = 'CRITICAL';
  else if (score >= 70) priorityLevel = 'HIGH';
  else if (score >= 45) priorityLevel = 'MEDIUM';
  else priorityLevel = 'LOW';

  const newId = `CASE-${Math.floor(100 + Math.random() * 900)}`;
  const cityCode = (input.city.substring(0, 3) || 'IND').toUpperCase();
  const trackingCode = `CP-${cityCode}-${Math.floor(1000 + Math.random() * 9000)}`;

  const newCase: ConsolidatedIncident = {
    id: newId,
    trackingCode,
    category: input.category,
    categoryLabelEn: meta.en,
    categoryLabelHi: meta.hi,
    city: input.city,
    locationName: input.locationName,
    coordinates: input.coordinates,
    isUrgentHazard: input.isUrgentHazard,
    status: 'NEW', // Lifecycle starting state
    priorityLevel,
    priorityScore: score,
    priorityReasons: reasons.length > 0 ? reasons : ['Analyzed by CivicPulse Prioritisation Engine'],
    approvedPhotoUrl: input.photoUrl,
    approvedDescription: input.description,
    reportCount: 1,
    evidenceReports: [individualReport],
    workUpdates: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    auditTrail: [
      {
        id: `AUD-${Date.now()}`,
        action: 'SUBMITTED',
        actorId: userId,
        actorName: userName,
        details: 'Initial report submitted via Citizen Hazard Portal',
        timestamp: new Date().toISOString()
      }
    ]
  };

  INCIDENTS_STORE.unshift(newCase);

  return {
    incident: newCase,
    isDuplicateJoined: false
  };
}

// Administrator Action Handlers
export async function updateIncidentStatus(
  id: string,
  newStatus: ConsolidatedIncident['status'],
  actor: { id: string; name: string },
  reasonOrNotes?: string
): Promise<ConsolidatedIncident | null> {
  const item = INCIDENTS_STORE.find((c) => c.id === id);
  if (!item) return null;

  item.status = newStatus;
  item.updatedAt = new Date().toISOString();
  if (newStatus === 'CLOSED') {
    item.closedAt = new Date().toISOString();
  }

  item.auditTrail.push({
    id: `AUD-${Date.now()}`,
    action: `STATUS_${newStatus}`,
    actorId: actor.id,
    actorName: actor.name,
    details: reasonOrNotes || `Status updated to ${newStatus}`,
    timestamp: new Date().toISOString()
  });

  return { ...item };
}

export async function updateIncidentPriority(
  id: string,
  level: ConsolidatedIncident['priorityLevel'],
  actor: { id: string; name: string },
  reason: string
): Promise<ConsolidatedIncident | null> {
  const item = INCIDENTS_STORE.find((c) => c.id === id);
  if (!item) return null;

  item.priorityLevel = level;
  item.manualPriorityOverride = true;
  if (level === 'CRITICAL') item.priorityScore = 95;
  else if (level === 'HIGH') item.priorityScore = 78;
  else if (level === 'MEDIUM') item.priorityScore = 55;
  else item.priorityScore = 35;

  item.priorityReasons.unshift(`Manual Override by ${actor.name}: ${reason}`);
  item.updatedAt = new Date().toISOString();

  item.auditTrail.push({
    id: `AUD-${Date.now()}`,
    action: 'PRIORITY_OVERRIDE',
    actorId: actor.id,
    actorName: actor.name,
    details: `Priority changed to ${level} - ${reason}`,
    timestamp: new Date().toISOString()
  });

  return { ...item };
}

export async function assignIncidentToTeam(
  id: string,
  teamId: string,
  teamName: string,
  actor: { id: string; name: string }
): Promise<ConsolidatedIncident | null> {
  const item = INCIDENTS_STORE.find((c) => c.id === id);
  if (!item) return null;

  item.assignedTeamId = teamId;
  item.assignedTeamName = teamName;
  item.assignedAt = new Date().toISOString();
  item.status = 'ASSIGNED';
  item.updatedAt = new Date().toISOString();

  item.auditTrail.push({
    id: `AUD-${Date.now()}`,
    action: 'TEAM_ASSIGNMENT',
    actorId: actor.id,
    actorName: actor.name,
    details: `Assigned to ${teamName} (${teamId})`,
    timestamp: new Date().toISOString()
  });

  return { ...item };
}

export async function resolveIncidentProof(
  id: string,
  afterPhotoUrl: string,
  remarks: string,
  officerName: string
): Promise<ConsolidatedIncident | null> {
  const item = INCIDENTS_STORE.find((c) => c.id === id);
  if (!item) return null;

  item.status = 'RESOLVED';
  item.resolvedAt = new Date().toISOString();
  item.resolvedAfterPhotoUrl = afterPhotoUrl;
  item.resolutionRemarks = remarks;
  item.resolvedByOfficer = officerName;
  item.updatedAt = new Date().toISOString();

  item.auditTrail.push({
    id: `AUD-${Date.now()}`,
    action: 'RESOLVED_WITH_PROOF',
    actorId: 'OFFICER',
    actorName: officerName,
    details: `Resolved with after-photo verification proof: ${remarks}`,
    timestamp: new Date().toISOString()
  });

  return { ...item };
}

export async function getUserSubmissions(userId: string): Promise<ConsolidatedIncident[]> {
  return INCIDENTS_STORE.filter((c) =>
    c.evidenceReports.some((r) => r.userId === userId)
  );
}
