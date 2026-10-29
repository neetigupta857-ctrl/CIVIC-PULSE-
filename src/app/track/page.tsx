'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import LeafletMap from '@/components/LeafletMap';
import { Search, Filter, MapPin, AlertTriangle, CheckCircle2, Clock, ChevronRight, Layers } from 'lucide-react';
import { PublicIncidentView } from '@/types/incident';
import { useApp } from '@/context/AppContext';
import { gsap } from '@/lib/gsap';

export default function TrackListPage() {
  const { lang, t } = useApp();
  const [incidents, setIncidents] = useState<PublicIncidentView[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  useEffect(() => {
    fetch('/api/public/incidents')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.incidents) {
          setIncidents(data.incidents);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = incidents.filter((item) => {
    const matchCat = categoryFilter === 'ALL' || item.category === categoryFilter;
    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchPriority = priorityFilter === 'ALL' || item.priorityLevel === priorityFilter;
    const matchQuery =
      item.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchStatus && matchPriority && matchQuery;
  });

  const mapPins = filtered.map((i) => ({
    id: i.id,
    lat: i.coordinates.lat,
    lng: i.coordinates.lng,
    title: `${i.categoryLabelEn}: ${i.locationName} (#${i.priorityScore} Pts)`,
    priorityScore: i.priorityScore,
    status: i.status,
    category: i.category
  }));

  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading || filtered.length === 0 || !gridRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      gridRef.current.children,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.35, stagger: 0.05, ease: 'power2.out' }
    );
  }, [loading, categoryFilter, statusFilter, priorityFilter, searchQuery]);

  return (
    <div className="py-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2 border-b border-[#C7AF99] pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFCCB9] text-[#211B17] text-xs font-bold border border-[#C7AF99]">
          <Layers className="w-3.5 h-3.5 text-[#896648]" />
          <span>{t.trackerBadge}</span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-[#211B17]">
          {t.trackerHeading}
        </h1>
        <p className="text-xs text-[#554940]">
          {t.trackerSub}
        </p>
      </div>

      {/* Interactive Public Map */}
      <div className="rounded-3xl overflow-hidden border border-[#C7AF99] shadow-xs">
        <LeafletMap pins={mapPins} heightClass="h-[380px]" />
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-[#896648] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#C7AF99] bg-[#F5EDE4] text-[#211B17] text-xs placeholder:text-[#554940] focus:outline-none focus:ring-2 focus:ring-[#896648]"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-[#DFCCB9] p-1 rounded-xl border border-[#C7AF99] text-xs font-semibold overflow-x-auto">
            {['ALL', 'POTHOLE', 'OPEN_WIRE', 'OPEN_MANHOLE', 'GARBAGE', 'WATER_LEAKAGE'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${categoryFilter === cat
                  ? 'bg-[#896648] text-white shadow-2xs font-bold'
                  : 'text-[#554940] hover:text-[#211B17]'
                  }`}
              >
                {cat === 'ALL'
                  ? t.allHazards
                  : cat === 'POTHOLE'
                    ? (lang === 'hi' ? 'सड़क का गड्ढा' : 'Pothole')
                    : cat === 'OPEN_WIRE'
                      ? (lang === 'hi' ? 'खुला तार' : 'Open Wire')
                      : cat === 'OPEN_MANHOLE'
                        ? (lang === 'hi' ? 'खुला मैनहोल' : 'Open Manhole')
                        : cat === 'GARBAGE'
                          ? (lang === 'hi' ? 'कचरा डंप' : 'Garbage')
                          : (lang === 'hi' ? 'नाली/लीकेज' : 'Water Leak')}
              </button>
            ))}
          </div>
        </div>

        {/* Status and Priority Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-2.5 rounded-xl bg-[#DFCCB9]/70 border border-[#C7AF99] text-xs">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-[#554940] mr-1 uppercase tracking-wider">Status:</span>
            {[
              { id: 'ALL', label: 'All Status' },
              { id: 'NEW', label: 'New' },
              { id: 'APPROVED', label: 'Approved' },
              { id: 'ASSIGNED', label: 'Assigned' },
              { id: 'IN_PROGRESS', label: 'In Repair' },
              { id: 'RESOLVED', label: 'Resolved' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${statusFilter === st.id
                  ? 'bg-[#896648] text-white shadow-2xs'
                  : 'bg-[#F5EDE4] text-[#554940] hover:text-[#211B17] border border-[#C7AF99]/50'
                  }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Priority Level Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-[#554940] mr-1 uppercase tracking-wider">Priority:</span>
            {[
              { id: 'ALL', label: 'All Levels' },
              { id: 'CRITICAL', label: 'Critical' },
              { id: 'HIGH', label: 'High' },
              { id: 'MEDIUM', label: 'Medium' },
              { id: 'LOW', label: 'Low' },
            ].map((pr) => (
              <button
                key={pr.id}
                onClick={() => setPriorityFilter(pr.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${priorityFilter === pr.id
                  ? 'bg-[#896648] text-white shadow-2xs'
                  : 'bg-[#F5EDE4] text-[#554940] hover:text-[#211B17] border border-[#C7AF99]/50'
                  }`}
              >
                {pr.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Incident Cards Grid */}
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-xs text-[#554940]">{t.loadingLedger}</div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full py-12 text-center text-xs text-[#554940]">{t.noMatchingComplaints}</div>
        ) : (
          filtered.map((item) => (
            <Link
              key={item.id}
              href={`/track/${encodeURIComponent(item.trackingCode)}`}
              className="p-5 rounded-2xl bg-[#F5EDE4] border border-[#C7AF99] hover:border-[#896648] hover:shadow-xs transition-all space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#6F4F36]">{item.trackingCode}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-[#DFCCB9] text-[#211B17]">
                  {item.status}
                </span>
              </div>

              <div className="font-heading text-base font-bold text-[#211B17] group-hover:text-[#896648] transition-colors line-clamp-1">
                {item.locationName}
              </div>

              <p className="text-xs text-[#554940] line-clamp-2">
                {item.approvedDescription}
              </p>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-[#C7AF99] text-[#554940]">
                <span>{item.city}</span>
                <div className="flex items-center gap-1.5 font-bold text-[#896648]">
                  <span>{t.trackProgress}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
