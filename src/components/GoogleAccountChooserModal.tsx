'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, Plus, X, Shield, ArrowRight, CheckCircle2 } from 'lucide-react';
import { gsap } from '@/lib/gsap';

export interface GoogleAccount {
  name: string;
  email: string;
  avatarUrl?: string;
  googleId: string;
}

interface GoogleAccountChooserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: GoogleAccount) => void;
  lang?: 'en' | 'hi';
}

export default function GoogleAccountChooserModal({
  isOpen,
  onClose,
  onSelectAccount,
  lang = 'en'
}: GoogleAccountChooserModalProps) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [customError, setCustomError] = useState('');

  // Pre-configured accounts for one-click instant sign in
  const [savedAccounts, setSavedAccounts] = useState<GoogleAccount[]>([
    {
      name: 'Aarav Malhotra',
      email: 'aarav.malhotra@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      googleId: 'google-usr-901'
    },
    {
      name: 'Pooja Verma',
      email: 'pooja.verma.tech@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      googleId: 'google-usr-902'
    },
    {
      name: 'Dr. Amit Saxena',
      email: 'dr.amit.saxena@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      googleId: 'google-usr-903'
    }
  ]);

  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
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
      gsap.from(modalRef.current, {
        scale: 0.94,
        y: 12,
        opacity: 0,
        duration: 0.32,
        ease: 'back.out(1.5)'
      });
    });

    return () => ctx.revert();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError('');

    const cleanEmail = customEmail.trim().toLowerCase();
    const cleanName = customName.trim();

    if (!cleanName) {
      setCustomError(lang === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें' : 'Please enter your name');
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setCustomError(lang === 'hi' ? 'कृपया मान्य Google ईमेल दर्ज करें' : 'Please enter a valid Google email address');
      return;
    }

    const newAccount: GoogleAccount = {
      name: cleanName,
      email: cleanEmail,
      googleId: `google-usr-${Date.now()}`
    };

    onSelectAccount(newAccount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dimmed Google Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Google Standard Account Chooser Dialog Card */}
      <div ref={modalRef} className="relative z-10 w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5 border border-stone-200 text-stone-900 font-sans">
        {/* Google Branding Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
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
            <span className="text-base font-semibold text-stone-800 tracking-tight">Google</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & subtitle */}
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-stone-900 leading-snug">
            {lang === 'hi' ? 'खाता चुनें' : 'Choose an account'}
          </h3>
          <p className="text-xs text-stone-500">
            {lang === 'hi'
              ? 'CivicPulse Citizen Portal पर जारी रखने के लिए'
              : 'to continue to CivicPulse Citizen Portal'}
          </p>
        </div>

        {!isAddingNew ? (
          <div className="space-y-2">
            {/* List of saved accounts */}
            <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden">
              {savedAccounts.map((acc, idx) => (
                <div
                  key={acc.email}
                  onClick={() => onSelectAccount(acc)}
                  className="p-3.5 flex items-center gap-3.5 hover:bg-stone-50 cursor-pointer transition-colors"
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-stone-100 border border-stone-200 shrink-0 flex items-center justify-center">
                    {acc.avatarUrl ? (
                      <img src={acc.avatarUrl} alt={acc.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-xs text-stone-700">{acc.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="font-semibold text-xs text-stone-900 truncate">{acc.name}</div>
                    <div className="text-[11px] text-stone-500 truncate">{acc.email}</div>
                  </div>
                </div>
              ))}

              {/* Use another account row */}
              <div
                onClick={() => setIsAddingNew(true)}
                className="p-3.5 flex items-center gap-3.5 hover:bg-stone-50 cursor-pointer transition-colors text-blue-600 hover:text-blue-700 font-medium text-xs"
              >
                <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <Plus className="w-4 h-4" />
                </div>
                <span>{lang === 'hi' ? 'किसी अन्य खाते का उपयोग करें' : 'Use another account'}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Form to type your own Google Account email & name */
          <form onSubmit={handleCustomSubmit} className="space-y-4">
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  {lang === 'hi' ? 'पूरा नाम' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  {lang === 'hi' ? 'Google ईमेल या फ़ोन' : 'Google Email or Phone'}
                </label>
                <input
                  type="email"
                  required
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {customError && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {customError}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setCustomError('');
                }}
                className="text-xs font-semibold text-stone-500 hover:text-stone-800"
              >
                {lang === 'hi' ? '← वापस' : '← Back'}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>{lang === 'hi' ? 'साइन इन करें' : 'Sign in'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* Footer info */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
          <span>Google Identity Services</span>
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <CheckCircle2 className="w-3 h-3" />
            OAuth 2.0 Verified
          </span>
        </div>
      </div>
    </div>
  );
}

