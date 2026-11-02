'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { SearchForm } from '@/components/booking/SearchForm';
import { DataService } from '@/lib/services/dataService';
import { Trip } from '@/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { t } from '@/lib/i18n/translations';
import { 
  Bus, 
  Clock, 
  MapPin, 
  Star, 
  Wifi, 
  BatteryCharging, 
  Coffee, 
  ShieldCheck, 
  Filter, 
  SlidersHorizontal, 
  ArrowUpDown, 
  ChevronRight, 
  Check, 
  Sparkles,
  Info,
  Calendar,
  X
} from 'lucide-react';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useAuth();
  const strings = t[language];

  const fromQuery = searchParams.get('from') || 'Dhaka';
  const toQuery = searchParams.get('to') || 'Chattogram';
  const dateQuery = searchParams.get('date') || '2026-11-02';
  const passengersQuery = searchParams.get('passengers') || '1';

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Filters State
  const [busTypeFilter, setBusTypeFilter] = useState<'all' | 'AC' | 'Non-AC'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'Sleeper Coach' | 'Business Class' | 'Executive Chair' | 'Economy Seater'>('all');
  const [timeFilter, setTimeFilter] = useState<'all' | 'morning' | 'afternoon' | 'night'>('all');
  const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [hasWifiOnly, setHasWifiOnly] = useState(false);
  const [hasChargingOnly, setHasChargingOnly] = useState(false);

  // Sort State
  const [sortBy, setSortBy] = useState<'cheapest' | 'earliest' | 'latest' | 'rating'>('cheapest');

  useEffect(() => {
    setLoading(true);
    // Fetch trips matching route query
    const results = DataService.getTrips({
      from: fromQuery,
      to: toQuery,
      date: dateQuery,
    });
    setTrips(results);
    setLoading(false);
  }, [fromQuery, toQuery, dateQuery]);

  // Extract all unique operators from current results
  const allAvailableOperators = useMemo(() => {
    const set = new Set<string>();
    trips.forEach(t => set.add(t.operatorName));
    return Array.from(set);
  }, [trips]);

  // Toggle operator in filter
  const toggleOperator = (opName: string) => {
    if (selectedOperators.includes(opName)) {
      setSelectedOperators(selectedOperators.filter(o => o !== opName));
    } else {
      setSelectedOperators([...selectedOperators, opName]);
    }
  };

  // Filtered & Sorted list
  const filteredTrips = useMemo(() => {
    let result = [...trips];

    // Filter by Bus Type
    if (busTypeFilter !== 'all') {
      result = result.filter(t => t.busType === busTypeFilter);
    }

    // Filter by Category
    if (categoryFilter !== 'all') {
      result = result.filter(t => t.category === categoryFilter);
    }

    // Filter by Operator
    if (selectedOperators.length > 0) {
      result = result.filter(t => selectedOperators.includes(t.operatorName));
    }

    // Filter by Price
    result = result.filter(t => t.fare <= maxPrice);

    // Filter by Amenities
    if (hasWifiOnly) {
      result = result.filter(t => t.amenities.some(a => a.toLowerCase().includes('wi-fi')));
    }
    if (hasChargingOnly) {
      result = result.filter(t => t.amenities.some(a => a.toLowerCase().includes('charging') || a.toLowerCase().includes('usb')));
    }

    // Filter by Time of Departure
    if (timeFilter !== 'all') {
      result = result.filter(t => {
        const isPM = t.departureTime.includes('PM');
        const hourStr = t.departureTime.split(':')[0];
        let hour = parseInt(hourStr, 10);
        if (isPM && hour !== 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;

        if (timeFilter === 'morning') return hour >= 5 && hour < 12;
        if (timeFilter === 'afternoon') return hour >= 12 && hour < 18;
        if (timeFilter === 'night') return hour >= 18 || hour < 5;
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'cheapest') return a.fare - b.fare;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'earliest') return a.departureTime.localeCompare(b.departureTime);
      if (sortBy === 'latest') return b.departureTime.localeCompare(a.departureTime);
      return 0;
    });

    return result;
  }, [
    trips, 
    busTypeFilter, 
    categoryFilter, 
    selectedOperators, 
    maxPrice, 
    hasWifiOnly, 
    hasChargingOnly, 
    timeFilter, 
    sortBy
  ]);

  const resetFilters = () => {
    setBusTypeFilter('all');
    setCategoryFilter('all');
    setTimeFilter('all');
    setSelectedOperators([]);
    setMaxPrice(3000);
    setHasWifiOnly(false);
    setHasChargingOnly(false);
    setSortBy('cheapest');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FF]">
      <Navbar />

      <main className="grow pb-16">
        {/* TOP SEARCH HEADER */}
        <section className="bg-[#0B1F4D] text-white py-6 shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-orange-400 uppercase tracking-wider">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Route Search</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black flex items-center space-x-2">
                  <span>{fromQuery}</span>
                  <ChevronRight className="w-5 h-5 text-orange-400" />
                  <span>{toQuery}</span>
                </h1>
                <p className="text-xs text-slate-300 mt-0.5 flex items-center space-x-3">
                  <span>Journey Date: <strong>{dateQuery}</strong></span>
                  <span>•</span>
                  <span>Passengers: <strong>{passengersQuery}</strong></span>
                </p>
              </div>

              {/* Modify Search Dialog toggle button */}
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center space-x-1.5 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-orange-400" />
                <span>Modify Search</span>
              </button>
            </div>
          </div>
        </section>

        {/* COMPACT SEARCH DRAWER / BAR */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-6">
          <SearchForm 
            compact 
            initialFrom={fromQuery} 
            initialTo={toQuery} 
            initialDate={dateQuery} 
          />
        </div>

        {/* MAIN RESULTS SECTION */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* SORT & FILTER BAR ON MOBILE */}
          <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-xl shadow-xs border border-slate-200">
            <div className="text-xs font-semibold text-slate-600">
              Showing <strong className="text-slate-900">{filteredTrips.length}</strong> available buses
            </div>

            <div className="flex items-center space-x-3">
              {/* Sort Selector */}
              <div className="flex items-center space-x-1.5 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                <span className="text-slate-500 font-medium hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer"
                >
                  <option value="cheapest">Cheapest Fare</option>
                  <option value="earliest">Earliest Departure</option>
                  <option value="latest">Latest Departure</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowMobileFilter(!showMobileFilter)}
                className="lg:hidden px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 flex items-center space-x-1 border border-blue-200"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* SIDEBAR FILTERS (DESKTOP) */}
            <aside className={`lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-6 ${showMobileFilter ? 'fixed inset-0 z-50 overflow-y-auto m-0 rounded-none' : 'hidden lg:block'}`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-[#1769E0]" />
                  <h3 className="font-extrabold text-sm text-slate-800">Filter Buses</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={resetFilters}
                    className="text-xs text-orange-600 hover:underline font-semibold cursor-pointer"
                  >
                    Reset
                  </button>
                  {showMobileFilter && (
                    <button onClick={() => setShowMobileFilter(false)} className="p-1 text-slate-400">
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Bus Type Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Bus Type
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['all', 'AC', 'Non-AC'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBusTypeFilter(type)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition text-center cursor-pointer ${
                        busTypeFilter === type
                          ? 'bg-[#1769E0] text-white border-[#1769E0]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {type === 'all' ? 'All' : type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Coach Category
                </label>
                <div className="space-y-1.5">
                  {[
                    { label: 'All Coaches', val: 'all' },
                    { label: 'Sleeper Coach', val: 'Sleeper Coach' },
                    { label: 'Business Class', val: 'Business Class' },
                    { label: 'Executive Chair', val: 'Executive Chair' },
                    { label: 'Economy Seater', val: 'Economy Seater' },
                  ].map((cat) => (
                    <button
                      key={cat.val}
                      type="button"
                      onClick={() => setCategoryFilter(cat.val as any)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition cursor-pointer ${
                        categoryFilter === cat.val
                          ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{cat.label}</span>
                      {categoryFilter === cat.val && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Departure Time */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Departure Time
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTimeFilter(timeFilter === 'morning' ? 'all' : 'morning')}
                    className={`p-2 rounded-lg text-xs font-semibold border text-left transition cursor-pointer ${timeFilter === 'morning' ? 'bg-orange-50 border-orange-300 text-orange-800' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                  >
                    🌅 Morning (6AM - 12PM)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeFilter(timeFilter === 'afternoon' ? 'all' : 'afternoon')}
                    className={`p-2 rounded-lg text-xs font-semibold border text-left transition cursor-pointer ${timeFilter === 'afternoon' ? 'bg-orange-50 border-orange-300 text-orange-800' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                  >
                    ☀️ Noon (12PM - 6PM)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeFilter(timeFilter === 'night' ? 'all' : 'night')}
                    className={`col-span-2 p-2 rounded-lg text-xs font-semibold border text-left transition cursor-pointer ${timeFilter === 'night' ? 'bg-orange-50 border-orange-300 text-orange-800' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                  >
                    🌙 Night (6PM - 6AM)
                  </button>
                </div>
              </div>

              {/* Operator Checkboxes */}
              {allAvailableOperators.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Bus Operators
                  </label>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {allAvailableOperators.map((op) => (
                      <label key={op} className="flex items-center space-x-2 text-xs text-slate-700 cursor-pointer hover:text-blue-600">
                        <input
                          type="checkbox"
                          checked={selectedOperators.includes(op)}
                          onChange={() => toggleOperator(op)}
                          className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <span>{op}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Max Fare Slider */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Max Price
                  </label>
                  <span className="text-xs font-extrabold text-[#1769E0]">৳{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="300"
                  max="3000"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#1769E0] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>৳300</span>
                  <span>৳3,000</span>
                </div>
              </div>

              {/* Amenities checkboxes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Amenities
                </label>
                <div className="space-y-2 text-xs">
                  <label className="flex items-center space-x-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={hasWifiOnly}
                      onChange={(e) => setHasWifiOnly(e.target.checked)}
                      className="rounded-sm text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>Wi-Fi Enabled</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={hasChargingOnly}
                      onChange={(e) => setHasChargingOnly(e.target.checked)}
                      className="rounded-sm text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <span>USB Charging Outlets</span>
                  </label>
                </div>
              </div>

              {showMobileFilter && (
                <button
                  onClick={() => setShowMobileFilter(false)}
                  className="w-full py-3 bg-[#1769E0] text-white rounded-xl font-bold text-sm"
                >
                  Apply Filters ({filteredTrips.length} Buses)
                </button>
              )}
            </aside>

            {/* RESULTS LISTING */}
            <div className="lg:col-span-9 space-y-4">
              {loading ? (
                <div className="bg-white p-12 rounded-2xl shadow-xs text-center space-y-3">
                  <div className="w-10 h-10 border-4 border-[#1769E0] border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-sm font-semibold text-slate-600">Finding available buses & live seats...</p>
                </div>
              ) : filteredTrips.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl shadow-xs border border-slate-200 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
                    <Bus className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">No buses found for this filter criteria</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                      Try resetting your filters or adjusting departure dates to see available coaches on this route.
                    </p>
                  </div>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2.5 rounded-xl bg-blue-50 text-[#1769E0] font-bold text-xs hover:bg-blue-100 transition cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                filteredTrips.map((trip) => {
                  return (
                    <div
                      key={trip.id}
                      className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-4 group"
                    >
                      {/* Top Row: Operator & Badge info */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                            {trip.operatorLogo ? (
                              <Image
                                src={trip.operatorLogo}
                                alt={trip.operatorName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                                {trip.operatorName[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-extrabold text-base text-slate-900">
                                {trip.operatorName}
                              </h3>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                                <ShieldCheck className="w-3 h-3 mr-0.5" /> Verified
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium">
                              {trip.busName}
                            </p>
                          </div>
                        </div>

                        {/* Bus tags */}
                        <div className="flex items-center space-x-1.5">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${trip.busType === 'AC' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-100 text-slate-700'}`}>
                            {trip.busType}
                          </span>
                          <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
                            {trip.category}
                          </span>
                          <div className="flex items-center space-x-1 text-xs text-amber-500 font-bold ml-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{trip.rating}</span>
                          </div>
                        </div>
                      </div>

                      {/* Middle Row: Times, Journey & Points */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                        {/* Departure & Arrival visual */}
                        <div className="md:col-span-8 flex items-center justify-between sm:justify-start sm:space-x-8">
                          <div>
                            <div className="text-lg font-black text-slate-900">
                              {trip.departureTime}
                            </div>
                            <div className="text-xs font-semibold text-slate-700">
                              {trip.origin}
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1 max-w-[140px]">
                              {trip.boardingPoints[0] || 'Main Terminal'}
                            </div>
                          </div>

                          <div className="flex flex-col items-center px-2">
                            <span className="text-[11px] font-medium text-slate-400 flex items-center mb-1">
                              <Clock className="w-3 h-3 mr-1 text-slate-400" />
                              {trip.durationFormatted}
                            </span>
                            <div className="w-24 sm:w-32 h-0.5 bg-slate-300 relative">
                              <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-blue-600" />
                              <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-orange-500" />
                            </div>
                            <span className="text-[10px] text-emerald-600 font-bold mt-1">Direct Route</span>
                          </div>

                          <div>
                            <div className="text-lg font-black text-slate-900">
                              {trip.arrivalTime}
                            </div>
                            <div className="text-xs font-semibold text-slate-700">
                              {trip.destination}
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1 max-w-[140px]">
                              {trip.droppingPoints[0] || 'Bus Counter'}
                            </div>
                          </div>
                        </div>

                        {/* Price & CTA Column */}
                        <div className="md:col-span-4 flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                          <div>
                            <div className="text-[11px] text-slate-400 md:text-right">Ticket Fare</div>
                            <div className="text-2xl font-black text-[#1769E0]">
                              ৳{trip.fare}
                              <span className="text-xs font-normal text-slate-500 ml-1">/ seat</span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2 mt-2">
                            <Link
                              href={`/bus/${trip.id}/seats`}
                              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#FF7900] hover:bg-[#e66d00] text-white shadow-md shadow-orange-500/20 transition flex items-center space-x-1 cursor-pointer active:scale-95"
                            >
                              <span>{strings.viewSeats}</span>
                              <ChevronRight className="w-3.5 h-3.5 ml-1" />
                            </Link>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row: Live Seat availability badge & Amenities icons */}
                      <div className="pt-2 border-t border-slate-50 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[11px] ${
                            trip.availableSeatCount > 10
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
                            {trip.availableSeatCount} Seats Available
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] text-slate-500">
                            Boarding: {trip.boardingPoints.length} points
                          </span>
                        </div>

                        {/* Amenities preview */}
                        <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                          {trip.amenities.slice(0, 3).map((amenity, i) => (
                            <span key={i} className="flex items-center text-slate-600">
                              <Check className="w-3 h-3 text-emerald-500 mr-1" />
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F8FF] p-12 text-center text-slate-500">Loading search...</div>}>
      <SearchResultsContent />
    </Suspense>
  );
}
