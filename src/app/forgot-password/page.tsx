'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Mail, ArrowRight, CheckCircle, ChevronLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FF]">
      <Navbar />

      <main className="grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-black text-slate-900">
              Reset Your Password
            </h1>
            <p className="text-xs text-slate-500">
              Enter your registered email and we&apos;ll dispatch password reset instructions.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-slate-200">
            {submitted ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-800">Reset Email Dispatched</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    If an account exists for <strong className="text-slate-800">{email}</strong>, a recovery link has been sent.
                  </p>
                </div>
                <Link
                  href="/login"
                  className="inline-block px-5 py-2.5 rounded-xl bg-[#0B1F4D] text-white text-xs font-bold"
                >
                  Return to Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. passenger@eksathejabo.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1769E0]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-sm bg-[#1769E0] hover:bg-blue-700 text-white shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Send Reset Link</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-xs font-bold text-slate-600 hover:text-blue-600 transition"
            >
              <ChevronLeft className="w-4 h-4 mr-0.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
