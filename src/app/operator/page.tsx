'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth/AuthContext';
import { DataService } from '@/lib/services/dataService';
import { Operator, Bus, Trip, Booking } from '@/types';
import { 
  Truck, 
  Bus as BusIcon, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ShieldCheck, 
  CheckCircle, 
  Check, 
  Search, 
  DollarSign, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export default function OperatorDashboardPage() {
  const { user } = useAuth();
  const operatorId = user?.operatorId || 'op-greenline';

  const [operator, setOperator] = useState<Operator | null>(null);
  const [operatorTrips, setOperatorTrips] = useState<Trip[]>([]);
  const [operatorBuses, setOperatorBuses] = useState<Bus[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string>('');
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketCheckinMsg, setTicketCheckinMsg] = useState<string | null>(null);

  const loadData = () => {
    const ops = DataService.getOperators();
    const currentOp = ops.find(o => o.id === operatorId) || ops[0];
    setOperator(currentOp);

    const trips = DataService.getOperatorTrips(currentOp.id);
    setOperatorTrips(trips);
    if (trips.length > 0 && !selectedTripId) {
      setSelectedTripId(trips[0].id);
    }

    const allB = DataService.getAllBuses().filter(b => b.operatorId === currentOp.id);
    setOperatorBuses(allB);

    const books = DataService.getAllBookings().filter(b => b.operatorId === currentOp.id);
    setAllBookings(books);
  };

  useEffect(() => {
    loadData();
  }, [operatorId]);

  // Selected trip manifest
  const selectedTrip = operatorTrips.find(t => t.id === selectedTripId);
  const tripBookings = allBookings.filter(b => b.tripId === selectedTripId && b.bookingStatus === 'CONFIRMED');

  // Total Operator Revenue
  const totalRevenue = allBookings
    .filter(b => b.bookingStatus === 'CONFIRMED')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const totalPassengers = allBookings
    .filter(b => b.bookingStatus === 'CONFIRMED')
    .reduce((sum, b) => sum + b.seatCount, 0);

  // Check in passenger
  const handleCheckInPassenger = (bookingRef: string, seatNo: string) => {
    const res = DataService.checkInPassenger(bookingRef, seatNo);
    if (res.success) {
      loadData();
      setTicketCheckinMsg(`Seat ${seatNo} successfully marked boarded!`);
      setTimeout(() => setTicketCheckinMsg(null), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FF]">
      <Navbar />

      <main className="grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* OPERATOR HEADER */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 shrink-0 shadow-sm">
                {operator?.logoURL ? (
                  <Image src={operator.logoURL} alt={operator.operatorName} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-emerald-100 flex items-center justify-center font-black text-emerald-800">
                    GL
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    {operator?.operatorName || 'Green Line Paribahan'}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Verified Bus Partner
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assigned Terminal: {operator?.address} • Helpline: {operator?.contactPhone}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs self-start md:self-auto">
              <span className="bg-slate-100 px-3 py-1.5 rounded-xl font-bold text-slate-700">
                Fleet: {operatorBuses.length} Coaches
              </span>
              <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-xl font-bold">
                Trips: {operatorTrips.length} Active
              </span>
            </div>
          </div>

          {/* STATS TILES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500">Total Ticket Revenue</span>
                <p className="text-2xl font-black text-slate-900">৳{totalRevenue}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500">Passengers Boarded</span>
                <p className="text-2xl font-black text-slate-900">{totalPassengers}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <BusIcon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500">Active Coach Schedules</span>
                <p className="text-2xl font-black text-purple-700">{operatorTrips.length}</p>
              </div>
            </div>
          </div>

          {ticketCheckinMsg && (
            <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 text-xs sm:text-sm text-emerald-800 rounded-r-xl font-bold flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
              <span>{ticketCheckinMsg}</span>
            </div>
          )}

          {/* MANIFEST AND TRIP CONTROLLER */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT: SCHEDULED TRIPS SELECTOR */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-5 shadow-xs border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-800 pb-2 border-b border-slate-100 flex items-center">
                <Calendar className="w-4 h-4 text-[#1769E0] mr-2" />
                Select Trip Manifest
              </h3>

              <div className="space-y-2">
                {operatorTrips.map((t) => {
                  const isSelected = t.id === selectedTripId;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTripId(t.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition cursor-pointer ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/60 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <strong className="text-xs font-black text-slate-900">{t.origin} → {t.destination}</strong>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200">
                          {t.busType}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {t.journeyDate} • {t.departureTime}
                      </p>
                      <div className="mt-2 flex justify-between text-[11px] font-semibold text-slate-600">
                        <span>Fare: ৳{t.fare}</span>
                        <span className="text-emerald-700 font-bold">{t.availableSeatCount} seats avail.</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT: PASSENGER MANIFEST & LIVE SEAT STATUS */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200 space-y-6">
              {selectedTrip ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Trip Manifest
                      </span>
                      <h2 className="text-lg font-black text-slate-900">
                        {selectedTrip.origin} → {selectedTrip.destination}
                      </h2>
                      <p className="text-xs text-slate-500">
                        Date: <strong>{selectedTrip.journeyDate}</strong> at <strong>{selectedTrip.departureTime}</strong> ({selectedTrip.busName})
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-bold">
                        {tripBookings.length} Bookings on File
                      </span>
                    </div>
                  </div>

                  {/* MANIFEST PASSENGERS TABLE */}
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-3">
                      Confirmed Passengers & Check-in Status
                    </h4>

                    {tripBookings.length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 rounded-xl text-xs text-slate-500">
                        No passengers have booked seats on this specific scheduled run yet.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600">
                          <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] border-b border-slate-200">
                            <tr>
                              <th className="p-3">Seat</th>
                              <th className="p-3">Passenger</th>
                              <th className="p-3">Phone</th>
                              <th className="p-3">Boarding Point</th>
                              <th className="p-3">Booking Ref</th>
                              <th className="p-3 text-right">Boarding Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {tripBookings.map((b) =>
                              b.passengerDetails.map((p, idx) => (
                                <tr key={`${b.id}-${p.seatNumber}-${idx}`} className="hover:bg-slate-50/60">
                                  <td className="p-3 font-black text-orange-600 text-sm">
                                    {p.seatNumber}
                                  </td>
                                  <td className="p-3 font-bold text-slate-800">
                                    {p.name}
                                    <span className="block text-[10px] text-slate-400 capitalize">{p.gender}</span>
                                  </td>
                                  <td className="p-3 font-medium">{b.primaryContact.mobile}</td>
                                  <td className="p-3">{b.boardingPoint}</td>
                                  <td className="p-3 font-mono font-bold text-blue-700">
                                    <Link href={`/verify/${b.bookingReference}`} className="hover:underline">
                                      {b.bookingReference}
                                    </Link>
                                  </td>
                                  <td className="p-3 text-right">
                                    {p.checkedIn ? (
                                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                        <Check className="w-3 h-3 mr-1" />
                                        Boarded
                                      </span>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => handleCheckInPassenger(b.bookingReference, p.seatNumber)}
                                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-[11px] font-bold shadow-xs cursor-pointer"
                                      >
                                        Check In
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-center py-12 text-xs text-slate-500">
                  Select a scheduled trip on the left to review passenger boarding manifests.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
