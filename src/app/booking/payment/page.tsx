'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DataService } from '@/lib/services/dataService';
import { Booking } from '@/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { 
  ShieldCheck, 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Lock, 
  ChevronLeft, 
  ArrowRight, 
  Smartphone, 
  Check, 
  Sparkles,
  RefreshCw,
  QrCode
} from 'lucide-react';

function PaymentGatewayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const bookingRef = searchParams.get('ref') || '';
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  // Selected payment provider
  const [selectedProvider, setSelectedProvider] = useState<'bkash' | 'nagad' | 'rocket' | 'card'>('bkash');

  // Gateway Simulation State
  const [isProcessing, setIsProcessing] = useState(false);
  const [simulationStep, setSimulationStep] = useState<'details' | 'otp' | 'pin'>('details');
  const [accountNumber, setAccountNumber] = useState('01712345678');
  const [otpCode, setOtpCode] = useState('123456');
  const [pinCode, setPinCode] = useState('12345');
  const [cardHolder, setCardHolder] = useState('TANVIR HOSSAIN');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('789');

  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingRef) {
      router.push('/search');
      return;
    }

    const b = DataService.getBookingByRef(bookingRef);
    if (b) {
      setBooking(b);
      if (b.paymentStatus === 'VERIFIED') {
        router.push(`/booking/confirmation?ref=${b.bookingReference}`);
      }
    } else {
      setPaymentError('Booking reference not found.');
    }
    setLoading(false);
  }, [bookingRef, router]);

  // Execute payment confirmation
  const handleCompletePayment = async (provider: 'bkash' | 'nagad' | 'rocket' | 'card') => {
    if (!booking) return;

    setIsProcessing(true);
    setPaymentError(null);

    // Simulate network latency (1.2 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const trxPrefix = provider.toUpperCase();
    const randomTrx = `${trxPrefix}-${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Invoke server-side verification logic
    const res = DataService.verifyAndConfirmPayment({
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      provider,
      accountNumber: provider === 'card' ? cardNumber : accountNumber,
      transactionReference: randomTrx,
      amount: booking.totalAmount,
    });

    setIsProcessing(false);

    if (res.success && res.booking) {
      router.push(`/booking/confirmation?ref=${res.booking.bookingReference}`);
    } else {
      setPaymentError(res.error || 'Payment verification failed. Please try again.');
    }
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

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FF]">
      <Navbar />

      <main className="grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* HEADER */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <Link
                href="/booking/passengers"
                className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-blue-600 mb-1 transition"
              >
                <ChevronLeft className="w-4 h-4 mr-0.5" />
                <span>Back to passenger details</span>
              </Link>
              <h1 className="text-2xl font-black text-slate-900">
                Secure Payment Checkout
              </h1>
              <p className="text-xs text-slate-500">
                Booking Reference: <strong className="text-blue-600 font-bold">{booking.bookingReference}</strong>
              </p>
            </div>

            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 self-start sm:self-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>256-Bit SSL Encrypted Payment</span>
            </div>
          </div>

          {/* SIMULATION DEMO NOTICE */}
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start space-x-3">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Sandbox Payment Simulation Mode</p>
              <p className="text-amber-800 mt-0.5 leading-relaxed">
                This environment provides high-fidelity simulation of Bangladesh payment channels (bKash, Nagad, Rocket, Cards). Test payments generate verified transaction tokens, mark tickets confirmed, and prevent double-booking. No real bank accounts are charged.
              </p>
            </div>
          </div>

          {paymentError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-xl text-xs sm:text-sm text-red-700 flex items-center">
              <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-red-500" />
              <span>{paymentError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* PAYMENT CHANNELS & INTERFACE */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* bKash */}
                  <button
                    type="button"
                    onClick={() => { setSelectedProvider('bkash'); setSimulationStep('details'); }}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center space-y-1.5 transition cursor-pointer ${
                      selectedProvider === 'bkash'
                        ? 'border-[#E2136E] bg-pink-50/60 font-bold text-[#E2136E] shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#E2136E] text-white flex items-center justify-center font-black text-xs">
                      b
                    </div>
                    <span className="text-xs">bKash</span>
                  </button>

                  {/* Nagad */}
                  <button
                    type="button"
                    onClick={() => { setSelectedProvider('nagad'); setSimulationStep('details'); }}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center space-y-1.5 transition cursor-pointer ${
                      selectedProvider === 'nagad'
                        ? 'border-[#F7941D] bg-orange-50/60 font-bold text-[#F7941D] shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#F7941D] text-white flex items-center justify-center font-black text-xs">
                      ন
                    </div>
                    <span className="text-xs">Nagad</span>
                  </button>

                  {/* Rocket */}
                  <button
                    type="button"
                    onClick={() => { setSelectedProvider('rocket'); setSimulationStep('details'); }}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center space-y-1.5 transition cursor-pointer ${
                      selectedProvider === 'rocket'
                        ? 'border-[#8C3494] bg-purple-50/60 font-bold text-[#8C3494] shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#8C3494] text-white flex items-center justify-center font-black text-xs">
                      R
                    </div>
                    <span className="text-xs">Rocket</span>
                  </button>

                  {/* Cards */}
                  <button
                    type="button"
                    onClick={() => { setSelectedProvider('card'); setSimulationStep('details'); }}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center justify-center space-y-1.5 transition cursor-pointer ${
                      selectedProvider === 'card'
                        ? 'border-blue-600 bg-blue-50/60 font-bold text-blue-700 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <CreditCard className="w-7 h-7 text-blue-600" />
                    <span className="text-xs">Cards</span>
                  </button>
                </div>
              </div>

              {/* SIMULATED GATEWAY CHECKOUT VIEW */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                {/* Provider Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center space-x-2">
                    {selectedProvider === 'bkash' && (
                      <span className="font-extrabold text-[#E2136E] text-sm flex items-center">
                        bKash Payment Gateway
                      </span>
                    )}
                    {selectedProvider === 'nagad' && (
                      <span className="font-extrabold text-[#F7941D] text-sm flex items-center">
                        Nagad Digital Gateway
                      </span>
                    )}
                    {selectedProvider === 'rocket' && (
                      <span className="font-extrabold text-[#8C3494] text-sm flex items-center">
                        DBBL Rocket Gateway
                      </span>
                    )}
                    {selectedProvider === 'card' && (
                      <span className="font-extrabold text-blue-700 text-sm flex items-center">
                        Visa / Mastercard Gateway
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-black text-slate-900 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    ৳{booking.totalAmount}
                  </span>
                </div>

                {/* Form fields based on selected provider */}
                {selectedProvider !== 'card' ? (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Your {selectedProvider.toUpperCase()} Account Number
                      </label>
                      <input
                        type="tel"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm font-semibold text-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">
                          Demo OTP Code
                        </label>
                        <input
                          type="text"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="123456"
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">
                          Demo PIN
                        </label>
                        <input
                          type="password"
                          value={pinCode}
                          onChange={(e) => setPinCode(e.target.value)}
                          placeholder="•••••"
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm font-semibold text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm font-semibold uppercase text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm font-semibold text-slate-800"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">
                          Expiry (MM/YY)
                        </label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm font-semibold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">
                          CVV / CVC
                        </label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 text-sm font-semibold text-slate-800"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirm Payment CTA */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleCompletePayment(selectedProvider)}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm text-white shadow-md transition flex items-center justify-center space-x-2 cursor-pointer ${
                    selectedProvider === 'bkash'
                      ? 'bg-[#E2136E] hover:bg-[#c20f5e]'
                      : selectedProvider === 'nagad'
                      ? 'bg-[#F7941D] hover:bg-[#d87c10]'
                      : selectedProvider === 'rocket'
                      ? 'bg-[#8C3494] hover:bg-[#722778]'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin mr-1" />
                      <span>Verifying Transaction with Bank...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-1" />
                      <span>Confirm & Pay ৳{booking.totalAmount}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Fast Instant Demo Pay */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => handleCompletePayment('bkash')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                >
                  ⚡ Fast 1-Click Simulated Payment (Auto-Approve)
                </button>
              </div>
            </div>

            {/* SUMMARY TICKET BREAKDOWN */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200 space-y-5">
              <h3 className="font-extrabold text-sm text-slate-800 pb-3 border-b border-slate-100">
                Order Review
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Trip:</span>
                  <strong className="text-slate-800">{booking.origin} → {booking.destination}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Coach:</span>
                  <strong className="text-slate-800">{booking.operatorName} ({booking.busType})</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Journey Date:</span>
                  <strong className="text-slate-800">{booking.journeyDate} at {booking.departureTime}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Boarding Point:</span>
                  <strong className="text-slate-800">{booking.boardingPoint}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Seats ({booking.seatCount}):</span>
                  <strong className="text-orange-600">{booking.selectedSeats.join(', ')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Passenger Name:</span>
                  <strong className="text-slate-800">{booking.primaryContact.fullName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone:</span>
                  <strong className="text-slate-800">{booking.primaryContact.mobile}</strong>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold">৳{booking.subtotal}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Service Fee</span>
                  <span className="font-bold">৳{booking.seatCharge}</span>
                </div>
                {booking.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount ({booking.couponCode})</span>
                    <span>-৳{booking.discount}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
                  <span>Total Due</span>
                  <span className="text-2xl text-[#1769E0]">৳{booking.totalAmount}</span>
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

export default function PaymentGatewayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F8FF] p-12 text-center text-slate-500">Loading payment gateway...</div>}>
      <PaymentGatewayContent />
    </Suspense>
  );
}
