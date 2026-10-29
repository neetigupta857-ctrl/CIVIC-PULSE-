/**
 * BACKEND INTEGRATION HANDOFF:
 * Pan-India API service layer with client-side state/localStorage fallback.
 */

import { IncidentReport, CreateReportDTO } from '../types/incident';
import { INITIAL_INDIA_INCIDENTS } from '../data/indiaMockData';

const STORAGE_KEY = 'civicpulse_india_incidents_v2';

// Seed initial data if not present
function getStoredIncidents(): IncidentReport[] {
  if (typeof window === 'undefined') return INITIAL_INDIA_INCIDENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INDIA_INCIDENTS));
      return INITIAL_INDIA_INCIDENTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read incidents from storage:', err);
    return INITIAL_INDIA_INCIDENTS;
  }
}

function saveStoredIncidents(incidents: IncidentReport[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(incidents));
  } catch (err) {
    console.error('Failed to write incidents to storage:', err);
  }
}

// BACKEND HOOK: GET /api/v1/incidents
export async function getIncidents(): Promise<IncidentReport[]> {
  await new Promise((r) => setTimeout(r, 100)); // snappiness
  return getStoredIncidents();
}

// BACKEND HOOK: GET /api/v1/incidents/ranked
// Returns approved incidents sorted strictly descending by Priority Score (0-100)
export async function getRankedActiveIncidents(filterCity?: string): Promise<IncidentReport[]> {
  const all = await getIncidents();
  return all
    .filter((inc) => {
      const isApproved = inc.status === 'PUBLISHED_ACTIVE';
      if (!isApproved) return false;
      if (!filterCity || filterCity === 'All India (National)') return true;
      return inc.city.toLowerCase() === filterCity.toLowerCase();
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
}

// BACKEND HOOK: GET /api/v1/incidents/pending-approval
// Admin Photo Approval Queue
export async function getPendingApprovalIncidents(filterCity?: string): Promise<IncidentReport[]> {
  const all = await getIncidents();
  return all.filter((inc) => {
    const isPending = inc.status === 'PENDING_APPROVAL';
    if (!isPending) return false;
    if (!filterCity || filterCity === 'All India (National)') return true;
    return inc.city.toLowerCase() === filterCity.toLowerCase();
  });
}

// BACKEND HOOK: GET /api/v1/incidents/track/:trackingCode
export async function getIncidentByTrackingCode(trackingCode: string): Promise<IncidentReport | null> {
  const all = await getIncidents();
  const normalized = trackingCode.trim().toUpperCase();
  const match = all.find(
    (inc) =>
      inc.trackingCode.toUpperCase() === normalized ||
      inc.id.toUpperCase() === normalized
  );
  return match || null;
}

// BACKEND HOOK: POST /api/v1/incidents (Citizen Submission)
export async function createCitizenReport(dto: CreateReportDTO): Promise<IncidentReport> {
  const all = getStoredIncidents();
  
  // Category Label mapping
  const categoryLabels: Record<string, { en: string; hi: string; baseScore: number }> = {
    OPEN_WIRE: { en: 'Open Electrical Wire', hi: 'खुला बिजली का तार', baseScore: 85 },
    OPEN_MANHOLE: { en: 'Open Manhole', hi: 'खुला मैनहोल', baseScore: 80 },
    POTHOLE: { en: 'Pothole', hi: 'सड़क का गड्ढा', baseScore: 50 },
    GARBAGE: { en: 'Garbage Dump', hi: 'कचरा / अवैध डंप', baseScore: 40 },
    WATER_LEAKAGE: { en: 'Water Pipe Leakage', hi: 'पानी की पाइप लीकेज', baseScore: 55 },
    BROKEN_STREETLIGHT: { en: 'Broken Streetlight', hi: 'टूटी स्ट्रीटलाइट', baseScore: 45 },
  };

  const meta = categoryLabels[dto.category] || { en: 'Civic Hazard', hi: 'नागरिक समस्या', baseScore: 50 };
  
  // Dynamic Priority Scoring Algorithm (Matches PPT AI prioritisation logic)
  let score = meta.baseScore;
  const reasons: string[] = [];

  if (dto.isUrgentHazard) {
    score += 15;
    reasons.push('⚠️ Immediate life/safety hazard flagged by citizen');
  }

  // Location heuristics (All-India density context)
  const locLower = dto.locationName.toLowerCase();
  if (locLower.includes('school') || locLower.includes('hospital') || locLower.includes('metro') || locLower.includes('dps')) {
    score += 10;
    reasons.push('🏫 High-risk pedestrian / School / Hospital zone (<100m)');
  }
  if (locLower.includes('highway') || locLower.includes('ring road') || locLower.includes('flyover') || locLower.includes('junction') || locLower.includes('station')) {
    score += 8;
    reasons.push('🚗 Major transit highway / commuter artery');
  }

  score = Math.min(99, Math.max(20, score));

  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const city = dto.city || 'New Delhi';

  const newIncident: IncidentReport = {
    id: `IND-${Math.floor(100 + Math.random() * 900)}`,
    trackingCode: `CP-IND-${randomNum}`,
    category: dto.category,
    categoryLabelEn: meta.en,
    categoryLabelHi: meta.hi,
    description: dto.description,
    city,
    locationName: dto.locationName,
    coordinates: dto.coordinates,
    isUrgentHazard: dto.isUrgentHazard,
    citizenPhotoUrl: dto.citizenPhotoUrl || dto.photoUrl || '',
    status: 'PENDING_APPROVAL', // CRITICAL RULE: Needs Admin Photo Approval first
    createdAt: new Date().toISOString(),
    reporterName: dto.reporterName || 'Concerned Citizen',
    reporterPhone: dto.reporterPhone || '',
    priorityScore: score,
    reasons: reasons.length > 0 ? reasons : ['Analyzed by CivicPulse All-India Priority Engine'],
    mergedDuplicateCount: 1
  };

  const updated = [newIncident, ...all];
  saveStoredIncidents(updated);
  return newIncident;
}

// BACKEND HOOK: PATCH /api/v1/incidents/:id/approve-publish
export async function approveAndPublishIncident(id: string): Promise<IncidentReport | null> {
  const all = getStoredIncidents();
  const index = all.findIndex((i) => i.id === id);
  if (index === -1) return null;

  all[index] = {
    ...all[index],
    status: 'PUBLISHED_ACTIVE'
  };
  saveStoredIncidents(all);
  return all[index];
}

// BACKEND HOOK: PATCH /api/v1/incidents/:id/approve-merge
export async function approveAndMergeDuplicate(id: string, targetMasterId?: string): Promise<IncidentReport | null> {
  const all = getStoredIncidents();
  const index = all.findIndex((i) => i.id === id);
  if (index === -1) return null;

  // Boost priority score and count
  const updatedIncident = {
    ...all[index],
    status: 'PUBLISHED_ACTIVE' as const,
    mergedDuplicateCount: all[index].mergedDuplicateCount + 1,
    priorityScore: Math.min(99, all[index].priorityScore + 6),
    reasons: [
      `📈 Merged duplicate citizen reports (+${(all[index].mergedDuplicateCount || 1) + 1} confirmations)`,
      ...((all[index] as any).priorityReasons || (all[index] as any).reasons || []).filter((r: string) => !r.includes('Merged duplicate'))
    ]
  };

  all[index] = updatedIncident;
  saveStoredIncidents(all);
  return updatedIncident;
}

// BACKEND HOOK: PATCH /api/v1/incidents/:id/reject
export async function rejectIncidentPhoto(id: string, reason?: string): Promise<boolean> {
  const all = getStoredIncidents();
  const index = all.findIndex((i) => i.id === id);
  if (index === -1) return false;

  all[index] = {
    ...all[index],
    status: 'REJECTED',
    reasons: [reason ? `Rejected: ${reason}` : 'Image failed validation / blurred photo']
  };
  saveStoredIncidents(all);
  return true;
}

// BACKEND HOOK: POST /api/v1/incidents/:id/resolve
export async function resolveIncidentWithProof(
  id: string,
  afterPhotoUrl: string,
  remarks: string,
  officerName: string
): Promise<IncidentReport | null> {
  const all = getStoredIncidents();
  const index = all.findIndex((i) => i.id === id);
  if (index === -1) return null;

  all[index] = {
    ...all[index],
    status: 'RESOLVED',
    resolvedAt: new Date().toISOString(),
    afterPhotoUrl,
    resolutionRemarks: remarks || 'Resolved and verified by Municipal Field Rapid Response Unit.',
    resolvedByOfficer: officerName || 'Duty Officer (Civic Rapid Response)'
  };

  saveStoredIncidents(all);
  return all[index];
}

// Reset sample data utility for judges demo testing
export async function resetDemoDataset(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_INDIA_INCIDENTS));
  }
}
