'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth/AuthContext';
import { DataService } from '@/lib/services/dataService';
import { Booking, SupportTicket } from '@/types';
import { 
  Ticket, 
  Calendar, 
  Clock, 
  MapPin, 
  Bus, 
  ShieldCheck, 
  AlertCircle, 
  RotateCcw, 
  Download, 
  User, 
  HelpCircle, 
  Search, 
  CheckCircle, 
  ExternalLink,
  Plus,
  Send,
  MessageSquare
} from 'lucide-react';

export default function PassengerDashboardPage() {
  const router = useRouter();
  const { user, updateProfile, language, toggleLanguage } = useAuth();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'history' | 'lookup' | 'support' | 'profile'>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);

  // Booking Lookup state
  const [lookupRef, setLookupRef] = useState('');
  const [lookupPhone, setLookupPhone] = useState('');
  const [lookupResult, setLookupResult] = useState<Booking | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Cancellation modal state
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('Change of travel plan');
  const [cancelSuccessMsg, setCancelSuccessMsg] = useState<string | null>(null);

  // Support ticket state
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  // Profile edit state
  const [editName, setEditName] = useState(user?.fullName || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [profileSaved, setProfileSaved] = useState(false);

  const [todayStr, setTodayStr] = useState('2026-11-02');

  const reloadData = () => {
    const list = DataService.getUserBookings(user?.uid || 'usr_passenger_demo');
    setBookings(list);
    const supp = DataService.getSupportTickets(user?.uid || 'usr_passenger_demo');
    setTickets(supp);
  };

  useEffect(() => {
    setTodayStr(new Date().toISOString().split('T')[0]);
    reloadData();
  }, [user]);

  // Filter trips
  const upcomingBookings = bookings.filter(b => b.journeyDate >= todayStr && b.bookingStatus === 'CONFIRMED');
  const historyBookings = bookings.filter(b => b.journeyDate < todayStr || b.bookingStatus === 'CANCELLED');

  // Lookup handler
  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setLookupError(null);
    setLookupResult(null);

    if (!lookupRef.trim()) {
      setLookupError('Please enter a booking reference code.');
      return;
    }

    const found = DataService.getBookingByRef(lookupRef.trim());
    if (found) {
      if (lookupPhone.trim() && !found.primaryContact.mobile.includes(lookupPhone.trim())) {
        setLookupError('Mobile number does not match this booking record.');
        return;
      }
      setLookupResult(found);
    } else {
      setLookupError('No booking found matching reference: ' + lookupRef);
    }
  };

  // Cancel booking handler
  const handleConfirmCancel = () => {
    if (!cancelModalBooking) return;
    const res = DataService.cancelBooking(cancelModalBooking.id, cancelReason);
    if (res.success) {
      setCancelSuccessMsg(`Booking ${cancelModalBooking.bookingReference} has been successfully cancelled and refund initiated.`);
      setCancelModalBooking(null);
      reloadData();
      setTimeout(() => setCancelSuccessMsg(null), 4000);
    }
  };

  // Submit Support Ticket handler
  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;

    DataService.createSupportTicket({
      userId: user?.uid || 'usr_passenger_demo',
      userName: user?.fullName || 'Tanvir Hossain',
      userEmail: user?.email || 'passenger@eksathejabo.com',
      subject: ticketSubject,
      message: ticketMessage,
      priority: 'medium',
    });

    setTicketSubject('');
    setTicketMessage('');
    setTicketSubmitted(true);
    reloadData();
    setTimeout(() => setTicketSubmitted(false), 3000);
  };

  // Save profile handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName: editName,
      phone: editPhone,
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FF]">
      <Navbar />

      <main className="grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* USER WELCOME BAR */}
          <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-[#0B1F4D] to-[#1769E0] text-white flex items-center justify-center font-black text-xl uppercase shadow-md shadow-blue-500/20 shrink-0">
                {user?.fullName ? user.fullName[0] : 'P'}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    Welcome, {user?.fullName || 'Passenger'}!
                  </h1>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    Passenger
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {user?.email} • Mobile: {user?.phone || '01712345678'}
                </p>
              </div>
            </div>

            {/* Quick action button */}
            <Link
              href="/search"
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#FF7900] hover:bg-[#e06a00] text-white shadow-md shadow-orange-500/20 transition flex items-center justify-center space-x-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Bus className="w-4 h-4" />
              <span>Book New Bus Ticket</span>
            </Link>
          </div>

          {/* DASHBOARD STATS ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Ticket className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Upcoming Trips</p>
                <h3 className="text-2xl font-black text-slate-900">{upcomingBookings.length}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Bookings Completed</p>
                <h3 className="text-2xl font-black text-slate-900">{bookings.length}</h3>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Verified Travel Miles</p>
                <h3 className="text-2xl font-black text-purple-700">1,240 km</h3>
              </div>
            </div>
          </div>

          {cancelSuccessMsg && (
            <div className="p-4 bg-emerald-50 border-l-4 border-emerald-500 text-xs sm:text-sm text-emerald-800 rounded-r-xl font-bold flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
              <span>{cancelSuccessMsg}</span>
            </div>
          )}

          {/* DASHBOARD TABS NAVIGATION */}
          <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 pt-2 overflow-x-auto gap-2">
            {[
              { id: 'upcoming', label: `Upcoming Trips (${upcomingBookings.length})`, icon: Calendar },
              { id: 'history', label: `Booking History (${historyBookings.length})`, icon: Clock },
              { id: 'lookup', label: 'Ticket Lookup', icon: Search },
              { id: 'support', label: `Support Tickets (${tickets.length})`, icon: MessageSquare },
              { id: 'profile', label: 'Profile Settings', icon: User },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3.5 px-4 font-bold text-xs flex items-center space-x-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-[#1769E0] text-[#1769E0]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB CONTENTS */}
          <div className="bg-white rounded-b-2xl p-6 sm:p-8 shadow-xs border border-t-0 border-slate-200 min-h-[350px]">
            {/* 1. UPCOMING TRIPS TAB */}
            {activeTab === 'upcoming' && (
              <div className="space-y-4">
                {upcomingBookings.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">
                      <Ticket className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-base text-slate-800">No Upcoming Trips</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      You don’t have any active bus bookings right now. Ready to travel? Search buses across Bangladesh!
                    </p>
                    <Link
                      href="/search"
                      className="inline-block px-5 py-2.5 rounded-xl bg-[#1769E0] text-white text-xs font-bold shadow-md"
                    >
                      Search Buses
                    </Link>
                  </div>
                ) : (
                  upcomingBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition space-y-4"
                    >
                      <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-slate-100">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Booking Reference
                          </span>
                          <p className="text-base font-black text-blue-700 font-mono">
                            {b.bookingReference}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            {b.bookingStatus}
                          </span>
                          <span className="text-xs font-black text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                            ৳{b.totalAmount}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Route</span>
                          <strong className="text-slate-900 text-sm">{b.origin} → {b.destination}</strong>
                          <p className="text-slate-500">{b.operatorName}</p>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Schedule</span>
                          <strong className="text-slate-800">{b.journeyDate}</strong>
                          <p className="text-slate-500">Departure: {b.departureTime}</p>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold">Seats & Boarding</span>
                          <strong className="text-orange-600">Seats: {b.selectedSeats.join(', ')}</strong>
                          <p className="text-slate-500 line-clamp-1">{b.boardingPoint}</p>
                        </div>

                        <div className="flex flex-wrap md:justify-end gap-2">
                          <Link
                            href={`/booking/confirmation?ref=${b.bookingReference}`}
                            className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center space-x-1 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>View Ticket</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => setCancelModalBooking(b)}
                            className="px-3.5 py-2 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-bold text-xs flex items-center space-x-1 transition cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 2. HISTORY / PREVIOUS TRIPS TAB */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                {historyBookings.length === 0 ? (
                  <p className="text-center py-10 text-xs text-slate-500">
                    No historical bookings on record.
                  </p>
                ) : (
                  historyBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <strong className="font-mono text-sm text-slate-800">{b.bookingReference}</strong>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${b.bookingStatus === 'CANCELLED' ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700'}`}>
                            {b.bookingStatus}
                          </span>
                        </div>
                        <p className="font-bold text-slate-800 text-sm mt-1">{b.origin} → {b.destination}</p>
                        <p className="text-slate-500 mt-0.5">{b.operatorName} • {b.journeyDate} • Seats: {b.selectedSeats.join(', ')}</p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-sm text-slate-800">৳{b.totalAmount}</span>
                        <Link
                          href={`/booking/confirmation?ref=${b.bookingReference}`}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-white font-semibold text-xs transition"
                        >
                          View E-Ticket
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 3. TICKET LOOKUP TAB */}
            {activeTab === 'lookup' && (
              <div className="max-w-xl mx-auto space-y-6">
                <div>
                  <h3 className="font-bold text-base text-slate-800">
                    Direct E-Ticket & PNR Lookup
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Retrieve ticket details, download PDF, or check boarding status using your booking reference.
                  </p>
                </div>

                <form onSubmit={handleLookup} className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Booking Reference Code *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ESJ-2026-X9K4"
                      value={lookupRef}
                      onChange={(e) => setLookupRef(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-mono uppercase font-bold focus:outline-hidden focus:ring-2 focus:ring-[#1769E0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Registered Mobile Number (Optional)
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 017XXXXXXXX"
                      value={lookupPhone}
                      onChange={(e) => setLookupPhone(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#1769E0]"
                    />
                  </div>

                  {lookupError && (
                    <p className="text-red-500 text-xs font-medium">{lookupError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#1769E0] text-white font-bold text-xs hover:bg-blue-700 transition flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Booking Record</span>
                  </button>
                </form>

                {lookupResult && (
                  <div className="p-5 rounded-2xl bg-white border-2 border-blue-400 shadow-md space-y-3 text-xs animate-in fade-in duration-200">
                    <div className="flex justify-between items-center">
                      <strong className="font-mono text-base text-blue-700">{lookupResult.bookingReference}</strong>
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                        {lookupResult.bookingStatus}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-700">
                      <div>
                        <span>Passenger: </span>
                        <strong>{lookupResult.primaryContact.fullName}</strong>
                      </div>
                      <div>
                        <span>Route: </span>
                        <strong>{lookupResult.origin} → {lookupResult.destination}</strong>
                      </div>
                      <div>
                        <span>Date & Time: </span>
                        <strong>{lookupResult.journeyDate} • {lookupResult.departureTime}</strong>
                      </div>
                      <div>
                        <span>Seats: </span>
                        <strong className="text-orange-600">{lookupResult.selectedSeats.join(', ')}</strong>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex justify-end">
                      <Link
                        href={`/booking/confirmation?ref=${lookupResult.bookingReference}`}
                        className="px-4 py-2 bg-[#FF7900] text-white font-bold text-xs rounded-xl hover:bg-orange-600 transition"
                      >
                        Open Full E-Ticket →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. SUPPORT TICKETS TAB */}
            {activeTab === 'support' && (
              <div className="space-y-6 max-w-3xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-base text-slate-800">
                      Customer Support Desk
                    </h3>
                    <p className="text-xs text-slate-500">
                      Need help with ticket rescheduling, boarding queries, or refunds? Submit a ticket below.
                    </p>
                  </div>
                </div>

                {ticketSubmitted && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Support inquiry submitted! Our team will respond shortly.</span>
                  </div>
                )}

                {/* Form to submit new support query */}
                <form onSubmit={handleSubmitTicket} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                    Submit New Inquiry
                  </h4>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Reschedule bus date for Dhaka - Cox's Bazar"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#1769E0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Message
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Provide details about your query or booking reference..."
                      value={ticketMessage}
                      onChange={(e) => setTicketMessage(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-[#1769E0]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#0B1F4D] text-white font-bold text-xs hover:bg-blue-950 transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Ticket</span>
                  </button>
                </form>

                {/* Ticket history list */}
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                    Previous Support Inquiries
                  </h4>
                  {tickets.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No previous tickets logged.</p>
                  ) : (
                    tickets.map((t) => (
                      <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <strong className="text-slate-800 font-bold">{t.subject}</strong>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            t.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {t.status.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-slate-600">{t.message}</p>
                        {t.adminReply && (
                          <div className="p-2.5 bg-blue-50 rounded-lg text-blue-900 border-l-2 border-blue-600">
                            <strong>Support Staff Reply: </strong>
                            <span>{t.adminReply}</span>
                          </div>
                        )}
                        <p className="text-[10px] text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 5. PROFILE SETTINGS TAB */}
            {activeTab === 'profile' && (
              <div className="max-w-md mx-auto space-y-6">
                <div>
                  <h3 className="font-bold text-base text-slate-800">
                    Profile Information
                  </h3>
                  <p className="text-xs text-slate-500">
                    Update your account details and interface preferences.
                  </p>
                </div>

                {profileSaved && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    <span>Profile saved successfully!</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#1769E0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Bangladesh Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-[#1769E0]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email Address (Read-only)
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="w-full bg-slate-100 border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-bold text-slate-700">Interface Language</span>
                    <button
                      type="button"
                      onClick={toggleLanguage}
                      className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-blue-700"
                    >
                      {language === 'en' ? 'বাংলা (Switch)' : 'English (Switch)'}
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#1769E0] text-white font-bold text-xs hover:bg-blue-700 transition cursor-pointer"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* CANCELLATION MODAL */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-red-600">
              <RotateCcw className="w-6 h-6" />
              <h3 className="font-black text-lg text-slate-900">Cancel Booking</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to cancel booking <strong className="text-slate-900">{cancelModalBooking.bookingReference}</strong> ({cancelModalBooking.origin} → {cancelModalBooking.destination})? 
              Your seats will be released back to the coach inventory and a refund initiated as per policy.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for Cancellation
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
              >
                <option value="Change of travel plan">Change of travel plan</option>
                <option value="Booked by mistake">Booked by mistake</option>
                <option value="Alternative transport arranged">Alternative transport arranged</option>
                <option value="Other personal reason">Other personal reason</option>
              </select>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
