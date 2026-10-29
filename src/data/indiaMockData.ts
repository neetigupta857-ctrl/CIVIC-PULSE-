import { IncidentReport } from '../types/incident';

export const INITIAL_INDIA_INCIDENTS: IncidentReport[] = [
  {
    id: 'IND-101',
    trackingCode: 'CP-IND-8821',
    category: 'OPEN_WIRE',
    categoryLabelEn: 'Open Electrical Wire',
    categoryLabelHi: 'खुला बिजली का तार',
    description: 'High voltage live wire hanging loose near primary school boundary and bus stop.',
    city: 'New Delhi',
    locationName: 'Near DPS Mathura Road / Lajpat Nagar Ring Road, New Delhi',
    coordinates: { lat: 28.5983, lng: 77.2435 },
    isUrgentHazard: true,
    citizenPhotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=700&q=80',
    status: 'PUBLISHED_ACTIVE',
    createdAt: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    reporterName: 'Amit Saxena',
    reporterPhone: '+91 98110 11223',
    priorityScore: 96,
    reasons: [
      '⚡ High-voltage live hazard near school zone (<80m)',
      '🚶 Heavy commuter footfall corridor (Ring Road)',
      '⚠️ Immediate electrocution risk flagged by citizen'
    ],
    mergedDuplicateCount: 6
  },
  {
    id: 'IND-102',
    trackingCode: 'CP-IND-4419',
    category: 'OPEN_MANHOLE',
    categoryLabelEn: 'Open Manhole',
    categoryLabelHi: 'खुला मैनहोल',
    description: 'Deep municipal stormwater manhole cover missing on curve. Multiple bikers nearly plunged in.',
    city: 'Bengaluru',
    locationName: 'Outer Ring Road, Near Ecospace Flyover, Bellandur, Bengaluru',
    coordinates: { lat: 12.9260, lng: 77.6834 },
    isUrgentHazard: true,
    citizenPhotoUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=700&q=80',
    status: 'PUBLISHED_ACTIVE',
    createdAt: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    reporterName: 'Pooja Verma',
    priorityScore: 91,
    reasons: [
      '🕳️ Severe accident hazard on high-speed tech corridor (ORR)',
      '🌧️ Monsoonal waterlogging hides open cavity',
      '📈 5 duplicate reports merged from office commuters'
    ],
    mergedDuplicateCount: 5
  },
  {
    id: 'IND-103',
    trackingCode: 'CP-IND-9042',
    category: 'POTHOLE',
    categoryLabelEn: 'Dangerous Pothole',
    categoryLabelHi: 'बड़ा गड्ढा',
    description: 'Huge crater across two lanes under the metro construction segment causing extreme congestion.',
    city: 'Mumbai',
    locationName: 'Western Express Highway, Andheri East (Near WEH Metro), Mumbai',
    coordinates: { lat: 19.1197, lng: 72.8564 },
    isUrgentHazard: false,
    citizenPhotoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=700&q=80',
    status: 'PUBLISHED_ACTIVE',
    createdAt: new Date(Date.now() - 1000 * 60 * 700).toISOString(),
    reporterName: 'Rajesh Srivastava',
    priorityScore: 84,
    reasons: [
      '🚗 Major metropolitan arterial corridor (WEH)',
      '⚠️ Two-wheeler skid risk under flyover descent'
    ],
    mergedDuplicateCount: 4
  },
  {
    id: 'IND-104',
    trackingCode: 'CP-IND-4802',
    category: 'GARBAGE',
    categoryLabelEn: 'Illegal Overflowing Garbage',
    categoryLabelHi: 'कचरा / अवैध डंप',
    description: 'Massive organic waste and medical packaging mound blocking pedestrian walkway and drain.',
    city: 'Hyderabad',
    locationName: 'Gachibowli Stadium Road, Near Bio-Diversity Junction, Hyderabad',
    coordinates: { lat: 17.4401, lng: 78.3489 },
    isUrgentHazard: false,
    citizenPhotoUrl: 'https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=700&q=80',
    status: 'PENDING_APPROVAL',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    reporterName: 'Mohd. Zeeshan',
    priorityScore: 68,
    reasons: [
      '🦟 Vector-borne disease breeding cluster near residential tech park',
      '🚶 Complete blockage of pedestrian sidewalk'
    ],
    mergedDuplicateCount: 2
  },
  {
    id: 'IND-105',
    trackingCode: 'CP-IND-7734',
    category: 'OPEN_WIRE',
    categoryLabelEn: 'Open Electrical Wire',
    categoryLabelHi: 'खुला बिजली का तार',
    description: 'Sparks observed from junction box mounted at child eye-level on pedestrian footpath.',
    city: 'Lucknow',
    locationName: 'Hazratganj Main Market (Opp. Cathedral School), Lucknow',
    coordinates: { lat: 26.8504, lng: 80.9497 },
    isUrgentHazard: true,
    citizenPhotoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=700&q=80',
    status: 'PENDING_APPROVAL',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    reporterName: 'Neeraj Kashyap',
    priorityScore: 93,
    reasons: [
      '⚡ Active sparking reported near major public transit terminal',
      '🎓 Educational institute entrance (<50m to Cathedral School)'
    ],
    mergedDuplicateCount: 2
  },
  {
    id: 'IND-106',
    trackingCode: 'CP-IND-1102',
    category: 'POTHOLE',
    categoryLabelEn: 'Dangerous Pothole',
    categoryLabelHi: 'बड़ा गड्ढा',
    description: 'Sharp-edged road cavity on flyover descent right after the turn.',
    city: 'Jaipur',
    locationName: 'Tonk Road, Near SMS Hospital Circle, Jaipur',
    coordinates: { lat: 26.8928, lng: 75.8156 },
    isUrgentHazard: false,
    citizenPhotoUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=700&q=80',
    status: 'RESOLVED',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    afterPhotoUrl: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=700&q=80',
    resolutionRemarks: 'Quick-mix hot bitumen patching completed by Municipal Rapid Highway Response Crew Team 4.',
    resolvedByOfficer: 'Er. S. N. Sharma (Zonal Exec. Engineer)',
    reporterName: 'Dr. S. K. Rastogi',
    priorityScore: 75,
    reasons: ['Repaired & Verified on site within 16 hrs SLA target'],
    mergedDuplicateCount: 3
  }
];

export { ALL_INDIAN_CITIES, MAJOR_INDIAN_CITIES } from './indianCities';

export const POPULAR_INDIAN_SPOTS = [
  { name: 'Mathura Road (Near DPS), New Delhi', city: 'New Delhi', lat: 28.5983, lng: 77.2435 },
  { name: 'Outer Ring Road, Bellandur, Bengaluru', city: 'Bengaluru', lat: 12.9260, lng: 77.6834 },
  { name: 'Western Express Highway, Andheri, Mumbai', city: 'Mumbai', lat: 19.1197, lng: 72.8564 },
  { name: 'Gachibowli Junction, Hyderabad', city: 'Hyderabad', lat: 17.4401, lng: 78.3489 },
  { name: 'MG Road, Hazratganj, Lucknow', city: 'Lucknow', lat: 26.8467, lng: 80.9461 },
  { name: 'Tonk Road (Near SMS Hospital), Jaipur', city: 'Jaipur', lat: 26.8928, lng: 75.8156 },
  { name: 'FC Road / Shivajinagar, Pune', city: 'Pune', lat: 18.5314, lng: 73.8446 },
  { name: 'Park Street, Kolkata', city: 'Kolkata', lat: 22.5511, lng: 88.3524 }
];
