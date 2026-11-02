'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DataService } from '@/lib/services/dataService';
import { Booking } from '@/types';
import { 
  CheckCircle, 
  Printer, 
  Download, 
  Share2, 
  Bus, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Ticket, 
  Smartphone, 
  Check, 
  Home, 
  ArrowRight 
} from 'lucide-react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingRef = searchParams.get('ref') || '';

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingRef) {
      router.push('/');
      return;
    }

    const b = DataService.getBookingByRef(bookingRef);
    if (b) {
      setBooking(b);
      // Trigger confetti celebration!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }
    }
    setLoading(false);
  }, [bookingRef, router]);

  const handlePrint = () => {
    window.print();
  };

  if (loading || !booking) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F8FF]">
        <Navbar />
        <div className="grow flex items-center justify-center p-8">
          <div className="w-10 h-10 border-4 border-[#1769E0] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  // Verification URL that will be inside the QR code
  const verificationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/verify/${booking.bookingReference}`
    : `https://eksathejabo.com/verify/${booking.bookingReference}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FF]">
      <div className="no-print">
        <Navbar />
      </div>

      <main className="grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* CELEBRATION TOP BANNER (NO-PRINT) */}
          <div className="no-print text-center mb-8 space-y-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0B1F4D]">
              Booking Confirmed & Guaranteed!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
              Your ticket has been issued with verified payment. An SMS & E-ticket confirmation has been dispatched to <strong>{booking.primaryContact.mobile}</strong>.
            </p>

            {/* ACTION BUTTONS (NO-PRINT) */}
            <div className="pt-3 flex flex-wrap justify-center gap-3">
              <button
                onClick={handlePrint}
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#0B1F4D] hover:bg-[#123680] text-white shadow-md transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Download Ticket PDF</span>
              </button>

              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 transition flex items-center space-x-1.5"
              >
                <Ticket className="w-4 h-4 text-blue-600" />
                <span>Go to My Bookings</span>
              </Link>
            </div>
          </div>

          {/* OFFICIAL HIGH-FIDELITY E-TICKET (PRINTABLE & SCANNABLE) */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden print-shadow-none">
            {/* TICKET TOP HEADER */}
            <div className="bg-[#0B1F4D] text-white p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-4 border-[#FF7900]">
              <div className="flex items-center space-x-3">
                <div className="relative h-11 w-44 bg-white/10 p-1 rounded-lg backdrop-blur-xs">
                  <Image
                    src="/assets/logo.png"
                    alt="Ek Sathe Jabo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                  Official E-Ticket
                </span>
                <p className="text-xl font-black tracking-wider text-white">
                  {booking.bookingReference}
                </p>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white mt-1">
                  PAID & CONFIRMED
                </span>
              </div>
            </div>

            {/* TICKET BODY */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Route & Times */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-100 items-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Departure From
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-0.5">
                    {booking.origin}
                  </h3>
                  <p className="text-xs font-semibold text-slate-700">
                    {booking.boardingPoint}
                  </p>
                  <p className="text-xs text-blue-600 font-bold mt-1">
                    {booking.journeyDate} • {booking.departureTime}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Coach Service</span>
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center my-1">
                    <Bus className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold text-slate-800 text-center">
                    {booking.operatorName}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {booking.busName} ({booking.busType})
                  </span>
                </div>

                <div className="md:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Arrival At
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-0.5">
                    {booking.destination}
                  </h3>
                  <p className="text-xs font-semibold text-slate-700">
                    {booking.droppingPoint}
                  </p>
                  <p className="text-xs text-emerald-600 font-bold mt-1">
                    Estimated: {booking.arrivalTime}
                  </p>
                </div>
              </div>

              {/* Passenger Manifest & Seats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-3">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-700">
                    Passenger Manifest
                  </h4>
                  <div className="space-y-2">
                    {booking.passengerDetails.map((p, i) => (
                      <div key={i} className="flex justify-between items-center text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <div>
                          <p className="font-bold text-slate-800">{p.name}</p>
                          <p className="text-[10px] text-slate-400 capitalize">{p.gender} passenger</p>
                        </div>
                        <span className="px-2.5 py-1 bg-orange-100 text-orange-800 rounded-md font-black text-xs">
                          Seat {p.seatNumber}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact & Payment Info */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-700">
                    Booking & Payment Details
                  </h4>
                  <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex justify-between">
                      <span>Primary Contact:</span>
                      <strong className="text-slate-800">{booking.primaryContact.fullName}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Mobile:</span>
                      <strong className="text-slate-800">{booking.primaryContact.mobile}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <strong className="text-slate-800 uppercase">{booking.paymentMethod}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Transaction Ref:</span>
                      <strong className="text-blue-600 font-mono text-[11px]">{booking.transactionReference || 'VERIFIED-TRX'}</strong>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-200">
                      <span className="font-bold text-slate-900">Total Paid:</span>
                      <strong className="text-[#1769E0] font-black text-sm">৳{booking.totalAmount} BDT</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code & Conductor Verification Section */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
                <div className="space-y-1 text-center sm:text-left">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 flex items-center justify-center sm:justify-start">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5" />
                    Digital Boarding QR Verification
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Show this QR code to the coach conductor upon boarding. Conductor will scan to verify ticket authenticity and mark check-in.
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Security Token: <span className="font-mono">{booking.bookingReference}</span>
                  </p>
                </div>

                {/* Authentic Scannable QR Code */}
                <div className="p-3 bg-white border-2 border-slate-800 rounded-2xl shadow-sm text-center shrink-0">
                  <QRCodeSVG
                    value={verificationUrl}
                    size={110}
                    level="H"
                    includeMargin={false}
                  />
                  <span className="block text-[9px] font-bold text-slate-600 mt-1 uppercase">
                    Scan to Verify
                  </span>
                </div>
              </div>
            </div>

            {/* TICKET FOOTER INSTRUCTIONS */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
              <span>Report at least 20 minutes prior to departure at the boarding counter.</span>
              <span className="font-semibold text-slate-700">Support: 16234 (Hotline)</span>
            </div>
          </div>

          {/* VERIFY LINK (NO-PRINT) */}
          <div className="no-print mt-6 text-center text-xs text-slate-500">
            <span>Want to test conductor view? </span>
            <Link
              href={`/verify/${booking.bookingReference}`}
              className="font-bold text-blue-600 hover:underline"
            >
              Open Conductor Verification Page →
            </Link>
          </div>
        </div>
      </main>

      <div className="no-print">
        <Footer />
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F8FF] p-12 text-center text-slate-500">Loading confirmation...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
