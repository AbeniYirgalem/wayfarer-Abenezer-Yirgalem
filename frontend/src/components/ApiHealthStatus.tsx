'use client';

import { useState, useEffect } from 'react';
import api from '../lib/api';

export function ApiHealthStatus() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Testing API connection...');

  const verifyHealth = async () => {
    setStatus('loading');
    setMessage('Connecting to service...');
    try {
      const res = await api.checkHealth();
      setStatus('connected');
      setMessage(res.message);
    } catch (err) {
      setStatus('error');
      setMessage((err as Error).message || 'Failed to connect to service');
    }
  };

  useEffect(() => {
    let isMounted = true;
    api
      .checkHealth()
      .then((res) => {
        if (isMounted) {
          setStatus('connected');
          setMessage(res.message);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setStatus('error');
          setMessage((err as Error).message || 'Failed to connect to service');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-3.5 h-3.5 rounded-full ${
            status === 'connected'
              ? 'bg-emerald-500 ring-4 ring-emerald-100'
              : status === 'error'
              ? 'bg-amber-500 ring-4 ring-amber-100'
              : 'bg-sky-500 animate-pulse'
          }`}
        />
        <div>
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Platform Service Status
          </div>
          <div className="text-sm font-medium text-slate-800">
            {status === 'connected' && `Operational — ${message}`}
            {status === 'error' && `Offline/Unreachable — ${message}`}
            {status === 'loading' && message}
          </div>
        </div>
      </div>
      <button
        onClick={verifyHealth}
        className="px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
      >
        Re-check Health
      </button>
    </div>
  );
}
