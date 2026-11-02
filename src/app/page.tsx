'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SearchForm } from '@/components/booking/SearchForm';
import { 
  POPULAR_ROUTES_SHOWCASE, 
  INITIAL_OPERATORS, 
  INITIAL_COUPONS, 
  TESTIMONIALS_DATA 
} from '@/lib/data/mockData';
import { useAuth } from '@/lib/auth/AuthContext';
import { t } from '@/lib/i18n/translations';
import { 
  Bus, 
  ShieldCheck, 
  Zap, 
  Clock, 
  QrCode, 
  Headphones, 
  RotateCcw, 
  BadgePercent, 
  CheckCircle, 
  Star, 
  ArrowRight, 
  Tag, 
  Check, 
  MapPin, 
  Users,
  Compass,
  Sparkles
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { language } = useAuth();
  const strings = t[language];
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    setTimeout(() => setCopiedCoupon(null), 2500);
  };

  const handleQuickRouteSearch = (origin: string, destination: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    router.push(`/search?from=${encodeURIComponent(origin)}&to=${encodeURIComponent(destination)}&date=${todayStr}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FF]">
      <Navbar />

      <main className="grow">
        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-b from-[#0B1F4D] via-[#0E2965] to-[#123680] text-white pt-10 pb-20 sm:pb-28 overflow-hidden">
          {/* Decorative ambient elements */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#1769E0_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          <div className="absolute top-1/4 -left-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-0 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Top Brand Pill */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-orange-400 mb-6 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Travel, Ek Sathe Jabo — Bangladesh #1 Online Bus Portal</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
              {/* Text column */}
              <div className="lg:col-span-7 space-y-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
                  <span className="text-white block">{strings.heroHeadline}</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF7900] via-orange-400 to-yellow-300">
                    Ek Sathe Jabo
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-slate-200 max-w-xl font-normal leading-relaxed">
                  {strings.heroSubheadline}
                </p>

                {/* Trust mini-stats */}
                <div className="pt-2 flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-slate-200">
                  <div className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>100% Verified Operators</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span>Instant E-Ticket & SMS</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <RotateCcw className="w-4 h-4 text-orange-400" />
                    <span>Hassle-free Cancellation</span>
                  </div>
                </div>
              </div>

              {/* Graphic Showcase (Uploaded Official Banner Art) */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 transform lg:rotate-1 hover:rotate-0 transition duration-500 group">
                  <div className="relative aspect-video sm:aspect-16/10 w-full">
                    <Image
                      src="/assets/hero-banner.jpg"
                      alt="Ek Sathe Jabo Bus Ticketing Bangladesh"
                      fill
                      priority
                      className="object-cover group-hover:scale-103 transition duration-500"
                      sizes="(max-width: 768px) 100vw, 500px"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                    <p className="text-xs text-white/90 font-medium">
                      Volvo • Scania • Hyundai • Luxury Sleeper Coaches
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SEARCH FORM EMBED */}
            <div className="relative z-20 -mb-16 sm:-mb-24">
              <SearchForm />
            </div>
          </div>
        </section>

        {/* 4 STEPS: HOW IT WORKS */}
        <section className="pt-24 sm:pt-32 pb-16 bg-white border-b border-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF7900] bg-orange-50 px-3 py-1 rounded-full">
                Simple & Seamless
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4D] mt-2">
                {strings.howItWorksTitle}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Book your guaranteed seat in four effortless steps in less than 2 minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {/* Step 1 */}
              <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-100 hover:shadow-lg transition group">
                <div className="w-12 h-12 rounded-xl bg-[#1769E0] text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md shadow-blue-500/25 group-hover:scale-110 transition">
                  1
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">{strings.step1Title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{strings.step1Desc}</p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-2xl bg-orange-50/60 border border-orange-100 hover:shadow-lg transition group">
                <div className="w-12 h-12 rounded-xl bg-[#FF7900] text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md shadow-orange-500/25 group-hover:scale-110 transition">
                  2
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">{strings.step2Title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{strings.step2Desc}</p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-100 hover:shadow-lg transition group">
                <div className="w-12 h-12 rounded-xl bg-[#16A34A] text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md shadow-emerald-500/25 group-hover:scale-110 transition">
                  3
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">{strings.step3Title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{strings.step3Desc}</p>
              </div>

              {/* Step 4 */}
              <div className="p-6 rounded-2xl bg-indigo-50/60 border border-indigo-100 hover:shadow-lg transition group">
                <div className="w-12 h-12 rounded-xl bg-[#0B1F4D] text-white flex items-center justify-center font-bold text-lg mb-4 shadow-md shadow-indigo-950/25 group-hover:scale-110 transition">
                  4
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">{strings.step4Title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{strings.step4Desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR ROUTES */}
        <section id="popular-routes" className="py-16 bg-[#F5F8FF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#1769E0] bg-blue-100/70 px-3 py-1 rounded-full">
                  Travel Bangladesh
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4D] mt-2">
                  {strings.popularRoutesTitle}
                </h2>
                <p className="text-sm text-slate-500 mt-1 max-w-xl">
                  {strings.popularRoutesSub}
                </p>
              </div>
              <Link
                href="/search"
                className="mt-4 md:mt-0 inline-flex items-center text-sm font-bold text-[#1769E0] hover:text-blue-800 transition"
              >
                <span>View All Routes</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {POPULAR_ROUTES_SHOWCASE.map((route, idx) => (
                <div
                  key={`route-${idx}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition duration-300 flex flex-col group"
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src={route.image}
                      alt={`${route.origin} to ${route.destination}`}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-500"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-[#0B1F4D] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                      {route.badge}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-[#0B1F4D]/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-orange-400" />
                      <span>{route.duration}</span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-extrabold text-lg text-slate-800">
                          {route.origin} → {route.destination}
                        </h3>
                        <span className="text-base font-extrabold text-[#1769E0]">
                          ৳{route.startingFare}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700">Operators:</span>
                        {route.operators.map((op, i) => (
                          <span key={i} className="bg-slate-100 px-1.5 py-0.5 rounded-xs text-slate-600">
                            {op}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickRouteSearch(route.origin, route.destination)}
                      className="w-full py-2.5 rounded-xl font-bold text-xs bg-blue-50 text-[#1769E0] group-hover:bg-[#1769E0] group-hover:text-white transition flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>Find Buses</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED BUS OPERATORS */}
        <section className="py-16 bg-white border-t border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#16A34A] bg-emerald-50 px-3 py-1 rounded-full">
                Authorized Partners
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4D] mt-2">
                {strings.featuredOperatorsTitle}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {strings.featuredOperatorsSub}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {INITIAL_OPERATORS.map((op) => (
                <div
                  key={op.id}
                  className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200 shadow-xs">
                        <Image
                          src={op.logoURL}
                          alt={op.operatorName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-800">{op.operatorName}</h3>
                        <div className="flex items-center space-x-1 text-xs text-amber-500 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{op.rating}</span>
                          <span className="text-slate-400">• Verified Operator</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <p className="font-semibold text-slate-700">Fleet Speciality:</p>
                      <div className="flex flex-wrap gap-1">
                        {op.busCategories.map((cat, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-medium">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-slate-500">
                      <span className="font-medium text-slate-700">Routes: </span>
                      {op.popularRoutes.join(', ')}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Contact: {op.contactPhone}</span>
                    <button
                      onClick={() => handleQuickRouteSearch('Dhaka', 'Chattogram')}
                      className="text-xs font-bold text-[#FF7900] hover:text-orange-700 transition cursor-pointer"
                    >
                      Book Fleet →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OFFERS & COUPONS SECTION */}
        <section id="offers" className="py-16 bg-[#F5F8FF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF7900] bg-orange-100/70 px-3 py-1 rounded-full">
                Savings & Discounts
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4D] mt-2">
                {strings.offersTitle}
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                {strings.offersSub}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {INITIAL_COUPONS.map((coupon) => (
                <div
                  key={coupon.id}
                  className="bg-linear-to-br from-white to-orange-50/40 rounded-2xl p-6 border-2 border-dashed border-orange-200 shadow-xs relative overflow-hidden flex flex-col justify-between"
                >
                  {/* Decorative tag icon */}
                  <div className="absolute -top-3 -right-3 w-16 h-16 bg-orange-100/60 rounded-full flex items-end justify-start p-2 pointer-events-none">
                    <Tag className="w-6 h-6 text-orange-400" />
                  </div>

                  <div className="space-y-3">
                    <div className="inline-block px-2.5 py-1 rounded-md bg-[#0B1F4D] text-white text-xs font-bold tracking-wider">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `৳${coupon.discountValue} FLAT OFF`}
                    </div>
                    <h3 className="font-extrabold text-xl text-slate-800">{coupon.code}</h3>
                    <p className="text-xs text-slate-600">{coupon.description}</p>
                    <p className="text-[11px] text-slate-400">
                      Min. purchase ৳{coupon.minimumPurchase} • Valid till {coupon.expiryDate}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-orange-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Used by {coupon.usedCount} travelers
                    </span>
                    <button
                      onClick={() => handleCopyCode(coupon.code)}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#FF7900] hover:bg-[#e06a00] text-white shadow-xs transition flex items-center space-x-1 cursor-pointer"
                    >
                      {copiedCoupon === coupon.code ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1" />
                          <span>{strings.copied}</span>
                        </>
                      ) : (
                        <>
                          <span>{strings.copyCode}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES / VALUE PROPOSITION */}
        <section className="py-16 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#1769E0] bg-blue-50 px-3 py-1 rounded-full">
                Peace of Mind
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4D] mt-2">
                {strings.featuresTitle}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 hover:bg-blue-50/50 transition">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#1769E0] flex items-center justify-center mb-3">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">Fast Booking</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Reserve your seats in just 3 clicks with instant seat lock & checkout.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 hover:bg-emerald-50/50 transition">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-[#16A34A] flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">Secure Payments</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bank-grade encryption with verified bKash, Nagad, and Card channels.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 hover:bg-orange-50/50 transition">
                <div className="w-10 h-10 rounded-lg bg-orange-100 text-[#FF7900] flex items-center justify-center mb-3">
                  <Compass className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">Live Seat Availability</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Real-time seat state directly connected to coach operator manifests.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 hover:bg-purple-50/50 transition">
                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center mb-3">
                  <QrCode className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">Instant E-Ticket</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Scannable QR code ticket sent to your phone and saved in your dashboard.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 hover:bg-blue-50/50 transition">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                  <Headphones className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">24/7 Hotline Support</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Dial 16234 anytime for booking queries, boarding help, or delays.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 hover:bg-amber-50/50 transition">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">Easy Cancellation</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Transparent cancellation policy with direct refund to your wallet.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 hover:bg-teal-50/50 transition">
                <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center mb-3">
                  <Bus className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">Verified Operators</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Only licensed luxury coaches with strict vehicle safety audits.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 hover:bg-rose-50/50 transition">
                <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
                  <BadgePercent className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">Transparent Pricing</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Zero hidden counter surcharges. What you see is what you pay.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-16 bg-[#F5F8FF]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF7900] bg-orange-100/70 px-3 py-1 rounded-full">
                Passenger Stories
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B1F4D] mt-2">
                Trusted by Millions Across Bangladesh
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                (Customer reviews collected from verified travelers)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS_DATA.map((t) => (
                <div
                  key={t.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-1 text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 italic leading-relaxed">
                      &ldquo;{t.comment}&rdquo;
                    </p>
                    <div className="text-[11px] font-semibold text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded-xs">
                      {t.route}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center space-x-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={t.avatar}
                        alt={t.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-slate-800">{t.name}</p>
                      <p className="text-[11px] text-slate-400">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="py-12 bg-linear-to-r from-[#0B1F4D] via-[#1769E0] to-[#0B1F4D] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black">
              Ready for your next journey across Bangladesh?
            </h2>
            <p className="text-sm text-blue-100 max-w-xl mx-auto">
              Book with Ek Sathe Jabo today and enjoy guaranteed seats, instant QR tickets, and 24/7 dedicated customer care.
            </p>
            <div className="pt-2">
              <Link
                href="/search"
                className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl font-bold text-sm bg-[#FF7900] hover:bg-[#e66d00] text-white shadow-xl shadow-orange-500/30 transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Bus className="w-4 h-4" />
                <span>Search All Available Buses</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
