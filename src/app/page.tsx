'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import GoogleAccountChooserModal, { GoogleAccount } from '../components/GoogleAccountChooserModal';
import StatsBand from '@/components/ui/stats-band';
import ChartsPreview from '@/components/ui/charts-demo';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import {
  Camera,
  Search,
  ArrowRight,
  TrendingUp,
  BarChart2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  ShieldCheck,
  CircleAlert,
  Cable,
  Lightbulb,
  Droplets,
  Construction,
  Layers,
  MapPin,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';

export default function HomePage() {
  const { lang, t, isMounted, user, setUser } = useApp();
  const router = useRouter();
  const [trackCode, setTrackCode] = useState('');
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isGoogleChooserOpen, setIsGoogleChooserOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const homeContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!homeContainerRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // 1. Hero entrance animation
      const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      heroTl
        .from('.hero-headline', {
          y: 28,
          opacity: 0,
          duration: 0.8,
          delay: 0.1
        })
        .from(
          '.hero-description',
          {
            y: 18,
            opacity: 0,
            duration: 0.6
          },
          '-=0.4'
        )
        .from(
          '.hero-cta-area',
          {
            y: 16,
            opacity: 0,
            duration: 0.6
          },
          '-=0.3'
        );

      // 2. Slide 2: Insights scroll triggers
      gsap.from('.insights-header', {
        scrollTrigger: {
          trigger: '#insights',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out'
      });

      gsap.from('.stats-band-wrapper', {
        scrollTrigger: {
          trigger: '.stats-band-wrapper',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });

      gsap.from('.insights-charts-grid > div', {
        scrollTrigger: {
          trigger: '.insights-charts-grid',
          start: 'top 82%',
          toggleActions: 'play none none none'
        },
        y: 35,
        opacity: 0,
        duration: 0.7,
        stagger: 0.18,
        ease: 'power2.out'
      });

      gsap.from('.triage-engine-card', {
        scrollTrigger: {
          trigger: '.triage-engine-card',
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
      });

      // 3. Slide 3: How it works scroll triggers
      gsap.from('.how-it-works-header', {
        scrollTrigger: {
          trigger: '#how-it-works',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        y: 26,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out'
      });

      gsap.from('.workflow-stage-card', {
        scrollTrigger: {
          trigger: '.workflow-stages-container',
          start: 'top 80%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 0.75,
        stagger: 0.2,
        ease: 'power2.out'
      });
    }, homeContainerRef);

    return () => ctx.revert();
  }, []);

  const handleReportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      router.push('/citizen');
    } else {
      setAuthError(null);
      setIsAuthModalOpen(true);
    }
  };

  const handleGoogleContinue = () => {
    setIsAuthModalOpen(false);
    setIsGoogleChooserOpen(true);
  };

  const handleAccountChosen = async (account: GoogleAccount) => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: account.name,
          email: account.email,
          googleId: account.googleId,
          avatarUrl: account.avatarUrl
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setIsGoogleChooserOpen(false);
        router.push('/citizen');
      } else {
        throw new Error(data.error || 'Authentication failed');
      }
    } catch (err: any) {
      setAuthError(err?.message || 'Google sign-in could not be completed. Please try again.');
      setIsGoogleChooserOpen(false);
      setIsAuthModalOpen(true);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackCode.trim()) {
      router.push(`/track/${encodeURIComponent(trackCode.trim())}`);
    }
  };

  const handleQuickTrack = (code: string) => {
    router.push(`/track/${encodeURIComponent(code)}`);
  };

  // Bar Chart Data: Yearly Trend for All Road Hazard Casualties (2021 to 2024)
  const barData = [
    { year: '2021', casualties: 3420, heightPercent: 65, color: '#D7CEC5', label: 'Baseline' },
    { year: '2022', casualties: 3980, heightPercent: 76, color: '#D7CEC5', label: 'Baseline' },
    { year: '2023', casualties: 4610, heightPercent: 88, color: '#B45309', label: 'Escalation' },
    { year: '2024', casualties: 5240, heightPercent: 100, color: '#8C6D53', label: 'Peak Surge', isSurge: true }
  ];

  return (
    <div ref={homeContainerRef} className="space-y-6 sm:space-y-8">
      {/* ============================================================ */}
      {/* PART 2 — MINIMAL, ACTION-FOCUSED HERO                        */}
      {/* ============================================================ */}
      <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col justify-center pt-8 sm:pt-14 pb-12 sm:pb-16 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        {/* Seamless Warm Ivory/Champagne Ambient Depth Gradient (blends cleanly into page canvas) */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 90% 65% at 50% 10%, #FAF6F1 0%, rgba(244, 239, 234, 0.75) 55%, transparent 100%)',
          }}
        />

        {/* Subtle Architectural Grid Lines at Periphery (Clean Center, feather-faded) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none opacity-25">
          <svg 
            className="w-full h-full text-[#8C6D53]" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1200 500" 
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="heroCenterClear" cx="50%" cy="40%" r="35%">
                <stop offset="0%" stopColor="#000" stopOpacity="0" />
                <stop offset="60%" stopColor="#000" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#000" stopOpacity="1" />
              </radialGradient>
              <mask id="heroPerimeterOnly">
                <rect width="100%" height="100%" fill="url(#heroCenterClear)" />
              </mask>
            </defs>
            <g mask="url(#heroPerimeterOnly)" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 4">
              <line x1="160" y1="0" x2="160" y2="500" opacity="0.3" />
              <line x1="1040" y1="0" x2="1040" y2="500" opacity="0.3" />
              <line x1="0" y1="100" x2="1200" y2="100" opacity="0.25" />
              <line x1="0" y1="420" x2="1200" y2="420" opacity="0.25" />
            </g>
          </svg>
        </div>

        {/* Centred Hero Content Box */}
        <div className="relative max-w-3xl mx-auto text-center space-y-5 sm:space-y-6">
          {/* Main Headline */}
          <div className="space-y-3 sm:space-y-3.5">
            <h1 className="hero-headline text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold tracking-tight text-[#211B17] leading-[1.12] sm:leading-[1.15] max-w-2xl mx-auto">
              {t.heroHeadlinePart1}
              <span className="text-[#896648]">{t.heroHeadlineHighlight}</span>
              {t.heroHeadlinePart2}
            </h1>

            {/* Supporting paragraph with balanced line breaks and &nbsp; to bind real-time */}
            <p className="hero-description text-sm sm:text-base lg:text-[1.0625rem] text-[#554940] max-w-2xl mx-auto leading-relaxed font-normal">
              {lang === 'en' ? (
                <>
                  Scattered citizen complaints are spatially merged and ranked by{' '}
                  <span className="whitespace-nowrap">real-time</span> lethality—ensuring open manholes, live wires, and school-zone hazards bypass routine queue noise.
                </>
              ) : (
                t.heroDescription
              )}
            </p>
          </div>

          {/* Primary Call to Action & Secondary Tracking Action */}
          <div className="hero-cta-area flex flex-col items-center justify-center space-y-2.5 pt-1">
            {/* Primary Action Button with Centered Auth Modal Interceptor */}
            <button
              type="button"
              onClick={handleReportClick}
              className="inline-flex items-center justify-center gap-2.5 h-13 px-8 rounded-xl bg-[#896648] hover:bg-[#6F4F36] text-white font-medium shadow-md hover:shadow-lg active:scale-[0.99] transition-all whitespace-nowrap text-base group cursor-pointer"
            >
              <Camera className="w-5 h-5 text-white/95 group-hover:scale-110 transition-transform shrink-0" />
              <span className="font-semibold tracking-wide text-white">{t.reportHazardBtn}</span>
              <span className="text-xs font-normal text-white/80 font-hindi pl-0.5">
                {t.reportHazardSub}
              </span>
            </button>

            {/* Secondary Tracking Action Link */}
            {!isTrackingOpen ? (
              <button
                type="button"
                onClick={() => setIsTrackingOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#554940] hover:text-[#211B17] transition-colors py-1 px-2.5 rounded-lg hover:bg-[#DFCCB9]/70 cursor-pointer"
              >
                <span>{t.trackActionText}</span>
                <span className="text-[#896648] font-bold">→</span>
              </button>
            ) : (
              /* Inline Compact Tracking Interface */
              <div className="w-full max-w-md pt-1 animate-in fade-in duration-200">
                <div className="bg-[#F5EDE4] border border-[#C7AF99] rounded-2xl p-2.5 shadow-sm space-y-2">
                  <form onSubmit={handleTrackSubmit} className="flex items-center gap-1.5">
                    <div className="flex-1 flex items-center bg-[#E8D9CB]/80 border border-[#C7AF99] rounded-xl px-3 py-2 focus-within:border-[#896648] focus-within:bg-[#F5EDE4] focus-within:ring-2 focus-within:ring-[#896648]/20 transition-all">
                      <Search className="w-4 h-4 text-[#554940] mr-2 shrink-0" />
                      <input
                        type="text"
                        autoFocus
                        value={trackCode}
                        onChange={(e) => setTrackCode(e.target.value)}
                        placeholder={t.trackInputPlaceholder}
                        className="bg-transparent text-xs sm:text-sm font-medium text-[#211B17] placeholder-[#554940] focus:outline-none flex-1 min-w-0 font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="h-10 px-4 rounded-xl bg-[#211B17] hover:bg-[#896648] text-[#F5EDE4] text-xs font-semibold transition-colors flex items-center gap-1 shrink-0"
                    >
                      <span>{t.trackBtnText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsTrackingOpen(false)}
                      className="p-2 text-[#554940] hover:text-[#211B17] rounded-lg transition-colors"
                      title="Close tracking input"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Sample ID Demo Options */}
                  <div className="flex items-center justify-between text-[11px] pt-1 px-1 text-[#554940] border-t border-[#DFCCB9]">
                    <span>{t.trySampleText}</span>
                    <div className="flex items-center gap-1.5 font-mono">
                      <button
                        type="button"
                        onClick={() => {
                          setTrackCode('CP-IND-8821');
                          handleQuickTrack('CP-IND-8821');
                        }}
                        className="px-2 py-0.5 rounded border border-[#C7AF99] bg-[#E8D9CB] hover:border-[#896648] hover:text-[#896648] transition-colors"
                      >
                        CP-IND-8821
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTrackCode('CP-IND-4419');
                          handleQuickTrack('CP-IND-4419');
                        }}
                        className="px-2 py-0.5 rounded border border-[#C7AF99] bg-[#E8D9CB] hover:border-[#896648] hover:text-[#896648] transition-colors"
                      >
                        CP-IND-4419
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. EMPIRICAL FAILURE ANALYSIS & METRICS LEDGER (SLIDE 2)     */}
      {/* ============================================================ */}
      <section id="insights" className="max-w-7xl mx-auto min-h-screen flex flex-col justify-center py-16 sm:py-24 space-y-12 scroll-mt-20">
        {/* Editorial Split Header */}
        <div className="insights-header grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-b border-[#C7AF99] pb-8">
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DFCCB9] border border-[#C7AF99] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#896648]"></span>
              <span className="text-xs font-bold text-[#6F4F36]">
                Empirical Failure Analysis
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#211B17] tracking-tight leading-[1.12]">
              The mathematics of unprioritized civic risk.
            </h2>
          </div>

          <div className="lg:col-span-5 lg:pt-8">
            <p className="text-sm sm:text-base text-[#554940] leading-relaxed">
              When municipalities process hazard grievances via first-in, first-out (FIFO) chronological backlogs, trivial cosmetic complaints delay emergency intervention for lethal infrastructure faults by an average of 14 days.
            </p>
          </div>
        </div>

        {/* Interactive Stats Band Component (Placed right below the Heading of Slide 2) */}
        <div className="stats-band-wrapper w-full">
          <StatsBand
            layout="divided"
            title="Empirical Civic Hazard Velocity & Impact"
            description="Verified audit metrics across monitored municipal corridors, spatial deduplication pipelines, and emergency hazard response squads."
          />
        </div>

        {/* 2 CHARTS: Trajectory & Severity Matrix */}
        <div className="insights-charts-grid grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Chart: Interactive Motion/Recharts Component */}
          <div className="lg:col-span-7 bg-[#F5EDE4] border border-[#C7AF99] rounded-2xl p-7 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow space-y-6">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#896648] uppercase tracking-wider">
                  Fatality & Resolution Velocity // 2026
                </span>
                <span className="text-xs text-[#554940] px-2.5 py-0.5 rounded-md bg-[#DFCCB9] border border-[#C7AF99] font-medium">
                  Dynamic Recharts
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#211B17]">
                Hazard Encounters & Resolution Trajectory
              </h3>
              <p className="text-xs text-[#554940]">
                Monthly volume breakdown and trajectory velocity across major municipal corridors.
              </p>
            </div>

            {/* Interactive Charts Component */}
            <div className="py-2">
              <ChartsPreview />
            </div>

            <div className="pt-3 border-t border-[#C7AF99] flex items-center justify-between text-xs text-[#554940]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#C2410C]"></span>
                <span className="font-semibold text-[#211B17]">Reported Hazards</span>
                <span className="w-2.5 h-2.5 rounded-sm bg-[#896648] ml-2"></span>
                <span className="font-semibold text-[#211B17]">Resolved Hazards</span>
              </div>
              <span className="font-bold text-[#896648] font-mono">Live Database Connected</span>
            </div>
          </div>

          {/* Right Chart (Lethality vs. Volume Matrix) */}
          <div className="lg:col-span-5 bg-[#F5EDE4] border border-[#C7AF99] rounded-2xl p-7 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow space-y-6">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#211B17] uppercase tracking-wider">
                  Incident Density // 5,240 Tickets
                </span>
                <span className="text-xs text-[#554940] px-2.5 py-0.5 rounded-md bg-[#DFCCB9] border border-[#C7AF99] font-medium">
                  Severity Audit
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#211B17]">
                Lethality vs. Volume Matrix
              </h3>
              <p className="text-xs text-[#554940]">
                Hazard volume does not equate to lethality. Open cavities and live wiring require immediate emergency escalation.
              </p>
            </div>

            {/* Horizontal Stacked Distribution Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#554940]">
                <span>Total Hazard Volume</span>
                <span className="font-semibold text-[#211B17]">100% Breakdown</span>
              </div>
              <div className="w-full h-3.5 rounded-md overflow-hidden flex bg-[#DFCCB9]">
                <div style={{ width: '38%' }} className="bg-[#896648]" title="Potholes & Cavities (38%)"></div>
                <div style={{ width: '24%' }} className="bg-[#C2410C]" title="Open Manholes & Drains (24%)"></div>
                <div style={{ width: '18%' }} className="bg-[#B45309]" title="Dangling Live Wires (18%)"></div>
                <div style={{ width: '12%' }} className="bg-[#6F4F36]" title="Unlit Blackspots (12%)"></div>
                <div style={{ width: '8%' }} className="bg-[#A89F96]" title="Waterlogging & Debris (8%)"></div>
              </div>
            </div>

            {/* Structured Tabular Breakdown */}
            <div className="border border-[#C7AF99] rounded-xl overflow-hidden bg-[#F5EDE4] divide-y divide-[#C7AF99]">
              <div className="grid grid-cols-12 py-2 px-3 text-xs font-bold text-[#554940] bg-[#DFCCB9]">
                <div className="col-span-6">Hazard Type</div>
                <div className="col-span-3 text-right">Share</div>
                <div className="col-span-3 text-right">Lethality</div>
              </div>

              <div className="grid grid-cols-12 py-2 px-3 text-xs items-center hover:bg-[#DFCCB9]/40 transition-colors">
                <div className="col-span-6 flex items-center gap-2 truncate font-semibold text-[#211B17]">
                  <span className="w-2 h-2 rounded-full shrink-0 bg-[#896648]"></span>
                  <span className="truncate">Potholes & Cavities</span>
                </div>
                <div className="col-span-3 text-right font-mono text-xs text-[#554940] font-medium">38% (1,990)</div>
                <div className="col-span-3 text-right">
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#E8D9CB] text-[#896648] border border-[#C7AF99]">
                    High
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-12 py-2 px-3 text-xs items-center hover:bg-[#DFCCB9]/40 transition-colors">
                <div className="col-span-6 flex items-center gap-2 truncate font-semibold text-[#211B17]">
                  <span className="w-2 h-2 rounded-full shrink-0 bg-[#C2410C]"></span>
                  <span className="truncate">Open Manholes & Drains</span>
                </div>
                <div className="col-span-3 text-right font-mono text-xs text-[#554940] font-medium">24% (1,258)</div>
                <div className="col-span-3 text-right">
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#FFF7ED] text-[#C2410C] border border-[#FFEDD5]">
                    Critical
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-12 py-2 px-3 text-xs items-center hover:bg-[#DFCCB9]/40 transition-colors">
                <div className="col-span-6 flex items-center gap-2 truncate font-semibold text-[#211B17]">
                  <span className="w-2 h-2 rounded-full shrink-0 bg-[#B45309]"></span>
                  <span className="truncate">Dangling Live Wires</span>
                </div>
                <div className="col-span-3 text-right font-mono text-xs text-[#554940] font-medium">18% (943)</div>
                <div className="col-span-3 text-right">
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]">
                    Extreme
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-12 py-2 px-3 text-xs items-center hover:bg-[#DFCCB9]/40 transition-colors">
                <div className="col-span-6 flex items-center gap-2 truncate font-semibold text-[#211B17]">
                  <span className="w-2 h-2 rounded-full shrink-0 bg-[#6F4F36]"></span>
                  <span className="truncate">Unlit Blackspots</span>
                </div>
                <div className="col-span-3 text-right font-mono text-xs text-[#554940] font-medium">12% (629)</div>
                <div className="col-span-3 text-right">
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#E8D9CB] text-[#6F4F36] border border-[#C7AF99]">
                    Moderate
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-12 py-2 px-3 text-xs items-center hover:bg-[#DFCCB9]/40 transition-colors">
                <div className="col-span-6 flex items-center gap-2 truncate font-semibold text-[#211B17]">
                  <span className="w-2 h-2 rounded-full shrink-0 bg-[#A89F96]"></span>
                  <span className="truncate">Waterlogging & Debris</span>
                </div>
                <div className="col-span-3 text-right font-mono text-xs text-[#554940] font-medium">8% (420)</div>
                <div className="col-span-3 text-right">
                  <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-[#E8D9CB] text-[#554940] border border-[#C7AF99]">
                    Low
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#C7AF99] flex items-center justify-between text-xs text-[#554940]">
              <span>Live electrical wires & drains carry 4.2x higher fatality rates</span>
              <span className="font-bold text-[#211B17]">Weighted Severity Triage</span>
            </div>
          </div>
        </div>

        {/* 5. ALGORITHMIC TRIAGE ENGINE SHOWCASE */}
        <div className="triage-engine-card bg-[#211B17] text-[#F5EDE4] rounded-2xl p-8 lg:p-12 border border-[#3D332B] mt-12 space-y-8 shadow-lg">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2E2520] border border-[#4A3C33]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#896648]"></span>
              <span className="text-xs font-semibold text-[#E8D9CB]">
                Algorithmic Triage Engine
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-white tracking-tight leading-tight">
              Why chronological queues fail—and how risk scoring saves lives.
            </h3>
            <p className="text-sm text-[#C7AF99] leading-relaxed max-w-2xl">
              Traditional portals dispatch repair crews in order of filing date. CivicPulse calculates dynamic geospatial impact, proximity to vulnerable zones, and hazard lethality in real time.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch pt-2">
            {/* Left Queue: Legacy Chronological FIFO Portal */}
            <div className="p-6 rounded-xl bg-[#28211C] border border-[#3D332B] space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#3D332B] pb-3">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-[#C2410C]" />
                    <span className="text-xs font-semibold text-[#F5EDE4] uppercase tracking-wider">
                      Legacy FIFO Queue
                    </span>
                  </div>
                  <span className="text-[11px] text-[#C7AF99] px-2.5 py-0.5 rounded-full bg-[#211B17] border border-[#3D332B]">
                    Chronological Backlog
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-[#211B17] border border-[#3D332B] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#C7AF99]">Ticket #3,481</span>
                      <span className="text-[11px] text-[#A89F96]">Day 14 in Queue</span>
                    </div>
                    <div className="text-sm font-medium text-[#F5EDE4]">
                      Colony road dust & sweepings
                    </div>
                    <div className="text-[11px] text-[#A89F96]">
                      Status: Dispatched to zonal engineer (Routine complaint)
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#211B17] border border-[#3D332B] space-y-1.5 opacity-85">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#C7AF99]">Tickets #3,482 – #3,506 (25 Tickets)</span>
                      <span className="text-[11px] text-[#C2410C] font-semibold">Duplicate Noise</span>
                    </div>
                    <div className="text-sm font-medium text-[#F5EDE4]">
                      25 individual reports for same minor pothole
                    </div>
                    <div className="text-[11px] text-[#A89F96]">
                      Status: 25 distinct tickets flooding ward supervisor inbox
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#3D1D16]/50 border border-[#C2410C]/40 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#F97316]">Ticket #3,507</span>
                      <span className="text-[11px] text-[#F97316] font-semibold">Lethal Threat Trapped</span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      Open 8-ft drain cavity outside primary school
                    </div>
                    <div className="text-[11px] text-[#FDBA74]">
                      Failure Mode: Queued at position #27 behind cosmetic complaints
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#211B17] border border-[#3D332B] text-xs text-[#C7AF99]">
                <span className="text-[#C2410C] font-semibold">Outcome:</span> Critical safety threats delayed by days while crews service non-lethal cosmetic backlogs.
              </div>
            </div>

            {/* Right Queue: CivicPulse Dynamic Engine */}
            <div className="p-6 rounded-xl bg-[#28211C] border border-[#896648]/60 space-y-5 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#3D332B] pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#896648]" />
                    <span className="text-xs font-semibold text-[#F5EDE4] uppercase tracking-wider">
                      CivicPulse Dynamic Engine
                    </span>
                  </div>
                  <span className="text-[11px] text-[#E8D9CB] font-semibold px-2.5 py-0.5 rounded-full bg-[#896648]/25 border border-[#896648]/50">
                    Live Risk Weighted
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-lg bg-[#211B17] border border-[#896648] space-y-1.5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#896648]/20 rounded-full blur-xl pointer-events-none"></div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#E8D9CB]">Priority #1 — Emergency Dispatch</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#896648] text-white">
                        Score 94/100
                      </span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      Open 8-ft drain cavity outside primary school
                    </div>
                    <div className="text-[11px] text-[#C7AF99]">
                      Dynamic Engine: Triggered by Proximity (School 50m) + Lethality Factor
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#211B17] border border-[#3D332B] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#D97706]">Unified Master Issue #CL-419</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#D97706]/20 text-[#FBBF24]">
                        Score 68/100
                      </span>
                    </div>
                    <div className="text-sm font-medium text-[#F5EDE4]">
                      25 Citizen Reports Merged into 1 Master Action
                    </div>
                    <div className="text-[11px] text-[#A89F96]">
                      Spatial Engine: 25 tickets auto-merged within 15m radius; all citizens subscribed
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#211B17] border border-[#3D332B] space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#C7AF99]">Scheduled Maintenance</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#28211C] text-[#C7AF99] border border-[#3D332B]">
                        Score 24/100
                      </span>
                    </div>
                    <div className="text-sm font-medium text-[#F5EDE4]">
                      Colony road dust & sweepings
                    </div>
                    <div className="text-[11px] text-[#A89F96]">
                      Routing: Routed to scheduled sanitation queue without blocking road safety crews
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[#211B17] border border-[#3D332B] text-xs text-[#C7AF99]">
                <span className="text-[#896648] font-bold">Measurable Impact:</span> Lethal hazards cordoned off within hours; repair closed only upon GPS after-photo verification.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PART 3 — PRODUCT EXPLANATION SECTION                         */}
      {/* "From scattered reports to urgent action"                    */}
      {/* ============================================================ */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 min-h-screen flex flex-col justify-center py-16 sm:py-24 space-y-10 scroll-mt-20">
        {/* Section Header */}
        <div className="how-it-works-header text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#DFCCB9] border border-[#C7AF99] shadow-2xs mb-6 sm:mb-7">
            <span className="w-2 h-2 rounded-full bg-[#896648]"></span>
            <span className="text-[11px] font-bold text-[#6F4F36] uppercase tracking-wider">
              {t.howItWorksBadge}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#211B17] tracking-tight leading-tight">
            {t.processHeading}
          </h2>
          <p className="text-sm sm:text-base text-[#554940] leading-relaxed mt-3">
            {t.processSubheading}
          </p>
        </div>

        {/* Single Cohesive Process Visualization with Warm Container & Elevated Cards */}
        <div className="relative rounded-3xl bg-[#DFCCB9] border border-[#C7AF99] p-6 sm:p-8 lg:p-10 shadow-sm overflow-hidden">
          {/* Subtle Map Coordinate Grid Underlay */}
          <div className="absolute inset-0 pointer-events-none opacity-25">
            <svg className="w-full h-full text-[#896648]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="lightGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#lightGrid)" />
            </svg>
          </div>

          {/* Continuous Directional Connector Track (Desktop Horizontal) */}
          <div className="hidden lg:block absolute left-[18%] right-[18%] top-[106px] z-0 pointer-events-none">
            <div className="w-full border-t border-dashed border-[#C7AF99]"></div>
          </div>

          {/* 3-Stage Connected Workflow Grid */}
          <div className="workflow-stages-container relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-8 items-stretch">
            {/* ---------------- STAGE 01: REPORTS ---------------- */}
            <div className="workflow-stage-card relative flex flex-col justify-between space-y-5 bg-[#F5EDE4] p-5 rounded-2xl border border-[#C7AF99] shadow-xs">
              {/* Stage Visual Canvas */}
              <div className="h-44 sm:h-48 rounded-xl bg-[#E8D9CB] border border-[#C7AF99] p-4 flex flex-col justify-between relative overflow-hidden transition-all hover:border-[#896648]">
                {/* Stage Indicator Pill */}
                <div className="flex items-center justify-between text-[11px] font-mono text-[#554940]">
                  <span className="font-bold text-[#896648]">{t.stage1InputLayer}</span>
                  <span>{t.stage1Radius}</span>
                </div>

                {/* Spatial Graphic: Multiple scattered citizen report pins */}
                <div className="relative flex-1 flex items-center justify-center my-1">
                  {/* Subtle Radar Wave */}
                  <div className="absolute w-28 h-28 rounded-full border border-dashed border-[#C7AF99]"></div>

                  {/* Scattered Citizen Pins (Charcoal/Brown) */}
                  <div className="absolute top-1 left-4 flex items-center gap-1 bg-[#F5EDE4] px-2 py-0.5 rounded-md border border-[#C7AF99] shadow-2xs text-[10px] text-[#211B17] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#896648]"></span>
                    <span>Report #1</span>
                  </div>
                  <div className="absolute bottom-2 left-6 flex items-center gap-1 bg-[#F5EDE4] px-2 py-0.5 rounded-md border border-[#C7AF99] shadow-2xs text-[10px] text-[#211B17] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#896648]"></span>
                    <span>Report #2</span>
                  </div>
                  <div className="absolute top-5 right-5 flex items-center gap-1 bg-[#F5EDE4] px-2 py-0.5 rounded-md border border-[#C7AF99] shadow-2xs text-[10px] text-[#211B17] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#896648]"></span>
                    <span>Report #3</span>
                  </div>
                  <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-[#F5EDE4] px-2 py-0.5 rounded-md border border-[#C7AF99] shadow-2xs text-[10px] text-[#211B17] font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#896648]"></span>
                    <span>Report #4</span>
                  </div>

                  {/* Center Crosshair Marker */}
                  <div className="w-4 h-4 rounded-full bg-[#211B17]/20 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#211B17]"></div>
                  </div>
                </div>

                {/* Technical Micro-label */}
                <div className="text-[11px] text-[#554940] border-t border-[#C7AF99] pt-2 flex items-center justify-between">
                  <span>{t.stage1Gps}</span>
                  <span className="font-mono text-[10px] text-[#896648] font-bold">LAT 28.61° N</span>
                </div>
              </div>

              {/* Text Description */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#896648] tracking-wider uppercase">
                    {t.stage1Badge}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#211B17]">
                  {t.stage1Title}
                </h3>
                <p className="text-xs sm:text-sm text-[#554940] leading-relaxed">
                  {t.stage1Desc}
                </p>
              </div>

              {/* Directional Connector Arrow (Desktop: Right / Mobile: Down) */}
              <div className="hidden lg:flex absolute -right-4 top-[94px] z-20 w-7 h-7 rounded-full bg-[#F5EDE4] border border-[#C7AF99] items-center justify-center text-[#896648] shadow-xs">
                <span className="text-xs font-bold leading-none">→</span>
              </div>
              <div className="flex lg:hidden justify-center text-[#896648] py-0.5">
                <span className="text-sm font-bold">↓</span>
              </div>
            </div>

            {/* ---------------- STAGE 02: CLUSTER ---------------- */}
            <div className="workflow-stage-card relative flex flex-col justify-between space-y-5 bg-[#F5EDE4] p-5 rounded-2xl border border-[#C7AF99] shadow-xs">
              {/* Stage Visual Canvas */}
              <div className="h-44 sm:h-48 rounded-xl bg-[#E8D9CB] border border-[#C7AF99] p-4 flex flex-col justify-between relative overflow-hidden transition-all hover:border-[#896648]">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#554940]">
                  <span className="font-bold text-[#896648]">{t.stage2Engine}</span>
                  <span>{t.stage2Vector}</span>
                </div>

                {/* Spatial Graphic: Grouped Cluster Ring */}
                <div className="relative flex-1 flex items-center justify-center my-1">
                  {/* Concentric Cluster Perimeter */}
                  <div className="w-24 h-24 rounded-full bg-[#896648]/15 border border-[#896648]/50 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-[#896648]/25 border border-[#896648]/70 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-[#896648] text-white flex items-center justify-center shadow-xs">
                        <span className="font-mono text-xs font-bold">1</span>
                      </div>
                    </div>
                  </div>

                  {/* Converging Hairlines */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-36 h-px bg-gradient-to-r from-transparent via-[#896648]/40 to-transparent"></div>
                    <div className="h-36 w-px bg-gradient-to-b from-transparent via-[#896648]/40 to-transparent"></div>
                  </div>
                </div>

                {/* Technical Micro-label */}
                <div className="text-[11px] text-[#554940] border-t border-[#C7AF99] pt-2 flex items-center justify-between">
                  <span>{t.stage2Ticket}</span>
                  <span className="font-mono text-[10px] text-[#896648] font-bold">{t.stage2Consolidated}</span>
                </div>
              </div>

              {/* Text Description */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#896648] tracking-wider uppercase">
                    {t.stage2Badge}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#211B17]">
                  {t.stage2Title}
                </h3>
                <p className="text-xs sm:text-sm text-[#554940] leading-relaxed">
                  {t.stage2Desc}
                </p>
              </div>

              {/* Directional Connector Arrow (Desktop: Right / Mobile: Down) */}
              <div className="hidden lg:flex absolute -right-4 top-[94px] z-20 w-7 h-7 rounded-full bg-[#F5EDE4] border border-[#C7AF99] items-center justify-center text-[#896648] shadow-xs">
                <span className="text-xs font-bold leading-none">→</span>
              </div>
              <div className="flex lg:hidden justify-center text-[#896648] py-0.5">
                <span className="text-sm font-bold">↓</span>
              </div>
            </div>

            {/* ---------------- STAGE 03: PRIORITISE ---------------- */}
            <div className="workflow-stage-card relative flex flex-col justify-between space-y-5 bg-[#F5EDE4] p-5 rounded-2xl border border-[#C7AF99] shadow-xs">
              {/* Stage Visual Canvas (Surfaced Prioritised Hazard in Muted Orange Accent) */}
              <div className="h-44 sm:h-48 rounded-xl bg-[#FFF6EE] border border-[#FDBA74] p-4 flex flex-col justify-between relative overflow-hidden transition-all shadow-2xs">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#C2410C]">
                  <span className="font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]"></span>
                    {t.stage3Surfaced}
                  </span>
                  <span className="font-bold">{t.stage3Rank}</span>
                </div>

                {/* Spatial Graphic: Muted Orange Hazard Pin */}
                <div className="relative flex-1 flex items-center justify-center my-1">
                  {/* Subtle Orange Hazard Halo */}
                  <div className="absolute w-24 h-24 rounded-full bg-[#C2410C]/10 border border-[#FDBA74] animate-pulse"></div>

                  {/* Priority Beacon */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="px-3 py-1 rounded-lg bg-[#C2410C] text-white text-xs font-bold shadow-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{t.stage3Score}</span>
                    </div>
                    <div className="text-[10px] text-[#9A3412] font-bold mt-1.5 bg-white px-2 py-0.5 rounded border border-[#FED7AA]">
                      {t.stage3Zone}
                    </div>
                  </div>
                </div>

                {/* Technical Micro-label */}
                <div className="text-[11px] text-[#9A3412] border-t border-[#FED7AA] pt-2 flex items-center justify-between font-semibold">
                  <span>{t.stage3Sla}</span>
                  <span className="font-mono text-[10px]">{t.stage3Weight}</span>
                </div>
              </div>

              {/* Text Description */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#C2410C] tracking-wider uppercase">
                    {t.stage3Badge}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#211B17]">
                  {t.stage3Title}
                </h3>
                <p className="text-xs sm:text-sm text-[#554940] leading-relaxed">
                  {t.stage3Desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CENTERED GOOGLE AUTHENTICATION MODAL DIALOG                  */}
      {/* ============================================================ */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Dimmed Backdrop */}
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => !isAuthenticating && setIsAuthModalOpen(false)}
          />

          {/* Centered Modal Card */}
          <div className="relative z-10 w-full max-w-md bg-[#F5EDE4] border border-[#C7AF99] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            {/* Header with Camera/Shield Emblem & Close Button */}
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#DFCCB9] border border-[#C7AF99] flex items-center justify-center text-[#896648] shadow-2xs">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                disabled={isAuthenticating}
                className="w-8 h-8 rounded-full bg-[#E8D9CB] hover:bg-[#DFCCB9] text-[#554940] hover:text-[#211B17] flex items-center justify-center transition-colors border border-[#C7AF99] cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title & Explanatory Prompt */}
            <div className="space-y-2 text-left">
              <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-[#211B17] tracking-tight">
                {lang === 'hi' ? 'नागरिक प्रमाणीकरण आवश्यक' : 'Sign in to Report a Hazard'}
              </h3>
              <p className="text-xs sm:text-sm text-[#554940] leading-relaxed font-normal">
                {lang === 'hi'
                  ? 'खतरे की रिपोर्ट करने, अपनी शिकायत को सुरक्षित रूप से ट्रैक करने और समाधान के दौरान अपडेट प्राप्त करने के लिए साइन इन करें।'
                  : 'Sign in to report a hazard, securely track your complaint, and receive updates as it is resolved.'}
              </p>
            </div>

            {/* Error Message if Sign-in Fails */}
            {authError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <CircleAlert className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {/* Actions: Continue with Google & Cancel */}
            <div className="space-y-3 pt-1">
              <button
                type="button"
                onClick={handleGoogleContinue}
                disabled={isAuthenticating}
                className="w-full h-12 px-5 rounded-xl bg-[#211B17] hover:bg-[#3D352F] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg active:scale-[0.99] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
              >
                {isAuthenticating ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>{lang === 'hi' ? 'प्रमाणीकरण हो रहा है...' : 'Authenticating with Google...'}</span>
                  </span>
                ) : (
                  <>
                    <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.3 7.5 23.5 12 23.5z"
                      />
                    </svg>
                    <span>{lang === 'hi' ? 'Google के साथ जारी रखें' : 'Continue with Google'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAuthModalOpen(false);
                  setAuthError(null);
                }}
                disabled={isAuthenticating}
                className="w-full h-11 px-5 rounded-xl bg-transparent hover:bg-[#DFCCB9]/60 text-[#554940] hover:text-[#211B17] text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center cursor-pointer border border-[#C7AF99]"
              >
                <span>{lang === 'hi' ? 'रद्द करें' : 'Cancel'}</span>
              </button>
            </div>

            {/* Privacy footnote */}
            <div className="text-[11px] text-center text-[#554940] pt-1">
              {lang === 'hi'
                ? 'आपकी व्यक्तिगत जानकारी सार्वजनिक रूप से कभी नहीं दिखाई जाएगी।'
                : 'Your identity and contact information remain private and protected.'}
            </div>
          </div>
        </div>
      )}

      {/* Professional Google Account Chooser Modal */}
      <GoogleAccountChooserModal
        isOpen={isGoogleChooserOpen}
        onClose={() => setIsGoogleChooserOpen(false)}
        onSelectAccount={handleAccountChosen}
        lang={lang}
      />
    </div>
  );
}
