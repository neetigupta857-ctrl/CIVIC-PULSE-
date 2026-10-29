'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { resetDemoDataset } from '../api/incidentsApi';
import { gsap } from '@/lib/gsap';
import {
  X,
  Home,
  UserCheck,
  ShieldAlert,
  Search,
  RotateCcw,
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function SlideDrawer() {
  const { isDrawerOpen, setIsDrawerOpen, t, user, logout } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDrawerOpen || !panelRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      if (backdropRef.current) {
        gsap.from(backdropRef.current, {
          opacity: 0,
          duration: 0.25,
          ease: 'power1.out'
        });
      }
      if (panelRef.current) {
        gsap.from(panelRef.current, {
          x: '100%',
          duration: 0.35,
          ease: 'power3.out'
        });
      }
      gsap.from('.drawer-item', {
        x: 16,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        delay: 0.08,
        ease: 'power2.out'
      });
    });

    return () => ctx.revert();
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const handleClose = () => setIsDrawerOpen(false);

  const handleReset = async () => {
    if (confirm('Reset Lucknow mock database to original default state?')) {
      await resetDemoDataset();
      handleClose();
      router.refresh();
      window.location.reload();
    }
  };

  const handleLogout = async () => {
    await logout();
    handleClose();
    router.push('/');
    router.refresh();
  };

  const isAdmin = user?.role === 'ADMIN';

  // Public-facing navigation pages in the sidebar
  const publicNavLinks = [
    {
      href: '/',
      label: t.navHome,
      icon: Home
    },
    {
      href: '/citizen',
      label: t.navCitizen,
      icon: UserCheck
    },
    {
      href: '/track',
      label: t.navTrack,
      icon: Search
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed Overlay Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Deep Charcoal-Brown Slide-over Drawer Panel */}
      <aside className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div ref={panelRef} className="w-screen max-w-sm bg-[#211D1A] text-[#F4EFEA] p-6 shadow-2xl flex flex-col justify-between border-l border-[#38322D]">
          {/* Header & Navigation */}
          <div>
            {/* Header Area */}
            <div className="flex items-center justify-between pb-6 border-b border-[#38322D]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#8D6E52] text-white flex items-center justify-center shadow-xs">
                  <svg
                    className="w-4 h-4 fill-current text-white"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <div>
                  <span className="font-heading text-xl font-bold text-[#F4EFEA] tracking-tight block leading-none">
                    CivicPulse
                  </span>
                  <span className="text-[10px] text-[#A89F96] font-medium block mt-0.5">
                    India Civic Triage Engine
                  </span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-[#2C2622] hover:bg-[#38312B] border border-[#3D352F] text-[#A89F96] hover:text-[#F4EFEA] flex items-center justify-center transition-colors shadow-2xs"
                aria-label="Close Drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Links: Strictly Public Citizen Portal */}
            <div className="mt-6 space-y-4">
              <div className="space-y-1">
                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#A89F96]">
                  Public Portal
                </div>
                <nav className="space-y-1">
                  {publicNavLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={handleClose}
                        className={`drawer-item flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-colors border ${
                          isActive
                            ? 'bg-[#2E2824] text-[#F4EFEA] font-semibold border-[#4A3F37] shadow-2xs'
                            : 'text-[#C9BFB5] hover:text-[#F4EFEA] hover:bg-[#2A2420] border-transparent'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-[#8D6E52] shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Drawer Footer Actions */}
          <div className="pt-6 border-t border-[#38322D] space-y-3">
            {user && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-950/60 bg-rose-950/30 transition-colors border border-rose-900/50"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>Sign Out ({user.name.split(' ')[0]})</span>
              </button>
            )}

            <div className="text-[10px] text-center text-[#A89F96] pt-1">
              CivicPulse v1.0 • National Civic Tech
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
