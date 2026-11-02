import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth/AuthContext';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Ek Sathe Jabo — Bangladesh Bus Ticket Booking Platform',
  description: 'Book intercity bus tickets online across Bangladesh. Real-time seats, instant QR e-tickets, and verified coach operators like Green Line, Shohagh, Hanif, Shyamoli & Saintmartin.',
  keywords: ['Bus ticket booking', 'Bangladesh bus ticket', 'Ek Sathe Jabo', 'Green line ticket', 'Shohagh ticket', 'Dhaka to Coxs Bazar bus ticket'],
  openGraph: {
    title: 'Ek Sathe Jabo — Travel Smart, Ek Sathe Jabo',
    description: 'Book online bus tickets across all 64 districts of Bangladesh with instant bKash, Nagad, and Card payments.',
    url: 'https://eksathejabo.com',
    siteName: 'Ek Sathe Jabo',
    images: [
      {
        url: '/assets/hero-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Ek Sathe Jabo Bangladesh Bus Booking',
      },
    ],
    locale: 'en_BD',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#F5F8FF] text-[#172554]">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
