'use client';

import React, { useState } from 'react';
import type { PlaceDetailTourSlot, BookingResult } from '../../types';
import { useUser } from '../../context/UserContext';
import { api, ApiClientError } from '../../lib/api';
import {
  CalendarIcon,
  ClockIcon,
  XIcon,
  CheckIcon,
  AlertCircleIcon,
  ShieldCheckIcon,
} from '../ui/Icons';
import { Button } from '../ui/Button';
import { formatDate, formatTime } from '../../lib/utils';

interface BookingModalProps {
  slot: PlaceDetailTourSlot;
  placeName: string;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (result: BookingResult) => void;
}

export function BookingModal({
  slot,
  placeName,
  isOpen,
  onClose,
  onBookingSuccess,
}: BookingModalProps) {
  const { currentUser } = useUser();
  const maxSelectable = Math.max(1, slot.availableSeats);

  const [seats, setSeats] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<BookingResult | null>(null);

  if (!isOpen) return null;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!currentUser) {
      setErrorMessage('Please select a traveler identity in the navigation bar first.');
      return;
    }

    if (seats <= 0) {
      setErrorMessage('Please reserve at least 1 seat.');
      return;
    }

    if (seats > slot.availableSeats) {
      setErrorMessage(
        `Only ${slot.availableSeats} ${slot.availableSeats === 1 ? 'seat is' : 'seats are'} available.`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await api.createBooking(slot.id, { seats }, currentUser.id);
      setSuccessResult(result);
      onBookingSuccess(result);
    } catch (err: unknown) {
      if (err instanceof ApiClientError) {
        if (err.status === 409) {
          setErrorMessage(
            err.message ||
              'Sorry, those seats are no longer available. Please choose another time or a smaller group.'
          );
        } else {
          setErrorMessage(err.message);
        }
      } else {
        setErrorMessage('Failed to reserve tour seats due to a network connection issue.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#EDE9DF] shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-[#777D78] hover:text-[#252A27] hover:bg-[#F8F7F3] transition-colors"
          aria-label="Close dialog"
        >
          <XIcon className="w-5 h-5" />
        </button>

        {successResult ? (
          /* Success Screen */
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <CheckIcon className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#252A27] mb-2">
              Booking Confirmed!
            </h3>
            <p className="text-sm text-[#777D78] leading-relaxed max-w-md mx-auto mb-6">
              You have successfully reserved{' '}
              <strong className="text-[#252A27] font-semibold">
                {successResult.seats} {successResult.seats === 1 ? 'seat' : 'seats'}
              </strong>{' '}
              for <strong className="text-[#252A27] font-semibold">{placeName}</strong> on{' '}
              {formatDate(slot.startsAt)} at {formatTime(slot.startsAt)}.
            </p>

            <div className="p-4 rounded-2xl bg-[#F8F7F3] border border-[#EDE9DF] text-xs text-[#777D78] max-w-xs mx-auto mb-6 space-y-1">
              <div className="flex justify-between">
                <span>Confirmation ID:</span>
                <span className="font-mono text-[#252A27]">{successResult.bookingId.slice(0, 8)}...</span>
              </div>
              <div className="flex justify-between">
                <span>Remaining Seats:</span>
                <span className="font-semibold text-[#163D32]">{successResult.remainingSeats} left</span>
              </div>
            </div>

            <Button variant="primary" size="md" onClick={onClose} className="w-full">
              Done
            </Button>
          </div>
        ) : (
          /* Booking Form */
          <div>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#163D32] mb-1">
                <ShieldCheckIcon className="w-3.5 h-3.5 text-[#163D32]" />
                Zero Overbooking Guaranteed
              </div>
              <h3 id="booking-modal-title" className="font-serif text-2xl font-bold text-[#252A27]">
                Reserve Tour Seats
              </h3>
              <p className="text-xs text-[#777D78] mt-1">
                {placeName}
              </p>
            </div>

            {/* Tour Slot Details Banner */}
            <div className="p-4 rounded-2xl bg-[#F8F7F3] border border-[#EDE9DF] mb-6 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#252A27] font-medium">
                  <CalendarIcon className="w-4 h-4 text-[#163D32]" />
                  <span>{formatDate(slot.startsAt)}</span>
                </span>
                <span className="flex items-center gap-1 text-[#777D78]">
                  <ClockIcon className="w-3.5 h-3.5" />
                  <span>{formatTime(slot.startsAt)}</span>
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#EDE9DF]">
                <span className="text-[#777D78]">Remaining Capacity:</span>
                <span className="font-semibold text-[#163D32]">
                  {slot.availableSeats} of {slot.capacity} seats available
                </span>
              </div>
            </div>

            {/* Current Acting User */}
            <div className="mb-6 p-3.5 rounded-2xl bg-white border border-[#EDE9DF] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#163D32] text-white flex items-center justify-center font-bold text-xs">
                  {currentUser ? currentUser.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <p className="text-[10px] text-[#777D78] uppercase tracking-wider font-semibold">
                    Booking Passenger
                  </p>
                  <p className="font-semibold text-[#252A27]">
                    {currentUser ? currentUser.name : 'No traveler selected'}
                  </p>
                </div>
              </div>
              {!currentUser && (
                <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  Select identity in navbar
                </span>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2.5">
                <AlertCircleIcon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleBooking} className="space-y-6">
              {/* Seat Count Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#777D78] mb-2">
                  Number of Seats
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-[#D6D2C4] rounded-xl overflow-hidden bg-white">
                    <button
                      type="button"
                      disabled={seats <= 1 || isSubmitting}
                      onClick={() => setSeats((s) => Math.max(1, s - 1))}
                      className="w-10 h-10 flex items-center justify-center text-lg font-bold hover:bg-[#F8F7F3] disabled:opacity-40 transition-colors"
                      aria-label="Decrease seat count"
                    >
                      −
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-[#252A27]">
                      {seats}
                    </span>
                    <button
                      type="button"
                      disabled={seats >= maxSelectable || isSubmitting}
                      onClick={() => setSeats((s) => Math.min(maxSelectable, s + 1))}
                      className="w-10 h-10 flex items-center justify-center text-lg font-bold hover:bg-[#F8F7F3] disabled:opacity-40 transition-colors"
                      aria-label="Increase seat count"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-xs text-[#777D78]">
                    {seats === 1 ? '1 passenger' : `${seats} passengers`}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={!currentUser || isSubmitting || slot.availableSeats <= 0}
                  isLoading={isSubmitting}
                >
                  Confirm Reservation
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookingModal;
