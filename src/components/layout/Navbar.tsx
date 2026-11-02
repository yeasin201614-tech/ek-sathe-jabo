'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { t } from '@/lib/i18n/translations';
import { 
  Bus, 
  Menu, 
  X, 
  Globe, 
  User, 
  Ticket, 
  ShieldCheck, 
  Truck, 
  LogOut, 
  ChevronDown,
  Sparkles
} from 'lucide-react';

export function Navbar() {
  const { user, logout, language, toggleLanguage, loginAsDemo } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [roleSwitchOpen, setRoleSwitchOpen] = useState(false);

  const strings = t[language];

  const navLinks = [
    { label: strings.navHome, href: '/' },
    { label: strings.navSearch, href: '/search' },
    { label: strings.navRoutes, href: '/#popular-routes' },
    { label: strings.navOffers, href: '/#offers' },
    { label: strings.navBookings, href: '/dashboard' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-xs transition-all">
      {/* Top micro banner for Demo switcher & 24/7 hotline */}
      <div className="bg-[#0B1F4D] text-white text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-orange-400 font-medium">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              Hotline 24/7: <strong className="ml-1 text-white">16234</strong> or <span className="ml-1 text-slate-200">+880 9612-345678</span>
            </span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">Fastest Online Bus Ticket Booking in Bangladesh</span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleSwitchOpen(!roleSwitchOpen)}
                className="flex items-center space-x-1.5 px-2 py-0.5 rounded-sm bg-blue-900/60 hover:bg-blue-800 text-xs text-orange-300 border border-blue-700/50 transition cursor-pointer"
              >
                <span>Current Demo Role:</span>
                <span className="font-bold uppercase tracking-wider text-white bg-orange-600 px-1.5 py-0.2 rounded-xs">
                  {user?.role || 'Guest'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-300" />
              </button>

              {roleSwitchOpen && (
                <div 
                  className="absolute right-0 mt-1 w-56 bg-white text-slate-800 rounded-md shadow-xl border border-slate-200 py-1 z-50"
                  onMouseLeave={() => setRoleSwitchOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    Instant Switch Demo Persona
                  </div>
                  <button
                    onClick={() => { loginAsDemo('passenger'); setRoleSwitchOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition cursor-pointer ${user?.role === 'passenger' ? 'bg-blue-50/80 font-bold text-blue-700' : ''}`}
                  >
                    <span className="flex items-center"><User className="w-3.5 h-3.5 mr-2 text-blue-600" /> Passenger View</span>
                    <span className="text-[10px] text-slate-400">Regular user</span>
                  </button>
                  <button
                    onClick={() => { loginAsDemo('operator'); setRoleSwitchOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition cursor-pointer ${user?.role === 'operator' ? 'bg-blue-50/80 font-bold text-blue-700' : ''}`}
                  >
                    <span className="flex items-center"><Truck className="w-3.5 h-3.5 mr-2 text-emerald-600" /> Operator View</span>
                    <span className="text-[10px] text-slate-400">Green Line</span>
                  </button>
                  <button
                    onClick={() => { loginAsDemo('admin'); setRoleSwitchOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition cursor-pointer ${user?.role === 'admin' ? 'bg-blue-50/80 font-bold text-blue-700' : ''}`}
                  >
                    <span className="flex items-center"><ShieldCheck className="w-3.5 h-3.5 mr-2 text-purple-600" /> Super Admin</span>
                    <span className="text-[10px] text-slate-400">Full control</span>
                  </button>
                </div>
              )}
            </div>

            {/* Language toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 text-slate-200 hover:text-white px-2 py-0.5 rounded-sm hover:bg-blue-900/50 transition cursor-pointer"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span className="font-medium">{language === 'en' ? 'বাংলা' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative h-12 w-44 sm:w-52 transition-transform duration-200 group-hover:scale-102">
              <Image
                src="/assets/logo.png"
                alt="Ek Sathe Jabo"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 180px, 220px"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors duration-150 ${
                    isActive
                      ? 'text-[#1769E0] bg-blue-50'
                      : 'text-slate-700 hover:text-[#1769E0] hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Special Roles shortcuts if logged in */}
            {user?.role === 'operator' && (
              <Link
                href="/operator"
                className="px-3.5 py-2 rounded-lg text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 flex items-center transition"
              >
                <Truck className="w-4 h-4 mr-1.5" />
                {strings.operatorPanel}
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="px-3.5 py-2 rounded-lg text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 flex items-center transition"
              >
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                {strings.adminPanel}
              </Link>
            )}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 shadow-xs transition cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-linear-to-tr from-[#0B1F4D] to-[#1769E0] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                    {user.fullName ? user.fullName[0] : 'U'}
                  </div>
                  <div className="text-left text-xs leading-tight">
                    <p className="font-bold text-slate-800 line-clamp-1 max-w-[120px]">{user.fullName}</p>
                    <p className="text-slate-500 capitalize">{user.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Signed in as</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        {user.role} account
                      </span>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition"
                    >
                      <Ticket className="w-4 h-4 mr-2.5 text-slate-400" />
                      {strings.dashboard}
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-purple-700 font-semibold hover:bg-purple-50 transition"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2.5 text-purple-500" />
                        {strings.adminPanel}
                      </Link>
                    )}

                    {user.role === 'operator' && (
                      <Link
                        href="/operator"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-emerald-700 font-semibold hover:bg-emerald-50 transition"
                      >
                        <Truck className="w-4 h-4 mr-2.5 text-emerald-500" />
                        {strings.operatorPanel}
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => { logout(); setProfileDropdownOpen(false); }}
                      className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 mr-2.5" />
                      {strings.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition"
                >
                  {strings.navLogin}
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#FF7900] hover:bg-[#e06a00] text-white shadow-sm transition-all shadow-orange-500/20 active:scale-95"
                >
                  {strings.navRegister}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleLanguage}
              className="px-2 py-1 text-xs font-semibold text-slate-700 bg-slate-100 rounded-md"
            >
              {language === 'en' ? 'বাংলা' : 'EN'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200 shadow-xl">
          {/* Persona indicator on mobile */}
          <div className="p-3 bg-blue-50 rounded-lg flex items-center justify-between text-xs">
            <span>Role: <strong className="uppercase text-orange-600 font-bold">{user?.role || 'Guest'}</strong></span>
            <div className="flex space-x-1">
              <button onClick={() => loginAsDemo('passenger')} className="px-2 py-1 bg-white rounded-xs shadow-xs text-[11px] font-medium">Passenger</button>
              <button onClick={() => loginAsDemo('operator')} className="px-2 py-1 bg-white rounded-xs shadow-xs text-[11px] font-medium">Operator</button>
              <button onClick={() => loginAsDemo('admin')} className="px-2 py-1 bg-white rounded-xs shadow-xs text-[11px] font-medium">Admin</button>
            </div>
          </div>

          <nav className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}

            {user?.role === 'admin' && (
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-semibold text-purple-700 bg-purple-50"
              >
                {strings.adminPanel}
              </Link>
            )}

            {user?.role === 'operator' && (
              <Link
                href="/operator"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-semibold text-emerald-700 bg-emerald-50"
              >
                {strings.operatorPanel}
              </Link>
            )}
          </nav>

          <div className="pt-2 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-9 h-9 rounded-full bg-[#0B1F4D] text-white flex items-center justify-center font-bold text-sm">
                    {user.fullName[0]}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800">{user.fullName}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 transition"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {strings.logout}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg text-sm font-semibold border border-slate-200 text-slate-700"
                >
                  {strings.navLogin}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-lg text-sm font-semibold bg-[#FF7900] text-white"
                >
                  {strings.navRegister}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
