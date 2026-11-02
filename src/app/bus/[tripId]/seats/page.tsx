'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DataService } from '@/lib/services/dataService';
import { Trip, SeatInventoryItem, SeatHold } from '@/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { t } from '@/lib/i18n/translations';
import { 
  Bus, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight, 
  Check, 
  MapPin, 
  Timer, 
  Lock, 
  ChevronLeft,
  Info
} from 'lucide-react';

interface PageProps {
  params: Promise<{ tripId: string }>;
}

function BusSeatSelectionContent({ tripId }: { tripId: string }) {

  const router = useRouter();
  const { user, language } = useAuth();
  const strings = t[language];

  const [trip, setTrip] = useState<Trip | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [activeHold, setActiveHold] = useState<SeatHold | null>(null);
  const [remainingTime, setRemainingTime] = useState<number>(300); // 5 minutes (300s)
  const [sessionToken, setSessionToken] = useState<string>('');
  const [holdError, setHoldError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize session token
  useEffect(() => {
    let token = '';
    if (typeof window !== 'undefined') {
      token = sessionStorage.getItem('esj_user_session') || '';
      if (!token) {
        token = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        sessionStorage.setItem('esj_user_session', token);
      }
      setSessionToken(token);
    }
  }, []);

  // Fetch trip details
  useEffect(() => {
    if (!tripId) return;
    const t = DataService.getTripById(tripId);
    if (t) {
      setTrip(t);
    }
    setLoading(false);
  }, [tripId]);

  // Hold Timer countdown
  useEffect(() => {
    if (!activeHold) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((activeHold.expiresAt - now) / 1000));
      setRemainingTime(diff);

      if (diff <= 0) {
        clearInterval(interval);
        // Hold expired
        setHoldError('Your 5-minute seat reservation hold has expired. Please re-select your seats.');
        setActiveHold(null);
        setSelectedSeats([]);
        if (tripId) {
          const freshTrip = DataService.getTripById(tripId);
          if (freshTrip) setTrip(freshTrip);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeHold, tripId]);

  // Toggle seat selection
  const handleSeatClick = (seatNo: string) => {
    if (!trip) return;
    setHoldError(null);

    const seat = trip.seatInventory[seatNo];
    if (!seat) return;

    // Disallow clicking booked seats
    if (seat.status === 'booked') {
      return;
    }

    // Disallow clicking seats reserved by someone else
    if (seat.status === 'reserved' && seat.heldBy && seat.heldBy !== sessionToken) {
      setHoldError(`Seat ${seatNo} is temporarily reserved by another passenger.`);
      return;
    }

    // Toggle
    if (selectedSeats.includes(seatNo)) {
      const nextSeats = selectedSeats.filter(s => s !== seatNo);
      setSelectedSeats(nextSeats);

      if (nextSeats.length === 0 && activeHold) {
        DataService.releaseSeatHold(activeHold.id);
        setActiveHold(null);
      }
    } else {
      // Max 4 seats per booking
      if (selectedSeats.length >= 4) {
        setHoldError('You can reserve a maximum of 4 seats per transaction.');
        return;
      }
      const nextSeats = [...selectedSeats, seatNo];
      setSelectedSeats(nextSeats);

      // Create or update temporary seat hold
      const res = DataService.createSeatHold(
        trip.id,
        nextSeats,
        user?.uid || 'guest_passenger',
        sessionToken
      );

      if (res.success && res.hold) {
        setActiveHold(res.hold);
        setRemainingTime(300);
      } else {
        setHoldError(res.error || 'Failed to hold seat.');
      }
    }
  };

  // Continue to passenger details
  const handleProceedToPassengers = () => {
    if (selectedSeats.length === 0 || !trip) {
      setHoldError('Please select at least one seat to proceed.');
      return;
    }

    // Save pending booking draft to sessionStorage
    sessionStorage.setItem('esj_draft_tripId', trip.id);
    sessionStorage.setItem('esj_draft_seats', JSON.stringify(selectedSeats));
    sessionStorage.setItem('esj_draft_fare', trip.fare.toString());

    router.push('/booking/passengers');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F8FF]">
        <Navbar />
        <div className="grow flex items-center justify-center p-8">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-4 border-[#1769E0] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-600">Loading seat layout...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F8FF]">
        <Navbar />
        <div className="grow max-w-xl mx-auto p-12 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-slate-800">Trip Not Found</h2>
          <p className="text-sm text-slate-500">The requested bus schedule could not be located.</p>
          <Link href="/search" className="inline-block px-5 py-2.5 bg-[#1769E0] text-white rounded-xl text-sm font-bold">
            Back to Search
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const basePrice = trip.fare;
  const subtotal = selectedSeats.length * basePrice;
  const seatCharge = selectedSeats.length * 50;
  const totalAmount = subtotal + seatCharge;

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const is2x1 = trip.category === 'Sleeper Coach';

  // Format time remaining
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const formattedCountdown = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FF]">
      <Navbar />

      <main className="grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* TOP BACK LINK & TRIP BANNER */}
          <div className="mb-6">
            <Link
              href="/search"
              className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-blue-600 mb-3 transition"
            >
              <ChevronLeft className="w-4 h-4 mr-0.5" />
              <span>Back to search results</span>
            </Link>

            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
                  <span className="text-[#1769E0] font-bold">{trip.operatorName}</span>
                  <span>•</span>
                  <span>{trip.busName}</span>
                  <span>•</span>
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold">{trip.busType}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center space-x-2">
                  <span>{trip.origin}</span>
                  <span className="text-orange-500">→</span>
                  <span>{trip.destination}</span>
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Journey Date: <strong className="text-slate-800">{trip.journeyDate}</strong> | Departure: <strong className="text-slate-800">{trip.departureTime}</strong>
                </p>
              </div>

              {/* Countdown Hold Widget */}
              {activeHold && (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 flex items-center space-x-3 text-amber-900">
                  <div className="p-2 rounded-lg bg-amber-200/80 text-amber-800">
                    <Timer className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">Seats Temporarily Held</p>
                    <p className="text-xs text-amber-800">
                      Auto-release in: <strong className="text-sm font-black text-red-600">{formattedCountdown}</strong>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {holdError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-xs sm:text-sm text-red-700 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-red-500" />
              <span>{holdError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* SEAT LAYOUT CONTAINER */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <h2 className="font-extrabold text-base text-slate-800 flex items-center">
                  <Bus className="w-4 h-4 text-[#1769E0] mr-2" />
                  Select Your Preferred Seats
                </h2>
                <span className="text-xs font-semibold text-slate-500">
                  Max 4 Seats
                </span>
              </div>

              {/* SEAT COLOR LEGEND */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3.5 bg-slate-50 rounded-xl mb-8 text-xs font-semibold text-slate-600">
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-md bg-white border-2 border-blue-400" />
                  <span>Available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-md bg-[#FF7900] text-white flex items-center justify-center text-[10px] font-bold">
                    ✓
                  </div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-md bg-slate-300" />
                  <span>Booked</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-md bg-yellow-400" />
                  <span>Reserved</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-md bg-pink-400 text-white flex items-center justify-center text-[10px]">
                    ♀
                  </div>
                  <span>Ladies</span>
                </div>
              </div>

              {/* BUS COACH CABIN FRAME */}
              <div className="max-w-md mx-auto bg-slate-100 rounded-3xl p-6 sm:p-8 border-4 border-slate-300 relative shadow-inner">
                {/* Front Cabin & Driver */}
                <div className="flex items-center justify-between pb-6 mb-6 border-b-2 border-dashed border-slate-300">
                  {/* Entry Door indicator */}
                  <div className="px-3 py-1 bg-slate-200 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
                    Entry Door
                  </div>

                  {/* Steering Wheel / Driver Position */}
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full border-2 border-slate-600 bg-slate-700 flex items-center justify-center text-white shadow-xs">
                      <span className="text-xs">⎈</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 mt-1 uppercase">Driver</span>
                  </div>
                </div>

                {/* SEAT GRID */}
                <div className="space-y-3.5">
                  {rows.map((row) => {
                    const colLeft1 = `${row}1`;
                    const colLeft2 = `${row}2`;
                    const colRight1 = is2x1 ? `${row}2` : `${row}3`;
                    const colRight2 = is2x1 ? null : `${row}4`;

                    const renderSeat = (seatNo: string | null) => {
                      if (!seatNo || !trip.seatInventory[seatNo]) {
                        return <div className="w-10 h-10 sm:w-11 sm:h-11" />;
                      }

                      const seat = trip.seatInventory[seatNo];
                      const isSelected = selectedSeats.includes(seatNo);
                      const isBooked = seat.status === 'booked';
                      const isReservedOther = seat.status === 'reserved' && seat.heldBy !== sessionToken;
                      const isLadies = seat.status === 'ladies';

                      let btnClass = 'bg-white border-2 border-blue-400 text-slate-800 hover:border-orange-500 hover:scale-105';

                      if (isSelected) {
                        btnClass = 'bg-[#FF7900] border-2 border-orange-600 text-white font-extrabold shadow-md scale-105';
                      } else if (isBooked) {
                        btnClass = 'bg-slate-300 border-2 border-slate-400 text-slate-500 cursor-not-allowed opacity-60';
                      } else if (isReservedOther) {
                        btnClass = 'bg-yellow-400 border-2 border-yellow-500 text-yellow-900 cursor-not-allowed opacity-80';
                      } else if (isLadies) {
                        btnClass = 'bg-pink-100 border-2 border-pink-400 text-pink-700 hover:border-pink-600';
                      }

                      return (
                        <button
                          key={seatNo}
                          type="button"
                          disabled={isBooked || isReservedOther}
                          onClick={() => handleSeatClick(seatNo)}
                          title={`${seatNo} — ৳${seat.price}${isLadies ? ' (Ladies Seat)' : ''}`}
                          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex flex-col items-center justify-center text-xs font-bold transition-all relative cursor-pointer ${btnClass}`}
                        >
                          <span>{seatNo}</span>
                          {isLadies && !isSelected && (
                            <span className="text-[8px] text-pink-600 absolute -bottom-0.5">♀</span>
                          )}
                        </button>
                      );
                    };

                    return (
                      <div key={row} className="flex items-center justify-between">
                        {/* Left Side Seats (2 seats) */}
                        <div className="flex items-center space-x-2">
                          {renderSeat(colLeft1)}
                          {!is2x1 && renderSeat(colLeft2)}
                        </div>

                        {/* Central Aisle Label */}
                        <div className="text-[10px] font-bold text-slate-400 w-6 text-center">
                          {row}
                        </div>

                        {/* Right Side Seats (1 or 2 seats) */}
                        <div className="flex items-center space-x-2">
                          {renderSeat(colRight1)}
                          {colRight2 && renderSeat(colRight2)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bus Rear */}
                <div className="text-center pt-6 mt-6 border-t-2 border-dashed border-slate-300">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Coach Rear
                  </span>
                </div>
              </div>
            </div>

            {/* BOOKING SUMMARY SIDEBAR */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200 space-y-6">
              <h3 className="font-extrabold text-base text-slate-800 pb-3 border-b border-slate-100">
                Booking Fare Summary
              </h3>

              {/* Selected Seats chips */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Selected Seats ({selectedSeats.length})
                </label>
                {selectedSeats.length === 0 ? (
                  <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    No seats selected yet. Click on any white seat in the coach layout.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map((s) => (
                      <span
                        key={s}
                        className="px-3 py-1.5 rounded-lg bg-orange-100 text-orange-800 border border-orange-200 text-xs font-black flex items-center space-x-1"
                      >
                        <span>Seat {s}</span>
                        <span className="text-slate-400 font-normal">| ৳{trip.fare}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Calculation breakdown */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Base Ticket Fare ({selectedSeats.length} × ৳{trip.fare})</span>
                  <span className="font-bold text-slate-800">৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Reservation & Insurance Fee</span>
                  <span className="font-bold text-slate-800">৳{seatCharge}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-900">Total Payable</span>
                  <span className="text-xl font-black text-[#1769E0]">৳{totalAmount}</span>
                </div>
              </div>

              {/* Safety notice */}
              <div className="p-3.5 bg-blue-50 rounded-xl text-[11px] text-blue-800 space-y-1">
                <p className="font-bold flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  Double-Booking Guarantee
                </p>
                <p className="text-blue-700 leading-relaxed">
                  When you select seats, they are instantly held for 5 minutes. No other passenger can purchase them while your timer is running.
                </p>
              </div>

              {/* Continue button */}
              <button
                type="button"
                disabled={selectedSeats.length === 0}
                onClick={handleProceedToPassengers}
                className="w-full py-4 rounded-xl font-bold text-sm bg-linear-to-r from-[#FF7900] to-[#ff912a] hover:from-[#e66d00] hover:to-[#FF7900] text-white shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <span>Continue to Passenger Details</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function BusSeatSelectionWrapper({ params }: PageProps) {
  const unwrappedParams = use(params);
  return <BusSeatSelectionContent tripId={unwrappedParams.tripId} />;
}

export default function BusSeatSelectionPage(props: PageProps) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#F5F8FF] p-12 text-center text-slate-500">Loading seat layout...</div>}>
      <BusSeatSelectionWrapper {...props} />
    </React.Suspense>
  );
}
