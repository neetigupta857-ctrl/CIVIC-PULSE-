'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  MapPin,
  TrendingUp,
  RotateCcw,
  UserCheck,
  Search,
  Filter,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  Eye,
  Camera
} from 'lucide-react';
import { ConsolidatedIncident } from '@/types/incident';

export default function AdminWorkspacePage() {
  const { user } = useApp();
  const [incidents, setIncidents] = useState<ConsolidatedIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedIncident, setSelectedIncident] = useState<ConsolidatedIncident | null>(null);

  // Resolution Modal State
  const [resolutionRemarks, setResolutionRemarks] = useState('');
  const [resolutionPhoto, setResolutionPhoto] = useState(
    'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=600&q=80'
  );
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/incidents');
      const data = await res.json();
      if (data.success && data.incidents) {
        setIncidents(data.incidents);
        if (data.incidents.length > 0 && !selectedIncident) {
          setSelectedIncident(data.incidents[0]);
        }
      }
    } catch (e) {
      console.error('Failed to load admin incidents:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string, payload: any) => {
    if (!selectedIncident) return;
    setIsSubmittingAction(true);
    try {
      const res = await fetch('/api/admin/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          incidentId: selectedIncident.id,
          ...payload
        })
      });
      const data = await res.json();
      if (data.success && data.incident) {
        setSelectedIncident(data.incident);
        await fetchIncidents();
      }
    } catch (e) {
      console.error('Admin action failed:', e);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  // Metrics
  const totalCases = incidents.length;
  const newCases = incidents.filter((i) => i.status === 'NEW').length;
  const approvedCases = incidents.filter((i) => i.status === 'APPROVED').length;
  const inProgressCases = incidents.filter((i) => ['ASSIGNED', 'IN_PROGRESS'].includes(i.status)).length;
  const resolvedCases = incidents.filter((i) => ['RESOLVED', 'CLOSED'].includes(i.status)).length;
  const totalContributions = incidents.reduce((acc, i) => acc + (i.reportCount || 1), 0);

  const filteredIncidents = incidents.filter((i) => {
    if (statusFilter === 'ALL') return true;
    return i.status === statusFilter;
  });

  return (
    <div className="py-6 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#C7AF99] pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFCCB9] text-[#211B17] text-xs font-bold border border-[#C7AF99]">
            <ShieldAlert className="w-3.5 h-3.5 text-[#896648]" />
            <span>MUNICIPAL OPERATIONS COMMAND</span>
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-[#211B17] tracking-tight mt-1">
            Civil Hazard Operations Workspace
          </h1>
          <p className="text-xs text-[#554940]">
            Audit incoming photo evidence, monitor 20m duplicate clusters, and manage rapid repair dispatch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchIncidents}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#C7AF99] bg-[#F5EDE4] hover:bg-[#DFCCB9] text-xs font-semibold text-[#211B17] transition-all shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#896648]" />
            <span>Refresh Workspace</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#F5EDE4] border border-[#C7AF99] space-y-1 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-[#6F4F36]">Total Cases</span>
          <div className="font-heading text-2xl font-black text-[#211B17]">{totalCases}</div>
          <div className="text-[10px] text-[#554940]">{totalContributions} citizen submissions</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-amber-800">Pending Review</span>
          <div className="font-heading text-2xl font-black text-amber-900">{newCases}</div>
          <div className="text-[10px] text-amber-700">Needs photo approval</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#DFCCB9] border border-[#C7AF99] space-y-1 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-[#211B17]">Approved</span>
          <div className="font-heading text-2xl font-black text-[#211B17]">{approvedCases}</div>
          <div className="text-[10px] text-[#554940]">Ready for dispatch</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 space-y-1 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-sky-800">In Field Work</span>
          <div className="font-heading text-2xl font-black text-sky-900">{inProgressCases}</div>
          <div className="text-[10px] text-sky-700">Crews active on site</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-emerald-800">Resolved / Closed</span>
          <div className="font-heading text-2xl font-black text-emerald-900">{resolvedCases}</div>
          <div className="text-[10px] text-emerald-700">Verified with after-photo</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#E8D9CB] border border-[#C7AF99] space-y-1 shadow-2xs">
          <span className="text-[10px] uppercase font-bold text-[#6F4F36]">Avg Fix Time</span>
          <div className="font-heading text-2xl font-black text-[#211B17]">18.4 hrs</div>
          <div className="text-[10px] text-[#554940]">Potholes & hazards</div>
        </div>
      </div>

      {/* Main Workspace Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Filterable Complaints Queue (5 cols) */}
        <div className="lg:col-span-5 bg-[#F5EDE4] border border-[#C7AF99] rounded-3xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-base font-bold text-[#211B17] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#896648]" />
              <span>Complaints Audit Queue</span>
            </h2>
            <span className="text-xs text-[#554940] font-semibold">{filteredIncidents.length} Records</span>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1 bg-[#E8D9CB] rounded-xl border border-[#C7AF99] text-xs font-semibold">
            {['ALL', 'NEW', 'APPROVED', 'IN_PROGRESS', 'RESOLVED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  statusFilter === st
                    ? 'bg-[#896648] text-white shadow-2xs'
                    : 'text-[#554940] hover:text-[#211B17]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Incident List */}
          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredIncidents.length === 0 ? (
              <div className="text-center py-12 text-xs text-[#554940]">No complaints in this queue view.</div>
            ) : (
              filteredIncidents.map((item) => {
                const isSelected = selectedIncident?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedIncident(item)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-[#DFCCB9] border-[#896648] shadow-xs ring-1 ring-[#896648]'
                        : 'bg-[#F5EDE4] hover:bg-[#E8D9CB] border-[#C7AF99]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#6F4F36]">{item.trackingCode}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        item.status === 'NEW' ? 'bg-amber-100 text-amber-800' :
                        item.status === 'APPROVED' ? 'bg-[#DFCCB9] text-[#211B17]' :
                        item.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-sky-100 text-sky-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <div className="font-heading text-sm font-bold text-[#211B17] line-clamp-1">
                      {item.locationName}
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#554940]">
                      <span className="font-semibold text-[#896648]">{item.categoryLabelEn}</span>
                      <div className="flex items-center gap-2">
                        {item.reportCount > 1 && (
                          <span className="px-1.5 py-0.2 rounded bg-[#C7AF99] text-[#211B17] text-[10px] font-bold">
                            {item.reportCount} reports
                          </span>
                        )}
                        <span className="font-bold text-[#211B17]">Score: {item.priorityScore}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Detailed Case Review & Operations Controls (7 cols) */}
        <div className="lg:col-span-7 bg-[#F5EDE4] border border-[#C7AF99] rounded-3xl p-6 space-y-6 shadow-xs">
          {selectedIncident ? (
            <>
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#C7AF99] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-extrabold text-[#6F4F36] bg-[#E8D9CB] px-2 py-0.5 rounded border border-[#C7AF99]">
                      Case ID: {selectedIncident.id} ({selectedIncident.trackingCode})
                    </span>
                    <span className="text-xs font-bold text-[#896648] uppercase">
                      {selectedIncident.categoryLabelEn}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-[#211B17] mt-1">
                    {selectedIncident.locationName}
                  </h3>
                  <div className="text-xs text-[#554940] flex items-center gap-2 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#896648]" />
                    <span>GPS: {selectedIncident.coordinates.lat}, {selectedIncident.coordinates.lng} ({selectedIncident.city})</span>
                  </div>
                </div>

                {/* Priority Selector */}
                <div className="text-right space-y-1">
                  <div className="text-[10px] font-bold uppercase text-[#554940]">Priority Level</div>
                  <div className="inline-flex items-center gap-1 bg-[#E8D9CB] p-1 rounded-xl border border-[#C7AF99]">
                    {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map((level) => (
                      <button
                        key={level}
                        disabled={isSubmittingAction}
                        onClick={() => handleAction('UPDATE_PRIORITY', { priorityLevel: level, reason: 'Manual review' })}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
                          selectedIncident.priorityLevel === level
                            ? 'bg-[#896648] text-white shadow-2xs'
                            : 'text-[#554940] hover:text-[#211B17]'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Photos & Evidence Comparison */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#211B17]">
                  Photographic Evidence & Site Audit
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-[#554940]">Citizen Uploaded Photo:</span>
                    <div className="h-48 rounded-2xl overflow-hidden border border-[#C7AF99] bg-[#E8D9CB]">
                      <img
                        src={selectedIncident.approvedPhotoUrl || selectedIncident.evidenceReports[0]?.photoUrl}
                        alt="Hazard proof"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-xs font-semibold text-[#554940]">Verified Repair Proof:</span>
                    {selectedIncident.resolvedAfterPhotoUrl ? (
                      <div className="h-48 rounded-2xl overflow-hidden border border-emerald-400 bg-emerald-50">
                        <img
                          src={selectedIncident.resolvedAfterPhotoUrl}
                          alt="After repair proof"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-48 rounded-2xl border border-dashed border-[#C7AF99] bg-[#E8D9CB]/50 flex flex-col items-center justify-center text-[#554940] text-xs p-4 text-center">
                        <Camera className="w-6 h-6 text-[#896648] mb-1 opacity-60" />
                        <span>Awaiting field repair closure photo.</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Moderation & Lifecycle Actions */}
              <div className="p-4 rounded-2xl bg-[#E8D9CB] border border-[#C7AF99] space-y-3">
                <h4 className="text-xs font-bold uppercase text-[#211B17]">Lifecycle Action Dispatch</h4>
                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={isSubmittingAction || selectedIncident.status === 'APPROVED'}
                    onClick={() => handleAction('UPDATE_STATUS', { status: 'APPROVED', reason: 'Verified photo evidence' })}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#896648] hover:bg-[#6F4F36] text-white text-xs font-bold shadow-xs disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve Complaint</span>
                  </button>

                  <button
                    disabled={isSubmittingAction || selectedIncident.status === 'IN_PROGRESS'}
                    onClick={() =>
                      handleAction('ASSIGN_TEAM', {
                        teamId: 'TEAM-PWD-LKO',
                        teamName: 'Zonal Emergency Asphalt Unit'
                      })
                    }
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#211B17] hover:bg-[#3D352F] text-[#F5EDE4] text-xs font-bold shadow-xs disabled:opacity-50"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Assign Repair Crew</span>
                  </button>

                  <button
                    disabled={isSubmittingAction || selectedIncident.status === 'RESOLVED'}
                    onClick={() =>
                      handleAction('RESOLVE_PROOF', {
                        afterPhotoUrl: resolutionPhoto,
                        remarks: resolutionRemarks || 'Asphalt patching completed and roller-compacted.'
                      })
                    }
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Fixed with Proof</span>
                  </button>

                  <button
                    disabled={isSubmittingAction || selectedIncident.status === 'REJECTED'}
                    onClick={() => handleAction('UPDATE_STATUS', { status: 'REJECTED', reason: 'Invalid civic hazard photo' })}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>

              {/* Private Evidence Reports & Duplicate Audit */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#211B17]">
                    Private Evidence & 20m Nearby Reports ({selectedIncident.evidenceReports.length})
                  </h4>
                  <span className="text-[11px] text-[#896648] font-bold">20-Meter Rule Applied</span>
                </div>

                <div className="space-y-2">
                  {selectedIncident.evidenceReports.map((rpt, idx) => (
                    <div key={rpt.id} className="p-3 rounded-xl bg-[#F5EDE4] border border-[#C7AF99] text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#211B17]">
                          Report #{idx + 1} by {rpt.userName} ({rpt.userEmail || 'Protected'})
                        </span>
                        <span className="text-[10px] text-[#554940]">
                          {new Date(rpt.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[#554940] text-[11px]">{rpt.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-24 text-center text-xs text-[#554940]">Select an incident to view audit details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
