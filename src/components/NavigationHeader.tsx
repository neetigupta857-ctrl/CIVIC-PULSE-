'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import GoogleAccountChooserModal, { GoogleAccount } from './GoogleAccountChooserModal';
import { Menu, Globe, LogIn, LogOut, User, ChevronDown } from 'lucide-react';
import { gsap } from '@/lib/gsap';

export default function NavigationHeader() {
  const { lang, setLang, setIsDrawerOpen, user, setUser, logout, t, isMounted } = useApp();
  const router = useRouter();
  const [isGoogleChooserOpen, setIsGoogleChooserOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleAccountChosen = async (account: GoogleAccount) => {
    setIsSigningIn(true);
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
      }
    } catch (err) {
      console.error('Sign-in error in navbar:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setIsProfileDropdownOpen(false);
    router.push('/');
    router.refresh();
  };

  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
      });
    }, headerRef);

    return () => ctx.revert();
  }, []);

  return (
    <header ref={headerRef} className="sticky top-0 z-40 w-full bg-[#F4ECE3]/95 backdrop-blur-md border-t-[3px] border-t-[#4A1D2F] border-b border-[#C7AF99] px-4 sm:px-6 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: CivicPulse emblem + sharp brand lockup */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-[#896648] group-hover:bg-[#6F4F36] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-all">
            <svg
              className="w-4.5 h-4.5 fill-current text-white"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div>
            <span className="font-heading text-2xl font-bold tracking-tight text-[#211B17] block leading-none">
              CivicPulse
            </span>
            <span className="text-[11px] text-[#554940] font-medium block mt-0.5">
              {t.headerTagline}
            </span>
          </div>
        </Link>

        {/* Right: Architectural controls (Language, Sign In / Profile, Menu) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher Button */}
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-[#C7AF99] bg-[#F5EDE4] text-[#211B17] hover:border-[#896648] hover:text-[#896648] transition-colors shadow-2xs"
            title={lang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
            aria-label="Toggle Language"
            suppressHydrationWarning
          >
            <Globe className="w-3.5 h-3.5 text-[#896648]" />
            <span suppressHydrationWarning>{lang === 'hi' ? 'English' : 'हिंदी'}</span>
          </button>

          {/* User Profile / Sign In Section */}
          {isMounted && user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-[#C7AF99] bg-[#F5EDE4] hover:bg-[#DFCCB9] transition-all shadow-2xs cursor-pointer"
                aria-label="User Profile"
              >
                <div className="w-6 h-6 rounded-full bg-[#896648] text-white flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="text-xs font-bold text-[#211B17] max-w-[85px] sm:max-w-[120px] truncate hidden xs:inline">
                  {user.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-[#554940]" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-1.5 w-56 bg-[#F5EDE4] border border-[#C7AF99] rounded-2xl shadow-xl z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-[#C7AF99]/60 mb-1">
                      <div className="font-bold text-xs text-[#211B17] truncate">{user.name}</div>
                      <div className="text-[11px] text-[#554940] truncate">{user.email || user.badge || 'Citizen Account'}</div>
                    </div>

                    <Link
                      href="/citizen"
                      onClick={() => setIsProfileDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-[#211B17] hover:bg-[#DFCCB9] transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-[#896648]" />
                      <span>{lang === 'hi' ? 'मेरा डैशबोर्ड / रिपोर्ट' : 'Citizen Portal'}</span>
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'साइन आउट' : 'Sign Out'}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsGoogleChooserOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold border border-[#C7AF99] bg-[#211B17] hover:bg-[#3D352F] text-white transition-all shadow-xs active:scale-[0.98] cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
              <span>{lang === 'hi' ? 'साइन इन' : 'Sign In'}</span>
            </button>
          )}

          {/* High-contrast tactile square Hamburger Menu Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-10 h-10 rounded-lg bg-[#211B17] text-[#F5EDE4] hover:bg-[#896648] flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#896648] shadow-xs"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* Google Account Chooser Modal triggered from Nav Header */}
      <GoogleAccountChooserModal
        isOpen={isGoogleChooserOpen}
        onClose={() => setIsGoogleChooserOpen(false)}
        onSelectAccount={handleAccountChosen}
        lang={lang}
      />
    </header>
  );
}

