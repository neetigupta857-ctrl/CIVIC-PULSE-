'use client';

import React, { useState, Suspense, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { IssueCategory, Coordinates } from '@/types/incident';
import { ALL_INDIAN_CITIES } from '@/data/indianCities';
import LeafletMap from '@/components/LeafletMap';
import { gsap } from '@/lib/gsap';
import {
  Camera,
  MapPin,
  AlertTriangle,
  Send,
  CheckCircle2,
  Clock,
  Search,
  Crosshair,
  CircleDot,
  Zap,
  Trash2,
  Droplets,
  RotateCcw,
  AlertCircle
} from 'lucide-react';

interface CategoryOption {
  key: IssueCategory;
  titleEn: string;
  titleHi: string;
  subEn: string;
  subHi: string;
  icon: any;
}

const CATEGORIES: CategoryOption[] = [
  {
    key: 'POTHOLE',
    titleEn: 'Dangerous Pothole',
    titleHi: 'सड़क का गड्ढा',
    subEn: 'Deep road cavity, crater, collapsed asphalt',
    subHi: 'गहरा गड्ढा, टूटी सड़क, दुर्घटना का जोखिम',
    icon: CircleDot
  },
  {
    key: 'OPEN_WIRE',
    titleEn: 'Open Electrical Wire',
    titleHi: 'खुला बिजली तार',
    subEn: 'Hanging live cable, transformer sparking, shock hazard',
    subHi: 'लटकता नंगा तार, ट्रांसफार्मर से चिंगारी, करंट का खतरा',
    icon: Zap
  },
  {
    key: 'OPEN_MANHOLE',
    titleEn: 'Open Manhole',
    titleHi: 'खुला मैनहोल',
    subEn: 'Missing or broken drain cover, fall danger',
    subHi: 'खुला या टूटा गटर, गिरने का जानलेवा खतरा',
    icon: AlertTriangle
  },
  {
    key: 'GARBAGE',
    titleEn: 'Garbage Dump',
    titleHi: 'कचरा / डंपिंग',
    subEn: 'Overflowing waste heap, rotten blockage',
    subHi: 'सड़क पर कूड़े का ढेर, दुर्गंध व बीमारी',
    icon: Trash2
  },
  {
    key: 'WATER_LEAKAGE',
    titleEn: 'Drain Blockage / Leak',
    titleHi: 'नाली जाम / पाइप लीकेज',
    subEn: 'Clogged drainage, water pipeline burst, flooding',
    subHi: 'जाम नाली, पाइप फटना, जलभराव',
    icon: Droplets
  }
];

function CitizenReportingContent() {
  const { lang, user, setUser, t, isMounted } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Redirect to home if unauthenticated
  React.useEffect(() => {
    if (isMounted && !user) {
      router.push('/');
    }
  }, [isMounted, user, router]);

  const [activeTab, setActiveTab] = useState<'REPORT' | 'MY_REPORTS'>('REPORT');
  const [mySubmissions, setMySubmissions] = useState<any[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState<boolean>(false);

  // Load user submissions when opening "My Reports" tab
  React.useEffect(() => {
    if (activeTab === 'MY_REPORTS' && user) {
      setIsLoadingSubmissions(true);
      fetch('/api/citizen/dashboard')
        .then((res) => res.json())
        .then((data) => {
          if (data.submissions) {
            setMySubmissions(data.submissions);
          }
          setIsLoadingSubmissions(false);
        })
        .catch(() => setIsLoadingSubmissions(false));
    }
  }, [activeTab, user]);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [category, setCategory] = useState<IssueCategory>('POTHOLE');
  const [selectedCity, setSelectedCity] = useState('New Delhi');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('Outer Ring Road, New Delhi');
  const [coords, setCoords] = useState<Coordinates>({ lat: 28.5983, lng: 77.2435 });
  const [isUrgentHazard, setIsUrgentHazard] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>(
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=700&q=80'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [locationAlert, setLocationAlert] = useState<string | null>(null);

  // Address Geocoding & Suggestions State
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [geocodingNotFound, setGeocodingNotFound] = useState(false);
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false);

  const stepContainerRef = useRef<HTMLDivElement>(null);
  const successCardRef = useRef<HTMLDivElement>(null);

  // Animate step transitions
  useEffect(() => {
    if (!stepContainerRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.fromTo(
      stepContainerRef.current,
      { opacity: 0, x: 12 },
      { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }
    );
  }, [currentStep, activeTab]);

  // Animate success modal / view
  useEffect(() => {
    if (!submitResult || !successCardRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.from(successCardRef.current, {
      scale: 0.92,
      opacity: 0,
      duration: 0.45,
      ease: 'back.out(1.4)'
    });
  }, [submitResult]);

  // Fetch geocoding suggestions when user types or searches address
  const fetchAddressSuggestions = async (searchText: string, city: string) => {
    if (!searchText || searchText.trim().length < 2) {
      setAddressSuggestions([]);
      setGeocodingNotFound(false);
      return;
    }

    setIsSearchingAddress(true);
    setGeocodingNotFound(false);
    try {
      const res = await fetch(
        `/api/geocode?q=${encodeURIComponent(searchText.trim())}&city=${encodeURIComponent(city)}`
      );
      const data = await res.json();
      if (data.success && Array.isArray(data.suggestions)) {
        setAddressSuggestions(data.suggestions);
        setShowSuggestionsDropdown(data.suggestions.length > 0);
        if (data.suggestions.length === 0) {
          setGeocodingNotFound(true);
        } else {
          setGeocodingNotFound(false);
        }
      }
    } catch (e) {
      console.error('Failed to query geocoding API:', e);
      setGeocodingNotFound(true);
    } finally {
      setIsSearchingAddress(false);
    }
  };

  const handleSelectSuggestion = (sug: any) => {
    setLocationName(sug.shortName || sug.displayName);
    setCoords({ lat: sug.lat, lng: sug.lng });
    setShowSuggestionsDropdown(false);
    setGeocodingNotFound(false);
    setLocationAlert(null);
  };

  // Authenticate with Google simulation if not logged in
  const handleGoogleSignIn = async () => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Aarav Malhotra',
          email: 'aarav.malhotra@gmail.com',
          googleId: 'google-usr-901'
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
      }
    } catch (e) {
      console.error('Google sign in error:', e);
    }
  };

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    const cityData = ALL_INDIAN_CITIES.find((c) => c.name === cityName);
    if (cityData) {
      setCoords({ lat: cityData.lat, lng: cityData.lng });
      const defaultStreet = cityName === 'All India (National)' ? 'Outer Ring Road, New Delhi' : `Main Road, ${cityData.name}`;
      setLocationName(defaultStreet);
      setAddressSuggestions([]);
      setGeocodingNotFound(false);
      setShowSuggestionsDropdown(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('File size exceeds 5MB limit. Please upload a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseMyLocation = () => {
    setLocationAlert(null);
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setLocationAlert('Geolocation is not supported by your device. Please use the interactive map pin below.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newCoords = {
          lat: Number(pos.coords.latitude.toFixed(5)),
          lng: Number(pos.coords.longitude.toFixed(5))
        };
        setCoords(newCoords);
        setLocationName(`Detected GPS Location (${newCoords.lat}, ${newCoords.lng})`);
      },
      (err) => {
        setLocationAlert('Location permission denied. Please select or drag the map pin directly on the map below.');
      }
    );
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (!user) {
      setErrorMessage('Please authenticate with Google to submit a citizen report.');
      return;
    }

    if (!locationName) {
      setErrorMessage('Please specify the location address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/reports/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          description: description.trim() || `${category} hazard reported on ${locationName}. Urgent municipal inspection requested.`,
          city: selectedCity,
          locationName,
          coordinates: coords,
          isUrgentHazard,
          photoUrl: photoPreview,
          user
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Submission failed');
      }

      setSubmitResult(data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit report. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SCREEN AFTER SUBMISSION
  if (submitResult) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 space-y-6">
        <div ref={successCardRef} className="p-8 sm:p-10 rounded-3xl bg-[#F5EDE4] border border-[#C7AF99] shadow-xs space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-[#DFCCB9] border border-[#C7AF99] flex items-center justify-center text-[#896648] mx-auto shadow-2xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#DFCCB9] text-[#211B17] border border-[#C7AF99] uppercase tracking-wider">
              {submitResult.isDuplicateJoined ? t.duplicateConsolidated : t.complaintSubmitted}
            </span>
            <h1 className="font-heading text-3xl font-extrabold text-[#211B17]">
              {submitResult.isDuplicateJoined ? t.attachedNearby : t.queuedVerification}
            </h1>
            <p className="text-xs sm:text-sm text-[#554940] max-w-lg mx-auto leading-relaxed font-medium">
              {submitResult.message}
            </p>
          </div>

          {/* Tracking Code Highlight Box */}
          <div className="p-5 rounded-2xl bg-[#E8D9CB] border border-[#C7AF99] space-y-1">
            <div className="text-[11px] font-bold text-[#554940] uppercase tracking-wider">
              {t.trackingRefLabel}
            </div>
            <div className="font-mono text-2xl sm:text-3xl font-black text-[#896648] tracking-wider select-all">
              {submitResult.trackingCode}
            </div>
            <div className="text-[11px] text-[#554940]">
              {t.trackingHint}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={`/track/${encodeURIComponent(submitResult.trackingCode)}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#896648] hover:bg-[#6F4F36] text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>{t.trackStatusBtn}</span>
            </Link>

            <button
              onClick={() => {
                setSubmitResult(null);
                setCurrentStep(1);
                setDescription('');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F5EDE4] border border-[#C7AF99] text-[#211B17] text-xs sm:text-sm font-semibold hover:bg-[#DFCCB9] transition-colors"
            >
              <RotateCcw className="w-4 h-4 text-[#896648]" />
              <span>{t.reportAnotherBtn}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-[#C7AF99] pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFCCB9] text-[#211B17] text-xs font-bold border border-[#C7AF99]">
          <CircleDot className="w-3.5 h-3.5 text-[#896648]" />
          <span>{t.citizenPortalBadge}</span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-[#211B17]">
          {t.citizenPortalHeading}
        </h1>
        <p className="text-xs text-[#554940]">
          {t.citizenPortalSub}
        </p>
      </div>

      {/* Authenticated Citizen Badge */}
      {user && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#DFCCB9] border border-[#C7AF99] text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#896648] text-white flex items-center justify-center font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-[#211B17]">{user.name}</div>
              <div className="text-[11px] text-[#554940]">{user.email || 'Verified Google Account'}</div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#F5EDE4] text-[#896648] font-bold text-[10px] border border-[#C7AF99]">
            {t.authenticatedCitizen}
          </span>
        </div>
      )}

      {/* Main Mode Toggle: Report a Hazard vs My Reports */}
      <div className="flex p-1.5 rounded-2xl bg-[#DFCCB9] border border-[#C7AF99]">
        <button
          onClick={() => setActiveTab('REPORT')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'REPORT'
              ? 'bg-[#896648] text-white shadow-xs'
              : 'text-[#554940] hover:text-[#211B17]'
          }`}
        >
          <CircleDot className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'खतरे की रिपोर्ट करें' : 'Report a Hazard'}</span>
        </button>
        <button
          onClick={() => setActiveTab('MY_REPORTS')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'MY_REPORTS'
              ? 'bg-[#896648] text-white shadow-xs'
              : 'text-[#554940] hover:text-[#211B17]'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'मेरी शिकायतें व स्टेटस' : 'My Reports & Status'}</span>
        </button>
      </div>

      {/* MY REPORTS DASHBOARD VIEW */}
      {activeTab === 'MY_REPORTS' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-[#F5EDE4] border border-[#C7AF99] space-y-2">
            <h2 className="font-heading text-lg font-bold text-[#211B17]">
              {lang === 'hi' ? 'आपकी दर्ज की गई शिकायतें' : 'Citizen Status Dashboard'}
            </h2>
            <p className="text-xs text-[#554940]">
              {lang === 'hi'
                ? 'यहाँ अपनी सभी दर्ज शिकायतों की वास्तविक स्थिति, मरम्मत दल की प्रगति और समय-सीमा देखें।'
                : 'Track the status timeline, inspection updates, and repair stages of your submitted complaints in real time.'}
            </p>
          </div>

          {isLoadingSubmissions ? (
            <div className="py-12 text-center text-xs text-[#554940] flex items-center justify-center gap-2">
              <Clock className="w-4 h-4 animate-spin text-[#896648]" />
              <span>Loading your reports...</span>
            </div>
          ) : mySubmissions.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#F5EDE4] border border-[#C7AF99] text-center space-y-3">
              <CheckCircle2 className="w-8 h-8 text-[#896648] mx-auto opacity-70" />
              <div className="font-bold text-sm text-[#211B17]">
                {lang === 'hi' ? 'कोई सक्रिय रिपोर्ट नहीं' : 'No Submissions Found Yet'}
              </div>
              <p className="text-xs text-[#554940] max-w-sm mx-auto">
                {lang === 'hi'
                  ? 'आपने अभी तक कोई खतरा दर्ज नहीं कराया है। रिपोर्ट दर्ज करने के लिए ऊपर टैब चुनें।'
                  : 'You have not submitted any hazard reports yet. Use the "Report a Hazard" tab to log road damage or civic hazards.'}
              </p>
              <button
                onClick={() => setActiveTab('REPORT')}
                className="mt-2 px-5 py-2 rounded-xl bg-[#896648] text-white text-xs font-bold hover:bg-[#6F4F36] transition-colors"
              >
                {lang === 'hi' ? 'अभी रिपोर्ट दर्ज करें' : 'Report a Hazard Now'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {mySubmissions.map((inc: any) => {
                const stages = [
                  { label: 'Submitted', active: true, done: true },
                  { label: 'Reviewed', active: inc.status !== 'NEW', done: ['APPROVED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].includes(inc.status) },
                  { label: 'Assigned', active: ['ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].includes(inc.status), done: ['ASSIGNED', 'IN_PROGRESS', 'RESOLVED'].includes(inc.status) },
                  { label: 'In Repair', active: ['IN_PROGRESS', 'RESOLVED'].includes(inc.status), done: ['IN_PROGRESS', 'RESOLVED'].includes(inc.status) },
                  { label: 'Resolved', active: inc.status === 'RESOLVED', done: inc.status === 'RESOLVED' },
                ];

                return (
                  <div
                    key={inc.id}
                    className="p-5 rounded-2xl bg-[#F5EDE4] border border-[#C7AF99] space-y-4 shadow-2xs hover:border-[#896648] transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#C7AF99]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#6F4F36]">
                            {inc.trackingCode}
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#DFCCB9] text-[#211B17]">
                            {inc.status}
                          </span>
                          {inc.isUrgentHazard && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-300">
                              Urgent
                            </span>
                          )}
                        </div>
                        <h3 className="font-heading font-bold text-sm text-[#211B17] mt-1">
                          {inc.categoryLabelEn || inc.category}: {inc.locationName}
                        </h3>
                      </div>
                      <Link
                        href={`/track/${encodeURIComponent(inc.trackingCode)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#896648] text-white text-xs font-bold hover:bg-[#6F4F36] self-start sm:self-auto shrink-0 shadow-2xs"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>Public Tracker</span>
                      </Link>
                    </div>

                    {/* Timeline Stages */}
                    <div>
                      <div className="text-[11px] font-bold text-[#554940] mb-2 uppercase tracking-wider">
                        Progress Timeline
                      </div>
                      <div className="grid grid-cols-5 gap-1 text-center">
                        {stages.map((stage, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                                stage.done
                                  ? 'bg-[#896648] text-white border-[#896648]'
                                  : stage.active
                                  ? 'bg-[#DFCCB9] text-[#211B17] border-[#896648] ring-2 ring-[#896648]/20'
                                  : 'bg-[#E8D9CB] text-[#554940] border-[#C7AF99]'
                              }`}
                            >
                              {stage.done ? '✓' : idx + 1}
                            </div>
                            <span className="text-[9px] font-semibold text-[#554940] mt-1 truncate max-w-[60px]">
                              {stage.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Details and Crew Assignment */}
                    <div className="p-3 rounded-xl bg-[#DFCCB9]/60 border border-[#C7AF99] space-y-1 text-xs">
                      <div className="flex items-center justify-between text-[#554940] text-[11px]">
                        <span>City: <strong>{inc.city}</strong></span>
                        <span>Priority Score: <strong className="text-[#896648]">{inc.priorityScore}/100 ({inc.priorityLevel})</strong></span>
                      </div>
                      {inc.assignedTeamName && (
                        <div className="text-[11px] text-[#211B17] pt-1">
                          Assigned Repair Crew: <strong className="text-[#896648]">{inc.assignedTeamName}</strong>
                        </div>
                      )}
                      {inc.resolutionRemarks && (
                        <div className="text-[11px] text-emerald-800 pt-1 font-semibold">
                          Resolution: {inc.resolutionRemarks}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* REPORTING STEPPER VIEW (Shown when activeTab === 'REPORT') */}
      {activeTab === 'REPORT' && (
        <div ref={stepContainerRef} className="space-y-6">
          {/* 4-Step Indicator */}
          <div className="grid grid-cols-4 gap-2">
            {[t.step1Tab, t.step2Tab, t.step3Tab, t.step4Tab].map(
              (label, idx) => (
                <button
                  key={label}
                  onClick={() => setCurrentStep(idx + 1)}
                  className={`p-2.5 rounded-xl text-center border transition-all ${
                    currentStep === idx + 1
                      ? 'bg-[#896648] text-white border-[#896648] font-bold shadow-2xs'
                      : currentStep > idx + 1
                      ? 'bg-[#DFCCB9] text-[#211B17] border-[#C7AF99] font-medium'
                      : 'bg-[#F5EDE4] text-[#554940] border-[#C7AF99]'
                  }`}
                >
                  <div className="text-xs truncate">{label}</div>
                </button>
              )
            )}
          </div>

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Step 1: Category */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <h2 className="font-heading text-lg font-bold text-[#211B17]">{t.selectCategoryHeading}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = category === cat.key;
              return (
                <div
                  key={cat.key}
                  onClick={() => setCategory(cat.key)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all space-y-1 ${
                    isSelected
                      ? 'bg-[#DFCCB9] border-[#896648] shadow-xs ring-1 ring-[#896648]'
                      : 'bg-[#F5EDE4] hover:bg-[#E8D9CB] border-[#C7AF99]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-[#896648] text-white' : 'bg-[#E8D9CB] text-[#896648]'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="font-heading text-sm font-bold text-[#211B17]">
                      {lang === 'hi' ? cat.titleHi : cat.titleEn}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#554940] pt-1">
                    {lang === 'hi' ? cat.subHi : cat.subEn}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 rounded-xl bg-[#896648] hover:bg-[#6F4F36] text-white text-xs font-bold shadow-xs"
            >
              {t.continuePhoto}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Photo Upload */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <h2 className="font-heading text-lg font-bold text-[#211B17]">{t.uploadPhotoHeading}</h2>
          <p className="text-xs text-[#554940]">
            {t.uploadPhotoDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border-2 border-dashed border-[#C7AF99] rounded-2xl p-6 bg-[#F5EDE4] flex flex-col items-center justify-center text-center space-y-3">
              <Camera className="w-8 h-8 text-[#896648]" />
              <div className="text-xs font-semibold text-[#211B17]">{t.selectImageBtn}</div>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="text-xs text-[#554940] file:mr-2 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#896648] file:text-white hover:file:bg-[#6F4F36]"
              />
            </div>

            <div className="rounded-2xl border border-[#C7AF99] bg-[#E8D9CB] h-52 overflow-hidden flex items-center justify-center">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-[#554940]">{t.noImageYet}</span>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl border border-[#C7AF99] bg-[#F5EDE4] text-xs font-semibold text-[#211B17]"
            >
              {t.backBtn}
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-2.5 rounded-xl bg-[#896648] hover:bg-[#6F4F36] text-white text-xs font-bold shadow-xs"
            >
              {t.continueLocation}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Location & Geocoding */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-bold text-[#211B17]">{t.locationHeading}</h2>
            <button
              onClick={handleUseMyLocation}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DFCCB9] border border-[#C7AF99] text-[#211B17] text-xs font-bold hover:bg-[#C7AF99]"
            >
              <Crosshair className="w-3.5 h-3.5 text-[#896648]" />
              <span>{t.useCurrentGps}</span>
            </button>
          </div>

          {locationAlert && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
              {locationAlert}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#211B17] mb-1">{t.cityLabel}</label>
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#C7AF99] bg-[#F5EDE4] text-xs text-[#211B17] focus:outline-none focus:ring-1 focus:ring-[#896648]"
              >
                {Array.from(new Set(ALL_INDIAN_CITIES.map((c) => c.state))).map((stateName) => {
                  const stateCities = ALL_INDIAN_CITIES.filter((c) => c.state === stateName);
                  if (stateName === 'National') {
                    return (
                      <option key="All India (National)" value="All India (National)">
                        🇮🇳 All India (National)
                      </option>
                    );
                  }
                  return (
                    <optgroup key={stateName} label={`📍 ${stateName}`}>
                      {stateCities.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
            </div>

            <div className="relative">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-[#211B17]">{t.addressLabel}</label>
                {isSearchingAddress && (
                  <span className="text-[10px] text-[#896648] font-bold animate-pulse">Finding coordinates...</span>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLocationName(val);
                    fetchAddressSuggestions(val, selectedCity);
                  }}
                  onFocus={() => {
                    if (addressSuggestions.length > 0) setShowSuggestionsDropdown(true);
                  }}
                  className="w-full px-3 py-2 pr-9 rounded-xl border border-[#C7AF99] bg-[#F5EDE4] text-xs text-[#211B17] focus:outline-none focus:ring-1 focus:ring-[#896648]"
                  placeholder="e.g. Vijay Nagar Colony, Sanjay Place, MG Road..."
                />
                <button
                  type="button"
                  onClick={() => fetchAddressSuggestions(locationName, selectedCity)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#896648] hover:text-[#211B17] p-1"
                  title="Search coordinates for address"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Suggestions dropdown */}
              {showSuggestionsDropdown && addressSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-[#F5EDE4] border border-[#C7AF99] rounded-xl shadow-lg z-50 overflow-hidden divide-y divide-[#C7AF99]/40 max-h-56 overflow-y-auto">
                  <div className="px-3 py-1.5 bg-[#DFCCB9] text-[10px] font-bold text-[#554940] uppercase tracking-wider">
                    Select Matching Location
                  </div>
                  {addressSuggestions.map((sug, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectSuggestion(sug)}
                      className="p-2.5 hover:bg-[#E8D9CB] cursor-pointer transition-colors text-left"
                    >
                      <div className="font-semibold text-xs text-[#211B17] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#896648] shrink-0" />
                        <span>{sug.shortName}</span>
                      </div>
                      <div className="text-[10px] text-[#554940] truncate pl-5">
                        {sug.displayName}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {geocodingNotFound && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Location not found—please select a suggested address or place the pin manually.</span>
            </div>
          )}

          <div className="rounded-2xl overflow-hidden border border-[#C7AF99]">
            <LeafletMap
              center={coords}
              zoom={14}
              interactivePinPlacement={true}
              onLocationSelect={(newCoords) => setCoords(newCoords)}
              heightClass="h-[320px]"
            />
          </div>
          <p className="text-[11px] text-[#554940]">
            {t.mapHint} {coords.lat}, {coords.lng}.
          </p>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl border border-[#C7AF99] bg-[#F5EDE4] text-xs font-semibold text-[#211B17]"
            >
              {t.backBtn}
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 rounded-xl bg-[#896648] hover:bg-[#6F4F36] text-white text-xs font-bold shadow-xs"
            >
              {t.continueReview}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Submit */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <h2 className="font-heading text-lg font-bold text-[#211B17]">{t.reviewHeading}</h2>

          <div className="p-5 rounded-2xl bg-[#F5EDE4] border border-[#C7AF99] space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#C7AF99]">
              <div>
                <span className="text-[#554940] block">{t.step1Tab}:</span>
                <strong className="text-[#211B17] text-sm">
                  {lang === 'hi' ? (CATEGORIES.find((c) => c.key === category)?.titleHi || category) : category}
                </strong>
              </div>
              <div>
                <span className="text-[#554940] block">{t.cityLabel}:</span>
                <strong className="text-[#211B17] text-sm">{selectedCity}</strong>
              </div>
            </div>

            {/* Selected Address & Exact GPS Coordinates */}
            <div className="p-3.5 rounded-xl bg-[#DFCCB9]/60 border border-[#C7AF99] space-y-1.5">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#896648] shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#554940] block">Selected Address / Landmark</span>
                  <div className="font-bold text-[#211B17] text-xs">{locationName || selectedCity}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 pl-6 text-[11px] text-[#554940]">
                <span>GPS Pin:</span>
                <span className="font-mono font-semibold text-[#896648] bg-[#F5EDE4] px-2 py-0.5 rounded border border-[#C7AF99]/60">
                  {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                </span>
              </div>
            </div>

            <div>
              <span className="text-[#554940] block mb-1">{t.notesLabel}</span>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.notesPlaceholder}
                rows={3}
                className="w-full p-2.5 rounded-xl border border-[#C7AF99] bg-[#E8D9CB]/60 text-xs text-[#211B17] placeholder:text-[#554940]"
              />
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-[#DFCCB9] border border-[#C7AF99]">
              <input
                type="checkbox"
                id="urgentCheck"
                checked={isUrgentHazard}
                onChange={(e) => setIsUrgentHazard(e.target.checked)}
                className="w-4 h-4 text-[#896648] rounded focus:ring-0"
              />
              <label htmlFor="urgentCheck" className="font-semibold text-[#211B17] cursor-pointer">
                {t.urgentCheckbox}
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-5 py-2.5 rounded-xl border border-[#C7AF99] bg-[#F5EDE4] text-xs font-semibold text-[#211B17]"
            >
              {t.backBtn}
            </button>
            <button
              disabled={isSubmitting || !user}
              onClick={handleSubmit}
              className="px-7 py-3 rounded-xl bg-[#896648] hover:bg-[#6F4F36] text-white text-xs font-bold shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? t.submittingBtn : t.submitBtn}
            </button>
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  );
}

export default function CitizenPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-xs">Loading Citizen Portal...</div>}>
      <CitizenReportingContent />
    </Suspense>
  );
}
