'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import LeafletMap from '@/components/LeafletMap';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  Calendar,
  Layers,
  Search,
  ExternalLink
} from 'lucide-react';
import { PublicIncidentView } from '@/types/incident';
import { useApp } from '@/context/AppContext';

export default function TrackDetailPage({
  params
}: {
  params: Promise<{ code: string }>;
}) {
  const { lang, t } = useApp();
  const unwrappedParams = use(params);
  const code = decodeURIComponent(unwrappedParams.code);

  const [incident, setIncident] = useState<PublicIncidentView | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/public/track/${encodeURIComponent(code)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.incident) {
          setIncident(data.incident);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [code]);

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[#896648] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-[#554940]">Querying National Municipal Audit Ledger...</p>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-[#DFCCB9] text-[#896648] border border-[#C7AF99] flex items-center justify-center mx-auto text-xl font-bold">
          ✕
        </div>
        <h2 className="font-heading text-2xl font-bold text-[#211B17]">
          {t.complaintNotFound}
        </h2>
        <p className="text-xs text-[#554940]">
          {lang === 'hi' ? 'ट्रैकिंग संदर्भ से संबंधित कोई रिकॉर्ड नहीं मिला: ' : 'No approved record found matching tracking reference '}
          <strong className="font-mono text-[#896648]">{code}</strong>.
        </p>
        <Link
          href="/track"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#211B17] text-[#F5EDE4] text-xs font-semibold hover:bg-[#896648] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.backToTracker}</span>
        </Link>
      </div>
    );
  }

  const isResolved = incident.status === 'RESOLVED' || incident.status === 'CLOSED';
  const isApproved = incident.status === 'APPROVED' || incident.status === 'ASSIGNED' || incident.status === 'IN_PROGRESS';

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-8">
      {/* Back Link & Header */}
      <div className="flex items-center justify-between border-b border-[#C7AF99] pb-4">
        <Link
          href="/track"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#554940] hover:text-[#211B17]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.backToTracker}</span>
        </Link>

        <span className="font-mono text-xs px-3 py-1 rounded-xl bg-[#F5EDE4] border border-[#C7AF99] text-[#211B17] font-bold shadow-2xs">
          {t.auditRef} {incident.trackingCode}
        </span>
      </div>

      {/* Status Hero Card */}
      <div className="bg-[#F5EDE4] p-6 sm:p-7 rounded-3xl border border-[#C7AF99] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#896648] uppercase tracking-wide">
                {lang === 'hi' ? incident.categoryLabelHi : incident.categoryLabelEn}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#DFCCB9] border border-[#C7AF99] text-[#211B17] text-[10px] font-bold">
                {incident.city}
              </span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#211B17] mt-0.5">
              {incident.locationName}
            </h1>
            <div className="flex items-center gap-2 text-xs text-[#554940] mt-1">
              <Calendar className="w-3.5 h-3.5 text-[#896648]" />
              <span>{lang === 'hi' ? 'दर्ज दिनांक: ' : 'Reported on '} {new Date(incident.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Status Badge */}
          <div className="text-right">
            {isResolved ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{t.statusResolved}</span>
              </span>
            ) : isApproved ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold border border-sky-300">
                <Clock className="w-4 h-4" />
                <span>{t.statusActive}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
                <Clock className="w-4 h-4" />
                <span>{t.statusReview}</span>
              </span>
            )}
            <div className="text-xs text-[#554940] mt-1">
              {t.priorityWeight} <strong className="text-[#896648]">{incident.priorityScore}/100 ({incident.priorityLevel})</strong>
            </div>
          </div>
        </div>

        {/* 3-Step Audit Timeline */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wide text-[#211B17]">
            {t.auditProgression}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Step 1 */}
            <div className="p-3.5 rounded-2xl border border-[#C7AF99] bg-[#DFCCB9]/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#554940] uppercase">{t.step1CitizenSubmission}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <div className="text-xs font-semibold text-[#211B17]">{t.gpsPhotoLogged}</div>
              <div className="text-[11px] text-[#554940] font-medium">{t.verifiedCitizen}</div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-2xl border border-[#C7AF99] bg-[#DFCCB9]/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#554940] uppercase">{t.step2Screening}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <div className="text-xs font-semibold text-[#211B17]">
                {incident.reportCount > 1 ? `${incident.reportCount} ${t.nearbyConsolidated}` : t.singleReportVerified}
              </div>
              <div className="text-[11px] text-[#554940]">{t.deduplicatedWithin20m}</div>
            </div>

            {/* Step 3 */}
            <div className={`p-3.5 rounded-2xl border space-y-1 ${
              isResolved ? 'border-emerald-300 bg-emerald-50' : 'border-[#C7AF99] bg-[#DFCCB9]/60'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#554940] uppercase">{t.step3SiteFix}</span>
                {isResolved && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
              </div>
              <div className="text-xs font-semibold text-[#211B17]">
                {isResolved ? t.completedAfterPhoto : t.inFieldQueue}
              </div>
              <div className="text-[11px] text-[#554940]">{t.rapidResponseCrew}</div>
            </div>
          </div>
        </div>

        {/* Visual Proof Comparison (Approved Photographs Only) */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wide text-[#211B17]">
            {t.photographicEvidence}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-[#211B17] block">
                {t.siteCondition}
              </span>
              <div className="h-56 rounded-2xl overflow-hidden border border-[#C7AF99] bg-[#E8D9CB]">
                {incident.approvedPhotoUrl ? (
                  <img
                    src={incident.approvedPhotoUrl}
                    alt="Citizen report"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs text-[#554940]">
                    {lang === 'hi' ? 'फोटो सत्यापन प्रक्रिया में है' : 'Photo awaiting moderation'}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-[#211B17] block">
                {t.resolutionVerification}
              </span>
              {incident.resolvedAfterPhotoUrl ? (
                <div className="h-56 rounded-2xl overflow-hidden border border-emerald-400 bg-emerald-50 relative">
                  <img
                    src={incident.resolvedAfterPhotoUrl}
                    alt="Verified fix"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 bg-emerald-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    {t.verifiedAfterPhotoTag}
                  </div>
                </div>
              ) : (
                <div className="h-56 rounded-2xl border border-dashed border-[#C7AF99] bg-[#E8D9CB]/50 flex flex-col items-center justify-center text-center p-4">
                  <Clock className="w-6 h-6 text-[#896648] mb-1 opacity-70" />
                  <p className="text-xs font-semibold text-[#211B17]">{t.repairUnderway}</p>
                  <p className="text-[11px] text-[#554940]">{t.completionEvidenceHint}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Location Map */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wide text-[#211B17]">
            {t.exactLocation}
          </h3>
          <div className="rounded-2xl overflow-hidden border border-[#C7AF99]">
            <LeafletMap
              center={incident.coordinates}
              zoom={15}
              pins={[
                {
                  id: incident.id,
                  lat: incident.coordinates.lat,
                  lng: incident.coordinates.lng,
                  title: `${incident.locationName} (${incident.categoryLabelEn})`,
                  priorityScore: incident.priorityScore,
                  status: incident.status,
                  category: incident.category
                }
              ]}
              heightClass="h-[300px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
