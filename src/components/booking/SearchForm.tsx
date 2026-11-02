'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BANGLADESH_CITIES } from '@/lib/data/mockData';
import { useAuth } from '@/lib/auth/AuthContext';
import { t } from '@/lib/i18n/translations';
import { 
  MapPin, 
  ArrowRightLeft, 
  Calendar, 
  Users, 
  Search, 
  AlertCircle 
} from 'lucide-react';

interface SearchFormProps {
  initialFrom?: string;
  initialTo?: string;
  initialDate?: string;
  compact?: boolean;
}

export function SearchForm({
  initialFrom = 'Dhaka',
  initialTo = 'Chattogram',
  initialDate,
  compact = false
}: SearchFormProps) {
  const router = useRouter();
  const { language } = useAuth();
  const strings = t[language];

  const [fromCity, setFromCity] = useState(initialFrom);
  const [toCity, setToCity] = useState(initialTo);
  const [journeyDate, setJourneyDate] = useState(initialDate || '2026-11-02');
  const [minDate, setMinDate] = useState('2026-11-02');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMinDate(today);
    if (!initialDate) {
      setJourneyDate(today);
    }
  }, [initialDate]);

  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
    setError(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromCity || !toCity) {
      setError(language === 'en' ? 'Please select both departure and destination cities.' : 'অনুগ্রহ করে যাত্রা শুরু এবং গন্তব্য শহর নির্বাচন করুন।');
      return;
    }

    if (fromCity.toLowerCase() === toCity.toLowerCase()) {
      setError(language === 'en' ? 'Origin and destination cannot be the same city.' : 'যাত্রা শুরু এবং গন্তব্যের শহর একই হতে পারবে না।');
      return;
    }

    if (journeyDate < minDate) {
      setError(language === 'en' ? 'Journey date cannot be in the past.' : 'যাত্রার তারিখ অতীত হতে পারবে না।');
      return;
    }

    setError(null);
    const query = new URLSearchParams({
      from: fromCity,
      to: toCity,
      date: journeyDate,
      passengers: passengers.toString(),
    });
    if (returnDate) {
      query.append('returnDate', returnDate);
    }

    router.push(`/search?${query.toString()}`);
  };

  return (
    <div className={`w-full ${compact ? 'bg-white p-4 rounded-xl shadow-md border border-slate-200' : 'bg-white rounded-2xl shadow-2xl p-5 sm:p-7 border border-blue-100'}`}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg text-xs sm:text-sm text-red-700 flex items-center">
          <AlertCircle className="w-4 h-4 mr-2 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-4 items-center">
          {/* FROM CITY */}
          <div className="md:col-span-3 relative">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center">
              <MapPin className="w-3.5 h-3.5 text-blue-600 mr-1" />
              {strings.from}
            </label>
            <div className="relative">
              <select
                value={fromCity}
                onChange={(e) => { setFromCity(e.target.value); setError(null); }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#1769E0] focus:bg-white transition appearance-none cursor-pointer"
              >
                {BANGLADESH_CITIES.map((city) => (
                  <option key={`from-${city}`} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                ▼
              </div>
            </div>
          </div>

          {/* SWAP BUTTON */}
          <div className="md:col-span-1 flex justify-center py-1 md:py-0">
            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap Cities"
              className="p-2.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 shadow-xs hover:rotate-180 transition duration-300 active:scale-90 cursor-pointer"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* TO CITY */}
          <div className="md:col-span-3 relative">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center">
              <MapPin className="w-3.5 h-3.5 text-[#FF7900] mr-1" />
              {strings.to}
            </label>
            <div className="relative">
              <select
                value={toCity}
                onChange={(e) => { setToCity(e.target.value); setError(null); }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#FF7900] focus:bg-white transition appearance-none cursor-pointer"
              >
                {BANGLADESH_CITIES.map((city) => (
                  <option key={`to-${city}`} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                ▼
              </div>
            </div>
          </div>

          {/* JOURNEY DATE */}
          <div className="md:col-span-3 relative">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center">
              <Calendar className="w-3.5 h-3.5 text-blue-600 mr-1" />
              {strings.journeyDate}
            </label>
            <input
              type="date"
              min={minDate}
              value={journeyDate}
              onChange={(e) => setJourneyDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition cursor-pointer"
            />
          </div>

          {/* PASSENGERS */}
          <div className="md:col-span-2 relative">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center">
              <Users className="w-3.5 h-3.5 text-blue-600 mr-1" />
              {strings.passengers}
            </label>
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition appearance-none cursor-pointer"
            >
              {[1, 2, 3, 4].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Seat' : 'Seats'}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 top-6 flex items-center px-3 text-slate-400">
              ▼
            </div>
          </div>
        </div>

        {/* Action row with quick tags and search CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Trending Routes:</span>
            <button
              type="button"
              onClick={() => { setFromCity('Dhaka'); setToCity('Chattogram'); }}
              className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer"
            >
              Dhaka → Ctg
            </button>
            <button
              type="button"
              onClick={() => { setFromCity('Dhaka'); setToCity("Cox's Bazar"); }}
              className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer"
            >
              Dhaka → Cox&apos;s Bazar
            </button>
            <button
              type="button"
              onClick={() => { setFromCity('Dhaka'); setToCity('Sylhet'); }}
              className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer"
            >
              Dhaka → Sylhet
            </button>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-linear-to-r from-[#FF7900] to-[#ff912a] hover:from-[#e66d00] hover:to-[#FF7900] text-white shadow-lg shadow-orange-500/25 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Search className="w-4 h-4 text-white" />
            <span>{strings.searchBuses}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
