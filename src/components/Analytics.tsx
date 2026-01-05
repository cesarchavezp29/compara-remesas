'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/context';

// Simple analytics tracker
export function useAnalytics() {
  const { user } = useAuth();

  const trackEvent = (eventName: string, properties?: Record<string, any>) => {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics:', eventName, properties);
    }

    // Send to Vercel Analytics if available
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va('event', { name: eventName, ...properties });
    }
  };

  const trackPageView = (pageName: string) => {
    trackEvent('page_view', { page: pageName });
  };

  const trackTransferComparison = (amount: number, country: string, service: string) => {
    trackEvent('transfer_comparison', { amount, country, service });
  };

  const trackServiceClick = (serviceName: string, amount: number) => {
    trackEvent('service_click', { service: serviceName, amount });
  };

  const trackLogin = (method: 'email' | 'google') => {
    trackEvent('login', { method });
  };

  const trackSignup = (method: 'email' | 'google') => {
    trackEvent('signup', { method });
  };

  return {
    trackEvent,
    trackPageView,
    trackTransferComparison,
    trackServiceClick,
    trackLogin,
    trackSignup,
  };
}

// Analytics Provider component
export default function Analytics() {
  useEffect(() => {
    // Track initial page load
    if (typeof window !== 'undefined') {
      console.log('📊 ComparaRemesas Analytics initialized');
    }
  }, []);

  return null;
}
