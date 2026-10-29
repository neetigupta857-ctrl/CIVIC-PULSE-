/**
 * CivicPulse Incident & Lifecycle Management Domain Types
 */

export type IssueCategory =
  | 'POTHOLE'
  | 'OPEN_WIRE'
  | 'OPEN_MANHOLE'
  | 'GARBAGE'
  | 'WATER_LEAKAGE'
  | 'BROKEN_STREETLIGHT';

// Standard 7-state Lifecycle plus backward-compatible legacy statuses
export type IncidentStatus =
  | 'NEW'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REJECTED'
  | 'PUBLISHED_ACTIVE'
  | 'PENDING_APPROVAL';

export type PriorityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface ModerationDecision {
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  moderatedAt?: string;
  moderatedBy?: string;
  reason?: string;
}

export interface ContributionReport {
  id: string; // e.g. "RPT-001"
  userId: string;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  photoUrl: string;
  description: string;
  coordinates: Coordinates;
  submittedAt: string;
  moderation: ModerationDecision;
}

export interface WorkUpdate {
  id: string;
  teamId: string;
  teamName: string;
  note: string;
  photoUrl?: string;
  timestamp: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  actorId: string;
  actorName: string;
  details: string;
  timestamp: string;
}

export interface ConsolidatedIncident {
  id: string; // e.g. "CASE-101"
  trackingCode: string; // e.g. "CP-IND-8821"
  category: IssueCategory;
  categoryLabelEn: string;
  categoryLabelHi: string;
  city: string;
  locationName: string;
  coordinates: Coordinates;
  isUrgentHazard: boolean;

  // Lifecycle
  status: IncidentStatus;
  priorityLevel: PriorityLevel;
  priorityScore: number; // 0 - 100
  priorityReasons: string[];
  manualPriorityOverride?: boolean;

  // Moderation & Evidence
  approvedPhotoUrl?: string;
  approvedDescription: string;
  evidenceReports: ContributionReport[]; // Individual private citizen reports
  reportCount: number;

  // Assignment & Repair
  assignedTeamId?: string;
  assignedTeamName?: string;
  assignedAt?: string;
  workUpdates: WorkUpdate[];

  // Resolution & Proof
  resolvedAt?: string;
  resolvedAfterPhotoUrl?: string;
  resolutionRemarks?: string;
  resolvedByOfficer?: string;

  // Dates & Auditing
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  auditTrail: AuditLogEntry[];

  // Backward-compatibility legacy fields
  description?: string;
  citizenPhotoUrl?: string;
  reporterName?: string;
  reporterPhone?: string;
  reasons?: string[];
  afterPhotoUrl?: string;
  mergedDuplicateCount?: number;
}

export interface CreateReportInput {
  category: IssueCategory;
  description: string;
  city: string;
  locationName: string;
  coordinates: Coordinates;
  isUrgentHazard: boolean;
  photoUrl: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;

  // Backward-compatibility
  citizenPhotoUrl?: string;
  reporterName?: string;
  reporterPhone?: string;
}

// Public-safe sanitized response for Map and Public Tracker
export interface PublicIncidentView {
  id: string;
  trackingCode: string;
  category: IssueCategory;
  categoryLabelEn: string;
  categoryLabelHi: string;
  city: string;
  locationName: string;
  coordinates: Coordinates;
  status: IncidentStatus;
  priorityLevel: PriorityLevel;
  priorityScore: number;
  priorityReasons: string[];
  approvedPhotoUrl?: string;
  approvedDescription: string;
  reportCount: number;
  resolvedAt?: string;
  resolvedAfterPhotoUrl?: string;
  resolutionRemarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  id: string;
  role: 'CITIZEN' | 'ADMIN' | 'REPAIR_TEAM';
  name: string;
  email?: string;
  avatarUrl?: string;
  phone?: string;
  badge?: string;
  teamId?: string;
}

// Backward-compatibility legacy IncidentReport interface
export interface LegacyIncidentReport {
  id: string;
  trackingCode: string;
  category: IssueCategory;
  categoryLabelEn: string;
  categoryLabelHi: string;
  description: string;
  city: string;
  locationName: string;
  coordinates: Coordinates;
  isUrgentHazard: boolean;
  citizenPhotoUrl: string;
  status: IncidentStatus;
  createdAt: string;
  reporterName?: string;
  reporterPhone?: string;
  priorityScore: number;
  reasons: string[];
  mergedDuplicateCount: number;
  resolvedAt?: string;
  afterPhotoUrl?: string;
  resolutionRemarks?: string;
  resolvedByOfficer?: string;
}

export type IncidentReport = LegacyIncidentReport;
export type CreateReportDTO = CreateReportInput;

