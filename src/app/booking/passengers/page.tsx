'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DataService } from '@/lib/services/dataService';
import { Trip, PassengerInfo } from '@/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { 
  Bus, 
  MapPin, 
  ChevronLeft, 
  Tag, 
  Check, 
  ShieldCheck, 
  AlertCircle, 
  CreditCard, 
  User, 
  Phone, 
  Mail,
  Sparkles
} from 'lucide-react';

// Bangladesh mobile number regex: ^(?:\+?880|0)1[3-9]\d{8}$
const bdPhoneRegex = /^(?:\+?880|0)1[3-9]\d{8}$/;

const passengerFormSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  mobile: z.string().regex(bdPhoneRegex, 'Enter a valid Bangladesh mobile number (e.g. 017XXXXXXXX)'),
  email: z.string().email('Enter a valid email address'),
  gender: z.enum(['male', 'female', 'other']),
  emergencyContact: z.string().optional(),
  boardingPoint: z.string().min(1, 'Please select a boarding point'),
  droppingPoint: z.string().min(1, 'Please select a dropping point'),
});

type PassengerFormValues = z.infer<typeof passengerFormSchema>;

export default function PassengerDetailsPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [sessionToken, setSessionToken] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Per-seat passenger names for multi-seat bookings
  const [coPassengerNames, setCoPassengerNames] = useState<Record<string, string>>({});

  // Coupon state
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; message: string } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form setup
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PassengerFormValues>({
    resolver: zodResolver(passengerFormSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      email: user?.email || '',
      mobile: user?.phone || '01712345678',
      gender: 'male',
      boardingPoint: '',
      droppingPoint: '',
    },
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tripId = sessionStorage.getItem('esj_draft_tripId');
      const seatsJson = sessionStorage.getItem('esj_draft_seats');
      const token = sessionStorage.getItem('esj_user_session') || '';
      setSessionToken(token);

      if (!tripId || !seatsJson) {
        router.push('/search');
        return;
      }

      const seats: string[] = JSON.parse(seatsJson);
      setSelectedSeats(seats);

      const t = DataService.getTripById(tripId);
      if (t) {
        setTrip(t);
        if (t.boardingPoints[0]) setValue('boardingPoint', t.boardingPoints[0]);
        if (t.droppingPoints[0]) setValue('droppingPoint', t.droppingPoints[0]);
      }
      setLoading(false);
    }
  }, [router, setValue]);

  // Handle coupon application
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim() || !trip) return;

    setCouponError(null);
    const subtotal = selectedSeats.length * trip.fare;
    const res = DataService.validateCoupon(couponInput.trim(), subtotal);

    if (res.valid && res.discount) {
      setAppliedCoupon({
        code: couponInput.trim().toUpperCase(),
        discount: res.discount,
        message: res.message,
      });
      setCouponError(null);
    } else {
      setCouponError(res.message);
      setAppliedCoupon(null);
    }
  };

  const onSubmit = (data: PassengerFormValues) => {
    if (!trip) return;
    setSubmitError(null);

    // Build passenger details array
    const passengers: PassengerInfo[] = selectedSeats.map((seatNo, idx) => {
      if (idx === 0) {
        return {
          seatNumber: seatNo,
          name: data.fullName,
          gender: data.gender,
        };
      }
      return {
        seatNumber: seatNo,
        name: coPassengerNames[seatNo] || `Passenger (${seatNo})`,
        gender: 'male',
      };
    });

    const res = DataService.createPendingBooking({
      tripId: trip.id,
      userId: user?.uid || 'guest_user',
      selectedSeats,
      passengerDetails: passengers,
      primaryContact: {
        fullName: data.fullName,
        mobile: data.mobile,
        email: data.email,
        emergencyContact: data.emergencyContact,
      },
      boardingPoint: data.boardingPoint,
      droppingPoint: data.droppingPoint,
      couponCode: appliedCoupon?.code,
      sessionToken,
    });

    if (res.success && res.booking) {
      // Store current booking reference for payment
      sessionStorage.setItem('esj_active_booking_ref', res.booking.bookingReference);
      router.push(`/booking/payment?ref=${res.booking.bookingReference}`);
    } else {
      setSubmitError(res.error || 'Failed to create booking.');
    }
  };

  if (loading || !trip) {
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

  const subtotal = selectedSeats.length * trip.fare;
  const seatCharge = selectedSeats.length * 50;
  const discount = appliedCoupon?.discount || 0;
  const grandTotal = Math.max(0, subtotal + seatCharge - discount);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FF]">
      <Navbar />

      <main className="grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* TOP BREADCRUMB */}
          <div className="mb-6">
            <Link
              href={`/bus/${trip.id}/seats`}
              className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-blue-600 mb-2 transition"
            >
              <ChevronLeft className="w-4 h-4 mr-0.5" />
              <span>Back to seat layout</span>
            </Link>
            <h1 className="text-2xl font-black text-slate-900">
              Passenger & Boarding Information
            </h1>
            <p className="text-xs text-slate-500">
              Please enter valid passenger credentials matching government NID or passport for verified bus boarding.
            </p>
          </div>

          {submitError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-xs sm:text-sm text-red-700 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-red-500" />
              <span>{submitError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* MAIN FORM */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* PRIMARY PASSENGER */}
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 flex items-center">
                    <User className="w-4 h-4 text-[#1769E0] mr-2" />
                    Primary Passenger (Seat {selectedSeats[0]})
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Full Name (as per NID/Passport) *
                      </label>
                      <input
                        {...register('fullName')}
                        type="text"
                        placeholder="e.g. Tanvir Hossain"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1769E0]"
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center">
                          <Phone className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                          Bangladesh Mobile Number *
                        </label>
                        <input
                          {...register('mobile')}
                          type="tel"
                          placeholder="e.g. 01712345678"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1769E0]"
                        />
                        {errors.mobile && (
                          <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>
                        )}
                        <p className="text-[10px] text-slate-400 mt-0.5">E-Ticket SMS will be sent here</p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center">
                          <Mail className="w-3.5 h-3.5 text-blue-600 mr-1" />
                          Email Address *
                        </label>
                        <input
                          {...register('email')}
                          type="email"
                          placeholder="e.g. passenger@gmail.com"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1769E0]"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Gender
                        </label>
                        <select
                          {...register('gender')}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1769E0]"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Emergency Contact (Optional)
                        </label>
                        <input
                          {...register('emergencyContact')}
                          type="tel"
                          placeholder="e.g. 01819000000"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1769E0]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* CO-PASSENGERS (if > 1 seat selected) */}
                {selectedSeats.length > 1 && (
                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-3">
                      Co-Passenger Information
                    </h3>
                    <div className="space-y-3">
                      {selectedSeats.slice(1).map((seatNo) => (
                        <div key={seatNo}>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Passenger for Seat {seatNo}
                          </label>
                          <input
                            type="text"
                            placeholder={`Full name for seat ${seatNo}`}
                            value={coPassengerNames[seatNo] || ''}
                            onChange={(e) =>
                              setCoPassengerNames({
                                ...coPassengerNames,
                                [seatNo]: e.target.value,
                              })
                            }
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1769E0]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* BOARDING & DROPPING POINTS */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wider mb-4 flex items-center">
                    <MapPin className="w-4 h-4 text-[#FF7900] mr-2" />
                    Boarding & Dropping Points
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Boarding Point *
                      </label>
                      <select
                        {...register('boardingPoint')}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      >
                        {trip.boardingPoints.map((pt) => (
                          <option key={pt} value={pt}>
                            {pt}
                          </option>
                        ))}
                      </select>
                      {errors.boardingPoint && (
                        <p className="text-red-500 text-xs mt-1">{errors.boardingPoint.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Dropping Point *
                      </label>
                      <select
                        {...register('droppingPoint')}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                      >
                        {trip.droppingPoints.map((pt) => (
                          <option key={pt} value={pt}>
                            {pt}
                          </option>
                        ))}
                      </select>
                      {errors.droppingPoint && (
                        <p className="text-red-500 text-xs mt-1">{errors.droppingPoint.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* PROCEED BUTTON */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl font-bold text-sm bg-linear-to-r from-[#FF7900] to-[#ff912a] hover:from-[#e66d00] hover:to-[#FF7900] text-white shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2 transition cursor-pointer"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Proceed to Payment (৳{grandTotal})</span>
                </button>
              </form>
            </div>

            {/* SIDEBAR: TRIP & FARE DETAILS + COUPON */}
            <div className="lg:col-span-5 space-y-6">
              {/* TRIP OVERVIEW CARD */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-sm text-slate-800">Trip Overview</h3>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                    {trip.busType} Coach
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Operator:</span>
                    <strong className="text-slate-800">{trip.operatorName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Route:</span>
                    <strong className="text-slate-800">{trip.origin} → {trip.destination}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Journey Date:</span>
                    <strong className="text-slate-800">{trip.journeyDate}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Departure Time:</span>
                    <strong className="text-slate-800">{trip.departureTime}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Reserved Seats:</span>
                    <strong className="text-[#FF7900]">{selectedSeats.join(', ')} ({selectedSeats.length})</strong>
                  </div>
                </div>
              </div>

              {/* COUPON APPLICATOR */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider flex items-center">
                  <Tag className="w-3.5 h-3.5 text-[#FF7900] mr-1.5" />
                  Apply Promo Coupon
                </h3>

                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. FIRST50, SAVE100"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="grow bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold uppercase focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#FF7900]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0B1F4D] hover:bg-[#123680] text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {appliedCoupon && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-between">
                    <span className="flex items-center">
                      <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      {appliedCoupon.message}
                    </span>
                    <button
                      type="button"
                      onClick={() => setAppliedCoupon(null)}
                      className="text-red-500 hover:underline font-bold text-[10px]"
                    >
                      Remove
                    </button>
                  </div>
                )}

                {couponError && (
                  <p className="text-red-500 text-xs">{couponError}</p>
                )}

                <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] text-slate-500">
                  <span>Available promos:</span>
                  <button
                    type="button"
                    onClick={() => setCouponInput('FIRST50')}
                    className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded-sm font-bold hover:bg-orange-100"
                  >
                    FIRST50
                  </button>
                  <button
                    type="button"
                    onClick={() => setCouponInput('SAVE100')}
                    className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded-sm font-bold hover:bg-orange-100"
                  >
                    SAVE100
                  </button>
                  <button
                    type="button"
                    onClick={() => setCouponInput('TRAVEL10')}
                    className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded-sm font-bold hover:bg-orange-100"
                  >
                    TRAVEL10
                  </button>
                </div>
              </div>

              {/* FARE BREAKDOWN */}
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-3">
                <h3 className="font-extrabold text-sm text-slate-800 pb-2 border-b border-slate-100">
                  Fare Breakdown
                </h3>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Base Fare ({selectedSeats.length} Seats × ৳{trip.fare})</span>
                    <span className="font-bold text-slate-800">৳{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reservation & Service Fee</span>
                    <span className="font-bold text-slate-800">৳{seatCharge}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-৳{discount}</span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-sm">
                    <span className="font-black text-slate-900">Total Payable</span>
                    <span className="text-xl font-black text-[#1769E0]">৳{grandTotal}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
