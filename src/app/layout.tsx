import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import { AppProvider } from '../context/AppContext';
import NavigationHeader from '../components/NavigationHeader';
import SlideDrawer from '../components/SlideDrawer';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'CivicPulse | National Civic Issue Prioritisation Platform (India)',
  description: 'National civic issue prioritisation platform for Indian municipalities by Team Devil Hacks.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${inter.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen text-[#1C1917] flex flex-col selection:bg-[#8C6D53] selection:text-white">
        <AppProvider>
          <NavigationHeader />
          <SlideDrawer />
          <main className="flex-1 w-full pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
          <footer className="w-full border-t border-[#C7AF99] py-5 text-center text-xs text-[#554940] bg-[#F4ECE3]">
            <p className="font-semibold text-[#211B17]">CivicPulse • National Civic Issue Prioritisation Platform • Team Devil Hacks (Civic Tech)</p>
            <p className="mt-1 text-[11px] text-[#554940]">Supporting Municipal Corporations across India (New Delhi, Bengaluru, Mumbai, Hyderabad, Lucknow, Jaipur, etc.)</p>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
