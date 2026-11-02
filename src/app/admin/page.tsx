'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth/AuthContext';
import { DataService } from '@/lib/services/dataService';
import { 
  Booking, 
  Operator, 
  Bus, 
  RouteItem, 
  Trip, 
  Coupon, 
  SupportTicket 
} from '@/types';
import { 
  ShieldCheck, 
  Bus as BusIcon, 
  MapPin, 
  Calendar, 
  Ticket, 
  CreditCard, 
  Tag, 
  FileText, 
  MessageSquare, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Layers,
  Trash2,
  Edit,
  ExternalLink,
  Download
} from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'operators' | 'buses' | 'routes' | 'schedules' | 'bookings' | 'payments' | 'coupons' | 'support' | 'reports'
  >('overview');

  // State data
  const [stats, setStats] = useState<any>(null);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<RouteItem[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);

  // Search & Filter state
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('all');

  // New Trip modal state
  const [showNewTripModal, setShowNewTripModal] = useState(false);
  const [newTripDate, setNewTripDate] = useState('2026-11-02');
  const [newTripDepTime, setNewTripDepTime] = useState('08:00 AM');
  const [newTripArrTime, setNewTripArrTime] = useState('01:30 PM');
  const [newTripFare, setNewTripFare] = useState(1200);
  const [newTripBusId, setNewTripBusId] = useState('');
  const [newTripRouteId, setNewTripRouteId] = useState('');
  const [newTripOpId, setNewTripOpId] = useState('');

  // New Coupon state
  const [showNewCouponModal, setShowNewCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'fixed' | 'percentage'>('fixed');
  const [newCouponVal, setNewCouponVal] = useState(100);
  const [newCouponMin, setNewCouponMin] = useState(1000);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Reply Support Ticket modal
  const [replyTicketId, setReplyTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Status message
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadAllData = () => {
    setStats(DataService.getAdminStats());
    setOperators(DataService.getOperators());
    setBuses(DataService.getAllBuses());
    setRoutes(DataService.getAllRoutes());
    setTrips(DataService.getTrips());
    setBookings(DataService.getAllBookings());
    setCoupons(DataService.getAllCoupons());
    setSupportTickets(DataService.getSupportTickets());

    if (DataService.getAllBuses()[0]) setNewTripBusId(DataService.getAllBuses()[0].id);
    if (DataService.getAllRoutes()[0]) setNewTripRouteId(DataService.getAllRoutes()[0].id);
    if (DataService.getOperators()[0]) setNewTripOpId(DataService.getOperators()[0].id);
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const triggerSuccess = (msg: string) => {
    setActionSuccess(msg);
    loadAllData();
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // Add Trip
  const handleCreateTrip = (e: React.FormEvent) => {
    e.preventDefault();
    DataService.createTrip({
      busId: newTripBusId,
      operatorId: newTripOpId,
      routeId: newTripRouteId,
      journeyDate: newTripDate,
      departureTime: newTripDepTime,
      arrivalTime: newTripArrTime,
      fare: Number(newTripFare),
    });
    setShowNewTripModal(false);
    triggerSuccess('New trip successfully scheduled and seat inventory generated!');
  };

  // Add Coupon
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;
    DataService.createCoupon({
      code: newCouponCode.toUpperCase().trim(),
      discountType: newCouponType,
      discountValue: Number(newCouponVal),
      minimumPurchase: Number(newCouponMin),
      usageLimit: 1000,
      expiryDate: '2027-12-31',
      active: true,
      description: newCouponDesc || `${newCouponCode} promotional offer`,
    });
    setShowNewCouponModal(false);
    setNewCouponCode('');
    triggerSuccess('Promotional coupon created!');
  };

  // Toggle Coupon Active
  const handleToggleCoupon = (id: string) => {
    DataService.toggleCoupon(id);
    triggerSuccess('Coupon status updated.');
  };

  // Reply to ticket
  const handleSendTicketReply = (id: string) => {
    if (!replyText) return;
    DataService.updateTicketStatus(id, 'resolved', replyText);
    setReplyTicketId(null);
    setReplyText('');
    triggerSuccess('Customer ticket replied and marked resolved!');
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchSearch =
      b.bookingReference.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.primaryContact.fullName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.primaryContact.mobile.includes(bookingSearch);

    const matchStatus =
      bookingStatusFilter === 'all' || b.bookingStatus === bookingStatusFilter;

    return matchSearch && matchStatus;
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'Reference,Passenger,Phone,Route,Date,Seats,Amount,Payment,Status\n';
    const rows = bookings
      .map(
        (b) =>
          `"${b.bookingReference}","${b.primaryContact.fullName}","${b.primaryContact.mobile}","${b.origin} -> ${b.destination}","${b.journeyDate}","${b.selectedSeats.join(' ')}","${b.totalAmount}","${b.paymentStatus}","${b.bookingStatus}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ek_sathe_jabo_bookings_${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FF]">
      <Navbar />

      <main className="grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* ADMIN TOP BANNER */}
          <div className="bg-[#0B1F4D] text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-purple-300 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                <span>Super Administrator Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">
                Ek Sathe Jabo Admin Operations
              </h1>
              <p className="text-xs text-slate-300 mt-1">
                Central control for routes, bus fleets, operators, real-time booking manifests, financial reconciliation, and customer support.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowNewTripModal(true)}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#FF7900] hover:bg-[#e06a00] text-white shadow-md transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Schedule New Trip</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="px-4 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 transition flex items-center space-x-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {actionSuccess && (
            <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 text-xs sm:text-sm text-emerald-800 rounded-r-xl font-bold flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* METRICS ROW */}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Bookings</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalBookings}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Revenue</span>
                <p className="text-2xl font-black text-[#1769E0] mt-1">৳{stats.totalRevenue}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400">Passengers</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">{stats.totalPassengers}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400">Active Operators</span>
                <p className="text-2xl font-black text-purple-600 mt-1">{stats.activeOperators}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400">Active Trips</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{stats.upcomingTrips}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400">Cancellations</span>
                <p className="text-2xl font-black text-red-500 mt-1">{stats.cancellationRequests}</p>
              </div>
            </div>
          )}

          {/* ADMIN TABS HEADER */}
          <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 pt-2 overflow-x-auto gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'bookings', label: `Bookings (${bookings.length})`, icon: Ticket },
              { id: 'schedules', label: `Trip Schedules (${trips.length})`, icon: Calendar },
              { id: 'operators', label: `Operators (${operators.length})`, icon: ShieldCheck },
              { id: 'buses', label: `Bus Fleet (${buses.length})`, icon: BusIcon },
              { id: 'routes', label: `Routes (${routes.length})`, icon: MapPin },
              { id: 'coupons', label: `Offers (${coupons.length})`, icon: Tag },
              { id: 'support', label: `Support (${supportTickets.length})`, icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 px-3.5 font-bold text-xs flex items-center space-x-1.5 border-b-2 transition whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-[#0B1F4D] text-[#0B1F4D] bg-slate-50'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB CONTENTS CONTAINER */}
          <div className="bg-white rounded-b-2xl p-6 sm:p-8 shadow-xs border border-t-0 border-slate-200 min-h-[400px]">
            {/* 1. OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Bookings Feed */}
                  <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-extrabold text-sm text-slate-800">
                        Live Booking Activity
                      </h3>
                      <button
                        onClick={() => setActiveTab('bookings')}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        View All
                      </button>
                    </div>

                    <div className="space-y-3">
                      {bookings.slice(0, 5).map((b) => (
                        <div
                          key={b.id}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs"
                        >
                          <div>
                            <p className="font-bold text-slate-800">
                              {b.primaryContact.fullName}{' '}
                              <span className="font-mono text-blue-600">({b.bookingReference})</span>
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {b.origin} → {b.destination} • {b.operatorName} • Seats: {b.selectedSeats.join(', ')}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-black text-slate-900 block">৳{b.totalAmount}</span>
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                              {b.bookingStatus}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Route Performance Snapshot */}
                  <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
                    <h3 className="font-extrabold text-sm text-slate-800">
                      Popular Highway Routes
                    </h3>
                    <div className="space-y-3">
                      {routes.slice(0, 5).map((r) => (
                        <div
                          key={r.id}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-xl text-xs"
                        >
                          <div>
                            <p className="font-bold text-slate-800">
                              {r.origin} ⇄ {r.destination}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {r.distanceKm} km • {r.durationFormatted}
                            </p>
                          </div>
                          <span className="font-bold text-xs text-blue-700">
                            Base: ৳{r.baseFare}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. BOOKINGS MANAGEMENT */}
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                {/* Search & filter toolbar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Search Ref, Passenger, Phone..."
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-medium focus:bg-white focus:outline-hidden"
                    />
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto text-xs">
                    <span className="text-slate-500 font-medium">Status:</span>
                    <select
                      value={bookingStatusFilter}
                      onChange={(e) => setBookingStatusFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold"
                    >
                      <option value="all">All Statuses</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="CANCELLED">CANCELLED</option>
                      <option value="PENDING">PENDING</option>
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-3">Ref Code</th>
                        <th className="p-3">Passenger</th>
                        <th className="p-3">Route & Coach</th>
                        <th className="p-3">Date</th>
                        <th className="p-3">Seats</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50/60 transition">
                          <td className="p-3 font-mono font-bold text-blue-700">{b.bookingReference}</td>
                          <td className="p-3 font-semibold text-slate-800">
                            {b.primaryContact.fullName}
                            <span className="block text-[10px] text-slate-400">{b.primaryContact.mobile}</span>
                          </td>
                          <td className="p-3">
                            {b.origin} → {b.destination}
                            <span className="block text-[10px] text-slate-400">{b.operatorName}</span>
                          </td>
                          <td className="p-3">{b.journeyDate}</td>
                          <td className="p-3 font-bold text-orange-600">{b.selectedSeats.join(', ')}</td>
                          <td className="p-3 font-bold text-slate-900">৳{b.totalAmount}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              b.bookingStatus === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'
                            }`}>
                              {b.bookingStatus}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <Link
                              href={`/booking/confirmation?ref=${b.bookingReference}`}
                              className="text-blue-600 hover:underline font-bold inline-flex items-center"
                            >
                              View <ExternalLink className="w-3 h-3 ml-0.5" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. TRIP SCHEDULES */}
            {activeTab === 'schedules' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-sm text-slate-800">Scheduled Coach Trips</h3>
                  <button
                    onClick={() => setShowNewTripModal(true)}
                    className="px-3.5 py-1.5 bg-[#FF7900] text-white rounded-lg text-xs font-bold flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Trip</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trips.map((t) => (
                    <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <strong className="text-sm font-bold text-slate-900">{t.operatorName}</strong>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md font-bold">{t.busType}</span>
                      </div>
                      <p className="font-bold text-slate-800">{t.origin} → {t.destination}</p>
                      <p className="text-slate-500">{t.journeyDate} • {t.departureTime}</p>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 font-semibold">
                        <span>Fare: ৳{t.fare}</span>
                        <span className="text-emerald-600">{t.availableSeatCount} seats left</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. OPERATORS */}
            {activeTab === 'operators' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {operators.map((op) => (
                    <div key={op.id} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 text-xs">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200">
                          <Image src={op.logoURL} alt={op.operatorName} fill className="object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{op.operatorName}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            {op.status}
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-500">Phone: {op.contactPhone}</p>
                      <p className="text-slate-500">Address: {op.address}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. BUSES */}
            {activeTab === 'buses' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {buses.map((bus) => (
                    <div key={bus.id} className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-sm text-slate-800">{bus.busName}</h4>
                        <span className="px-2 py-0.5 rounded-md font-bold bg-blue-50 text-blue-700">{bus.busType}</span>
                      </div>
                      <p className="text-slate-500 font-mono text-[11px]">{bus.registrationNumber}</p>
                      <p className="text-slate-600">Capacity: <strong>{bus.totalSeats} seats</strong> ({bus.seatLayout})</p>
                      <p className="text-slate-400 text-[11px]">Operator: {bus.operatorName}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. ROUTES */}
            {activeTab === 'routes' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {routes.map((r) => (
                    <div key={r.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 text-xs">
                      <h4 className="font-bold text-slate-800 text-sm">{r.origin} ⇄ {r.destination}</h4>
                      <p className="text-slate-500">Distance: {r.distanceKm} km</p>
                      <p className="text-slate-500">Duration: {r.durationFormatted}</p>
                      <p className="text-blue-700 font-bold pt-1">Base Fare: ৳{r.baseFare}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 7. OFFERS & COUPONS */}
            {activeTab === 'coupons' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-extrabold text-sm text-slate-800">Promotional Coupons</h3>
                  <button
                    onClick={() => setShowNewCouponModal(true)}
                    className="px-3.5 py-1.5 bg-[#FF7900] text-white rounded-lg text-xs font-bold flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Coupon</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {coupons.map((c) => (
                    <div key={c.id} className="p-5 rounded-2xl border-2 border-dashed border-orange-200 bg-orange-50/20 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <strong className="font-mono text-base text-slate-900">{c.code}</strong>
                        <button
                          onClick={() => handleToggleCoupon(c.id)}
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] cursor-pointer ${
                            c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {c.active ? 'ACTIVE' : 'DISABLED'}
                        </button>
                      </div>
                      <p className="text-slate-600">{c.description}</p>
                      <p className="text-slate-500">
                        {c.discountType === 'percentage' ? `${c.discountValue}% off` : `৳${c.discountValue} flat`} • Min: ৳{c.minimumPurchase}
                      </p>
                      <p className="text-[10px] text-slate-400">Used {c.usedCount} times</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 8. SUPPORT TICKETS */}
            {activeTab === 'support' && (
              <div className="space-y-4">
                <h3 className="font-extrabold text-sm text-slate-800">Customer Support Queue</h3>
                <div className="space-y-3">
                  {supportTickets.map((t) => (
                    <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <div>
                          <strong className="text-slate-900 text-sm">{t.subject}</strong>
                          <p className="text-[11px] text-slate-500">From: {t.userName} ({t.userEmail})</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          t.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {t.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg">{t.message}</p>
                      {t.adminReply && (
                        <p className="text-emerald-800 bg-emerald-50 p-2.5 rounded-lg">
                          <strong>Admin Reply: </strong> {t.adminReply}
                        </p>
                      )}
                      {t.status !== 'resolved' && (
                        <div>
                          {replyTicketId === t.id ? (
                            <div className="space-y-2 pt-2">
                              <textarea
                                rows={2}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Type response to customer..."
                                className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                              />
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleSendTicketReply(t.id)}
                                  className="px-3 py-1 bg-[#1769E0] text-white rounded-md text-xs font-bold"
                                >
                                  Send & Resolve
                                </button>
                                <button
                                  onClick={() => setReplyTicketId(null)}
                                  className="px-3 py-1 border border-slate-200 rounded-md text-xs text-slate-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setReplyTicketId(t.id)}
                              className="text-xs font-bold text-blue-600 hover:underline"
                            >
                              Reply to Customer →
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* SCHEDULE TRIP MODAL */}
      {showNewTripModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="font-black text-lg text-slate-900 flex items-center">
              <Calendar className="w-5 h-5 text-orange-500 mr-2" />
              Schedule New Bus Trip
            </h3>

            <form onSubmit={handleCreateTrip} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Route</label>
                <select
                  value={newTripRouteId}
                  onChange={(e) => setNewTripRouteId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  {routes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.origin} → {r.destination} (Base ৳{r.baseFare})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Bus & Operator</label>
                <select
                  value={newTripBusId}
                  onChange={(e) => {
                    setNewTripBusId(e.target.value);
                    const b = buses.find((item) => item.id === e.target.value);
                    if (b) setNewTripOpId(b.operatorId);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                >
                  {buses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.busName} ({b.operatorName}) - {b.busType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Journey Date</label>
                  <input
                    type="date"
                    value={newTripDate}
                    onChange={(e) => setNewTripDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fare (BDT ৳)</label>
                  <input
                    type="number"
                    value={newTripFare}
                    onChange={(e) => setNewTripFare(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Departure Time</label>
                  <input
                    type="text"
                    value={newTripDepTime}
                    onChange={(e) => setNewTripDepTime(e.target.value)}
                    placeholder="08:00 AM"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Arrival Time</label>
                  <input
                    type="text"
                    value={newTripArrTime}
                    onChange={(e) => setNewTripArrTime(e.target.value)}
                    placeholder="01:30 PM"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewTripModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#FF7900] text-white font-bold hover:bg-orange-600"
                >
                  Publish Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW COUPON MODAL */}
      {showNewCouponModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-black text-lg text-slate-900 flex items-center">
              <Tag className="w-5 h-5 text-orange-500 mr-2" />
              Create Promo Coupon
            </h3>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  placeholder="e.g. EID15"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 uppercase font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type</label>
                  <select
                    value={newCouponType}
                    onChange={(e: any) => setNewCouponType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                  >
                    <option value="fixed">Fixed BDT (৳)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Value</label>
                  <input
                    type="number"
                    value={newCouponVal}
                    onChange={(e) => setNewCouponVal(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Min Purchase (BDT)</label>
                <input
                  type="number"
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-semibold"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewCouponModal(false)}
                  className="flex-1 py-2 border border-slate-200 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#FF7900] text-white rounded-xl font-bold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
