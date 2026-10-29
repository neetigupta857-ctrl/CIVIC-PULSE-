'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { loginAsAdmin } from '@/api/authApi';
import { ShieldAlert, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/admin';

  const { setUser } = useApp();
  const [officerId, setOfficerId] = useState('');
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!officerId.trim() || !passkey.trim()) {
      setError('Please provide both Officer ID and Security Passkey.');
      return;
    }

    setIsSubmitting(true);
    try {
      const session = await loginAsAdmin(officerId, passkey);
      setUser(session);
      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Header Badge & Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#DFCCB9] border border-[#C7AF99] text-xs font-semibold text-[#6F4F36]">
            <ShieldAlert className="w-3.5 h-3.5 text-[#896648]" />
            <span>Restricted Municipal Access</span>
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-[#211B17] tracking-tight">
            Administrator Console
          </h1>
          <p className="text-xs text-[#554940] max-w-sm mx-auto">
            Authorized municipal officers only. This portal is strictly protected and monitored by municipal audit controls.
          </p>
        </div>

        {/* Login Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#F5EDE4] border border-[#C7AF99] shadow-sm space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#211B17] mb-1.5">
                Officer ID / Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#896648] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  placeholder="Enter Officer ID"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#C7AF99] bg-[#E8D9CB]/40 text-[#211B17] placeholder:text-[#8C7E72] text-sm focus:outline-none focus:ring-2 focus:ring-[#896648] focus:border-transparent transition-all"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#211B17] mb-1.5">
                Security Passkey / Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#896648] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#C7AF99] bg-[#E8D9CB]/40 text-[#211B17] placeholder:text-[#8C7E72] text-sm focus:outline-none focus:ring-2 focus:ring-[#896648] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#896648] hover:bg-[#6F4F36] text-white text-sm font-semibold transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting ? (
                <span>Authenticating officer...</span>
              ) : (
                <>
                  <span>Authenticate to Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-[#6F4F36] hover:text-[#211B17] font-semibold underline underline-offset-4"
          >
            ← Return to Public Citizen Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
