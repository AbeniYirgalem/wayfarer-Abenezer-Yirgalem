import React from 'react';
import Link from 'next/link';
import { CompassIcon, ShieldCheckIcon } from '../ui/Icons';

export function Footer() {
  return (
    <footer className="bg-[#163D32] text-white border-t border-[#1D4D40] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <CompassIcon className="w-5 h-5 text-emerald-300" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Wayfarer
              </span>
            </div>
            <p className="text-sm text-white/80 leading-relaxed max-w-md">
              Honest ratings and fair bookings for authentic travel discovery in Addis Ababa, Ethiopia.
              Discover curated places, read verified traveler reviews, and reserve guided tours with confidence.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-300">
              <ShieldCheckIcon className="w-4 h-4" />
              <span>Verified reviews & guaranteed tour bookings</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-4">
              Explore Addis Ababa
            </h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <Link href="/#explore" className="hover:text-white transition-colors">
                  Historical Landmarks
                </Link>
              </li>
              <li>
                <Link href="/#explore" className="hover:text-white transition-colors">
                  Authentic Culinary Spots
                </Link>
              </li>
              <li>
                <Link href="/#explore" className="hover:text-white transition-colors">
                  Natural Viewpoints & Parks
                </Link>
              </li>
              <li>
                <Link href="/#explore" className="hover:text-white transition-colors">
                  Cultural Centers & Museums
                </Link>
              </li>
            </ul>
          </div>

          {/* Experience Wayfarer */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-300 mb-4">
              Experience Wayfarer
            </h4>
            <ul className="space-y-2.5 text-sm text-white/80">
              <li>
                <Link href="/#explore" className="hover:text-white transition-colors">
                  Top Rated Places
                </Link>
              </li>
              <li>
                <Link href="/#explore" className="hover:text-white transition-colors">
                  Guided Tour Slots
                </Link>
              </li>
              <li>
                <Link href="/#explore" className="hover:text-white transition-colors">
                  Verified Traveler Reviews
                </Link>
              </li>
              <li>
                <Link href="/#explore" className="hover:text-white transition-colors">
                  Addis Ababa Guide
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-12 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>© {new Date().getFullYear()} Wayfarer — Honest Ratings, Fair Bookings. All rights reserved.</p>
          <p className="text-xs text-white/60">Crafted for authentic travel discovery</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
