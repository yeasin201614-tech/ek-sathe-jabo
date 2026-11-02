'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Bus, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  CreditCard, 
  HelpCircle, 
  Clock, 
  Award,
  ChevronRight
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0B1F4D] text-slate-300 pt-16 pb-8 border-t-4 border-[#FF7900]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative h-12 w-48 bg-white/10 rounded-lg p-1.5 backdrop-blur-xs">
                <Image
                  src="/assets/logo.png"
                  alt="Ek Sathe Jabo Logo"
                  fill
                  className="object-contain"
                  sizes="180px"
                />
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              <strong className="text-white">Ek Sathe Jabo</strong> is Bangladesh’s premier next-generation intercity bus ticket booking platform. Connecting travelers across all 64 districts with verified coach operators, real-time seat inventory, and guaranteed booking protection.
            </p>
            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-center space-x-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-[#FF7900] shrink-0" />
                <span>24/7 Hotline: <strong>16234</strong> / +880 9612-345678</span>
              </div>
              <div className="flex items-center space-x-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-[#FF7900] shrink-0" />
                <span>support@eksathejabo.com</span>
              </div>
              <div className="flex items-center space-x-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-[#FF7900] shrink-0" />
                <span>Level 7, Bilkis Tower, Gulshan-2, Dhaka-1212, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 border-l-2 border-[#1769E0] pl-2.5">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/search" className="hover:text-white transition flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400 mr-1.5" /> Search Buses
                </Link>
              </li>
              <li>
                <Link href="/#popular-routes" className="hover:text-white transition flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400 mr-1.5" /> Popular Routes
                </Link>
              </li>
              <li>
                <Link href="/#offers" className="hover:text-white transition flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400 mr-1.5" /> Special Offers & Coupons
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400 mr-1.5" /> My Bookings
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 text-blue-400 mr-1.5" /> Passenger Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular routes */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 border-l-2 border-[#FF7900] pl-2.5">
              Top Routes
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/search?from=Dhaka&to=Chattogram" className="hover:text-white transition flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 text-orange-400 mr-1.5" /> Dhaka ⇄ Chattogram
                </Link>
              </li>
              <li>
                <Link href="/search?from=Dhaka&to=Cox%27s+Bazar" className="hover:text-white transition flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 text-orange-400 mr-1.5" /> Dhaka ⇄ Cox&apos;s Bazar
                </Link>
              </li>
              <li>
                <Link href="/search?from=Dhaka&to=Sylhet" className="hover:text-white transition flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 text-orange-400 mr-1.5" /> Dhaka ⇄ Sylhet
                </Link>
              </li>
              <li>
                <Link href="/search?from=Dhaka&to=Rajshahi" className="hover:text-white transition flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 text-orange-400 mr-1.5" /> Dhaka ⇄ Rajshahi
                </Link>
              </li>
              <li>
                <Link href="/search?from=Dhaka&to=Khulna" className="hover:text-white transition flex items-center">
                  <ChevronRight className="w-3.5 h-3.5 text-orange-400 mr-1.5" /> Dhaka ⇄ Khulna (Padma Bridge)
                </Link>
              </li>
            </ul>
          </div>

          {/* Policy & Support */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 border-l-2 border-emerald-500 pl-2.5">
              Trust & Support
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-400 flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1.5" /> Verified Bus Operators
                </span>
              </li>
              <li>
                <span className="text-slate-400 flex items-center">
                  <Clock className="w-3.5 h-3.5 text-blue-400 mr-1.5" /> Instant Refund Guarantee
                </span>
              </li>
              <li>
                <span className="text-slate-400 flex items-center">
                  <Award className="w-3.5 h-3.5 text-yellow-400 mr-1.5" /> Zero Double-Booking
                </span>
              </li>
              <li className="pt-2 text-xs text-slate-400 leading-normal">
                Payment Gateways: bKash, Nagad, Rocket, NexusPay, Visa, Mastercard.
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Partners & Badges */}
        <div className="py-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Supported Payment Channels in Bangladesh:</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 bg-pink-900/40 text-pink-300 border border-pink-700/50 rounded-md font-semibold text-xs">
              bKash
            </span>
            <span className="px-2.5 py-1 bg-orange-900/40 text-orange-300 border border-orange-700/50 rounded-md font-semibold text-xs">
              Nagad
            </span>
            <span className="px-2.5 py-1 bg-purple-900/40 text-purple-300 border border-purple-700/50 rounded-md font-semibold text-xs">
              Rocket
            </span>
            <span className="px-2.5 py-1 bg-blue-900/40 text-blue-300 border border-blue-700/50 rounded-md font-semibold text-xs">
              Visa / Mastercard
            </span>
            <span className="px-2.5 py-1 bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 rounded-md font-semibold text-xs">
              Direct Bank Transfer
            </span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-3">
          <p>© 2026 Ek Sathe Jabo Ltd. All rights reserved. Travel Smart, Ek Sathe Jabo.</p>
          <div className="flex items-center space-x-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cancellation Policy</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
