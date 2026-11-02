'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DataService } from '@/lib/services/dataService';
import { Booking } from '@/types';
import { 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  Bus, 
  MapPin, 
  Calendar, 
  Clock, 
  UserCheck, 
  QrCode, 
  ChevronLeft 
} from 'lucide-react';

interface PageProps {
  params: Promise<{ bookingRef: string }>;
}

function TicketVerificationContent({ bookingRef }: { bookingRef: string }) {

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkinMsg, setCheckinMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingRef) return;
    const b = DataService.getBookingByRef(bookingRef);
    if (b) {
      setBooking(b);
    }
    setLoading(false);
  }, [bookingRef]);

  const handleCheckIn = (seatNo: string) => {
    if (!booking) return;
    const res = DataService.checkInPassenger(booking.bookingReference, seatNo);
    if (res.success) {
      const refreshed = DataService.getBookingByRef(booking.bookingReference);
      if (refreshed) setBooking(refreshed);
      setCheckinMsg(`Seat ${seatNo} marked as Checked In!`);
      setTimeout(() => setCheckinMsg(null), 3000);
    }
  };

  if (loading) {
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

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F8FF]">
        <Navbar />
        <div className="grow max-w-md mx-auto p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Invalid or Unverified Ticket</h2>
          <p className="text-xs text-slate-500">
            The booking reference <strong className="text-red-600 font-mono">{bookingRef}</strong> does not exist in the official Ek Sathe Jabo database.
          </p>
          <Link href="/" className="inline-block px-5 py-2.5 bg-[#1769E0] text-white rounded-xl text-xs font-bold">
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FF]">
      <Navbar />

      <main className="grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Link
            href="/"
            className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-blue-600 transition"
          >
            <ChevronLeft className="w-4 h-4 mr-0.5" />
            <span>Return to Ek Sathe Jabo</span>
          </Link>

          {/* VERIFICATION BADGE CARD */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                Official Bangladesh E-Ticket Verification
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-2">
                Valid & Verified Ticket
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Reference: <strong className="text-blue-700 font-mono text-sm">{booking.bookingReference}</strong>
              </p>
            </div>

            {checkinMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
                {checkinMsg}
              </div>
            )}

            {/* DETAILS TABLE */}
            <div className="pt-4 border-t border-slate-100 text-left space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Bus Operator</span>
                  <strong className="text-slate-800 text-sm">{booking.operatorName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Coach Type</span>
                  <strong className="text-slate-800 text-sm">{booking.busName} ({booking.busType})</strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Origin & Boarding</span>
                  <strong className="text-slate-800">{booking.origin}</strong>
                  <p className="text-[11px] text-slate-500">{booking.boardingPoint}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Destination</span>
                  <strong className="text-slate-800">{booking.destination}</strong>
                  <p className="text-[11px] text-slate-500">{booking.droppingPoint}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Journey Date & Time</span>
                  <strong className="text-slate-800">{booking.journeyDate} • {booking.departureTime}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Status</span>
                  <span className="inline-block px-2 py-0.5 rounded-md font-bold text-xs bg-emerald-100 text-emerald-800">
                    {booking.paymentStatus} (৳{booking.totalAmount})
                  </span>
                </div>
              </div>

              {/* Passenger Check-In Action List */}
              <div className="space-y-2 pt-2">
                <span className="text-slate-600 font-bold block">
                  Passenger Manifest ({booking.selectedSeats.length} Seats):
                </span>
                {booking.passengerDetails.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                      <p className="text-[11px] text-slate-500">Seat {p.seatNumber} • {p.gender}</p>
                    </div>

                    <div>
                      {p.checkedIn ? (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg flex items-center space-x-1">
                          <CheckCircle className="w-3.5 h-3.5 mr-1" />
                          <span>Boarded</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => handleCheckIn(p.seatNumber)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer"
                        >
                          Check In
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400">
              Verified by Ek Sathe Jabo Secure QR Infrastructure • Asia/Dhaka Timestamp
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function TicketVerificationWrapper({ params }: PageProps) {
  const unwrappedParams = use(params);
  return <TicketVerificationContent bookingRef={unwrappedParams.bookingRef} />;
}

export default function TicketVerificationPage(props: PageProps) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#F5F8FF] p-12 text-center text-slate-500">Verifying ticket...</div>}>
      <TicketVerificationWrapper {...props} />
    </React.Suspense>
  );
}
