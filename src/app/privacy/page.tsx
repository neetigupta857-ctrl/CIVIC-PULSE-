'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, MapPin, Camera, Lock, EyeOff } from 'lucide-react';

export default function PrivacyHelpPage() {
  const { lang } = useApp();

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 space-y-8">
      {/* Header */}
      <div className="space-y-2 border-b border-[#C7AF99] pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DFCCB9] border border-[#C7AF99] text-xs font-bold text-[#6F4F36]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#896648]" />
          <span>{lang === 'hi' ? 'नागरिक डेटा सुरक्षा नीति' : 'CIVICPULSE CITIZEN PRIVACY SAFEGUARD'}</span>
        </div>
        <h1 className="font-heading text-3xl font-extrabold text-[#211B17]">
          {lang === 'hi' ? 'डेटा गोपनीयता एवं साक्ष्य नीति' : 'Data Privacy & Evidence Policy'}
        </h1>
        <p className="text-sm text-[#554940]">
          {lang === 'hi'
            ? 'सिविक पल्स आपकी पहचान, स्थान की जानकारी (GPS) और फोटो साक्ष्यों को सुरक्षित रखता है।'
            : 'How CivicPulse protects your identity, location telemetry, and photographic evidence.'}
        </p>
      </div>

      {/* Grid of Key Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-[#F5EDE4] border border-[#C7AF99] space-y-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-[#896648] text-white flex items-center justify-center">
            <Lock className="w-4.5 h-4.5" />
          </div>
          <h2 className="font-heading text-lg font-bold text-[#211B17]">
            {lang === 'hi' ? 'शिकायतकर्ता की पहचान की सुरक्षा' : 'Reporter Identity Anonymity'}
          </h2>
          <p className="text-xs text-[#554940] leading-relaxed">
            {lang === 'hi'
              ? 'सार्वजनिक ट्रैकिंग पृष्ठों या मानचित्र पर आपका नाम, ईमेल व फोन नंबर कभी प्रदर्शित नहीं किए जाते। केवल अधिकृत नगर निगम अधिकारियों के पास सत्यापन का अधिकार होता है।'
              : 'Your name, phone number, and Google email are never shown on public incident tracking links or community maps. Only municipal officers with verified authority have access to follow up on safety matters.'}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#F5EDE4] border border-[#C7AF99] space-y-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-[#896648] text-white flex items-center justify-center">
            <MapPin className="w-4.5 h-4.5" />
          </div>
          <h2 className="font-heading text-lg font-bold text-[#211B17]">
            {lang === 'hi' ? 'लोकेशन टेलीमेट्री व मैनुअल पिन' : 'Location Telemetry & Manual Pin'}
          </h2>
          <p className="text-xs text-[#554940] leading-relaxed">
            {lang === 'hi'
              ? 'GPS अनुमति केवल समस्या दर्ज करते समय ली जाती है। यदि आप लोकेशन अनुमति अस्वीकार करते हैं, तो आप नक्शे पर कहीं भी क्लिक करके सीधे पिन लगा सकते हैं।'
              : 'GPS location is requested strictly on-demand when capturing a hazard. If you deny browser location permissions, you can always drag or click the map pin manually on our interactive Leaflet map.'}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#F5EDE4] border border-[#C7AF99] space-y-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-[#896648] text-white flex items-center justify-center">
            <Camera className="w-4.5 h-4.5" />
          </div>
          <h2 className="font-heading text-lg font-bold text-[#211B17]">
            {lang === 'hi' ? 'फोटो सत्यापन व साक्ष्य गोपनीयता' : 'Photograph Moderation & Privacy'}
          </h2>
          <p className="text-xs text-[#554940] leading-relaxed">
            {lang === 'hi'
              ? 'अपलोड किए गए फोटो सार्वजनिक होने से पहले सत्यापित किए जाते हैं। डुप्लिकेट शिकायतों में नागरिकों द्वारा जोड़े गए आंतरिक फोटो निजी रखे जाते हैं।'
              : 'Incoming photos undergo internal screening before publication. Private citizen evidence added to existing duplicate clusters remains private to prevent exposing personal metadata or faces.'}
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#F5EDE4] border border-[#C7AF99] space-y-3 shadow-xs">
          <div className="w-9 h-9 rounded-xl bg-[#896648] text-white flex items-center justify-center">
            <EyeOff className="w-4.5 h-4.5" />
          </div>
          <h2 className="font-heading text-lg font-bold text-[#211B17]">
            {lang === 'hi' ? '20-मीटर डी-डुप्लिकेशन नियम' : '20-Meter De-Duplication Protocol'}
          </h2>
          <p className="text-xs text-[#554940] leading-relaxed">
            {lang === 'hi'
              ? 'एक ही गड्ढे या खतरे पर 20 मीटर के भीतर आने वाली सभी शिकायतों को एक समेकित मामले में मिला दिया जाता है, जिससे सार्वजनिक मानचित्र साफ रहता है।'
              : 'Multiple complaints within 20 meters are merged into a single consolidated case on public maps to prevent map clutter, while preserving individual contributor audit trails securely.'}
          </p>
        </div>
      </div>

      <div className="pt-4 text-center">
        <Link
          href="/"
          className="text-xs font-semibold text-[#896648] hover:text-[#211B17] underline underline-offset-4"
        >
          {lang === 'hi' ? '← मुख्य पृष्ठ पर वापस जाएं' : '← Return to CivicPulse Home'}
        </Link>
      </div>
    </div>
  );
}
