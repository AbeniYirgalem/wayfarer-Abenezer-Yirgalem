'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserSwitcher } from './UserSwitcher';
import { CompassIcon, MenuIcon, XIcon, ShieldCheckIcon } from '../ui/Icons';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F8F7F3]/90 backdrop-blur-md border-b border-[#EDE9DF] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[#163D32] text-white flex items-center justify-center shadow-sm group-hover:bg-[#1D4D40] transition-colors">
              <CompassIcon className="w-5 h-5 text-emerald-300 stroke-[2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl font-bold tracking-tight text-[#163D32]">
                Wayfarer
              </span>
              <span className="text-[10px] tracking-wider uppercase font-semibold text-[#777D78]">
                Honest Ratings · Fair Bookings
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links & User Switcher */}
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className="text-sm font-medium text-[#252A27] hover:text-[#163D32] transition-colors"
              >
                Home
              </Link>
              <Link
                href="/#explore"
                className="text-sm font-medium text-[#777D78] hover:text-[#163D32] transition-colors"
              >
                Explore Places
              </Link>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#163D32]/10 text-[#163D32]">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-[#163D32]" />
                Bayesian Verified
              </span>
            </nav>

            <div className="h-5 w-px bg-[#EDE9DF]" />

            {/* Acting-as User Switcher */}
            <UserSwitcher />
          </div>

          {/* Mobile Menu Button & User Switcher */}
          <div className="flex md:hidden items-center gap-3">
            <UserSwitcher />
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-xl text-[#252A27] hover:bg-[#EDE9DF] transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#EDE9DF] bg-[#F8F7F3] px-4 pt-3 pb-5 space-y-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#252A27] hover:bg-[#EDE9DF] rounded-xl"
          >
            Home
          </Link>
          <Link
            href="/#explore"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-sm font-medium text-[#777D78] hover:bg-[#EDE9DF] rounded-xl"
          >
            Explore Places
          </Link>
          <div className="pt-2">
            <div className="px-3 py-2 bg-[#163D32]/5 rounded-xl flex items-center gap-2 text-xs text-[#163D32]">
              <ShieldCheckIcon className="w-4 h-4 shrink-0" />
              <span>Honest Bayesian place ratings & overbooking-proof tour slots</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
