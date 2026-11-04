'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { ChevronDownIcon, CheckIcon, RefreshCwIcon } from '../ui/Icons';
import { cn } from '../../lib/utils';

export function UserSwitcher() {
  const { users, currentUser, setCurrentUserId, isLoading, error, refreshUsers } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isLoading && users.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#EDE9DF]/60 animate-pulse text-xs text-[#777D78]">
        <div className="w-4 h-4 rounded-full bg-[#D6D2C4]" />
        <span>Loading identity...</span>
      </div>
    );
  }

  if (error && users.length === 0) {
    return (
      <button
        onClick={() => refreshUsers()}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200 hover:bg-rose-100 transition-colors"
        title={error}
      >
        <RefreshCwIcon className="w-3.5 h-3.5" />
        <span>Retry user</span>
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          'flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all duration-200',
          isOpen
            ? 'bg-[#163D32] text-white border-[#163D32] shadow-sm'
            : 'bg-[#F8F7F3] text-[#252A27] border-[#D6D2C4] hover:bg-[#EDE9DF] hover:border-[#B5B0A1]'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select traveler profile"
      >
        <div
          className={cn(
            'w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px]',
            isOpen ? 'bg-white text-[#163D32]' : 'bg-[#163D32] text-white'
          )}
        >
          {currentUser ? currentUser.name.charAt(0).toUpperCase() : '?'}
        </div>
        <div className="flex flex-col text-left">
          <span className={cn('text-[10px] leading-tight', isOpen ? 'text-white/80' : 'text-[#777D78]')}>
            Traveler
          </span>
          <span className="font-semibold leading-tight max-w-[100px] truncate">
            {currentUser ? currentUser.name : 'Select profile'}
          </span>
        </div>
        <ChevronDownIcon
          className={cn(
            'w-3.5 h-3.5 transition-transform duration-200 ml-0.5',
            isOpen ? 'rotate-180 text-white' : 'text-[#777D78]'
          )}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-[#EDE9DF] shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="px-3.5 py-2 border-b border-[#EDE9DF]/80">
            <p className="text-xs font-semibold text-[#252A27]">Traveler Profile</p>
            <p className="text-[11px] text-[#777D78] mt-0.5">
              Select your profile to write reviews and book guided tour slots.
            </p>
          </div>

          <div className="py-1">
            {users.map((user) => {
              const isSelected = currentUser?.id === user.id;
              return (
                <button
                  key={user.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    setCurrentUserId(user.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition-colors',
                    isSelected
                      ? 'bg-[#163D32]/10 text-[#163D32] font-semibold'
                      : 'text-[#252A27] hover:bg-[#F8F7F3]'
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0',
                        isSelected ? 'bg-[#163D32] text-white' : 'bg-[#EDE9DF] text-[#252A27]'
                      )}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{user.name}</p>
                      <p className="text-[10px] text-[#777D78] truncate">
                        Verified Traveler
                      </p>
                    </div>
                  </div>
                  {isSelected && <CheckIcon className="w-4 h-4 text-[#163D32] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
