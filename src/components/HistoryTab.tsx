'use client';

import React, { useState } from 'react';
import { useTheme, useTranslation } from '@/lib/context';
import { countries } from '@/lib/data';
import { TrendingDown, TrendingUp, Calendar, Filter } from 'lucide-react';

interface Transaction {
  id: number;
  date: string;
  amount: number;
  country: string;
  service: string;
  received: number;
  fee: number;
  rate: number;
}

const mockTransactions: Transaction[] = [
  { id: 1, date: '2025-01-03', amount: 500, country: 'MX', service: 'Wise', received: 8475, fee: 4.50, rate: 17.05 },
  { id: 2, date: '2025-01-01', amount: 300, country: 'MX', service: 'Remitly', received: 5025, fee: 3.60, rate: 16.92 },
  { id: 3, date: '2024-12-28', amount: 200, country: 'PE', service: 'DolarApp', received: 740, fee: 1.60, rate: 3.72 },
  { id: 4, date: '2024-12-15', amount: 500, country: 'MX', service: 'Western Union', received: 8150, fee: 18.00, rate: 16.78 },
  { id: 5, date: '2024-12-01', amount: 400, country: 'CO', service: 'Wise', received: 1640000, fee: 3.50, rate: 4120 },
  { id: 6, date: '2024-11-15', amount: 600, country: 'MX', service: 'Xoom', received: 10050, fee: 10.80, rate: 16.95 },
  { id: 7, date: '2024-11-01', amount: 350, country: 'MX', service: 'Remitly', received: 5880, fee: 4.20, rate: 16.88 },
  { id: 8, date: '2024-10-15', amount: 500, country: 'GT', service: 'MoneyGram', received: 3850, fee: 8.50, rate: 7.72 },
];

export default function HistoryTab() {
  const { theme } = useTheme();
  const { t, language } = useTranslation();
  const [filterPeriod, setFilterPeriod] = useState<'all' | '30d' | '90d' | '1y'>('all');
  
  // Calculate stats
  const totalSent = mockTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalFees = mockTransactions.reduce((sum, tx) => sum + tx.fee, 0);
  const avgFeePercent = (totalFees / totalSent) * 100;
  const transactionCount = mockTransactions.length;

  // Calculate potential savings (comparing to worst service)
  const potentialSavings = mockTransactions.reduce((sum, tx) => {
    // Assume worst case is 3% more expensive
    const worstCaseFee = tx.amount * 0.03;
    return sum + Math.max(0, worstCaseFee - tx.fee);
  }, 0);

  return (
    <div className="animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div 
          className="rounded-xl p-4"
          style={{ 
            background: theme.surface,
            border: `1px solid ${theme.surfaceBorder}`,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} style={{ color: theme.primary }} />
            <span className="text-[10px] uppercase" style={{ color: theme.textMuted }}>
              {t('totalSent')}
            </span>
          </div>
          <div className="text-2xl font-bold font-mono" style={{ color: theme.text }}>
            ${totalSent.toLocaleString()}
          </div>
          <div className="text-[10px]" style={{ color: theme.textMuted }}>
            {transactionCount} {language === 'es' ? 'envíos' : 'transfers'}
          </div>
        </div>

        <div 
          className="rounded-xl p-4"
          style={{ 
            background: theme.surface,
            border: `1px solid ${theme.surfaceBorder}`,
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={14} style={{ color: theme.danger }} />
            <span className="text-[10px] uppercase" style={{ color: theme.textMuted }}>
              {t('inFees')}
            </span>
          </div>
          <div className="text-2xl font-bold font-mono" style={{ color: theme.danger }}>
            ${totalFees.toFixed(2)}
          </div>
          <div className="text-[10px]" style={{ color: theme.textMuted }}>
            {avgFeePercent.toFixed(2)}% {t('average').toLowerCase()}
          </div>
        </div>
      </div>

      {/* Savings Insight */}
      <div 
        className="rounded-xl p-4 mb-5"
        style={{ 
          background: `linear-gradient(135deg, ${theme.success}15 0%, ${theme.success}05 100%)`,
          border: `1px solid ${theme.success}30`,
        }}
      >
        <div className="flex items-start gap-3">
          <div className="text-2xl">🎉</div>
          <div>
            <div className="font-bold text-sm" style={{ color: theme.success }}>
              {language === 'es' ? '¡Has ahorrado' : "You've saved"} ${potentialSavings.toFixed(2)}
            </div>
            <div className="text-xs mt-1" style={{ color: theme.textSecondary }}>
              {language === 'es' 
                ? 'Comparado con usar servicios tradicionales como bancos.'
                : 'Compared to using traditional services like banks.'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Could Have Saved Card */}
      {totalFees > 30 && (
        <div 
          className="rounded-xl p-4 mb-5"
          style={{ 
            background: `linear-gradient(135deg, ${theme.warning}20 0%, ${theme.warning}05 100%)`,
            border: `1px solid ${theme.warning}40`,
          }}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div>
              <div className="font-bold text-sm" style={{ color: theme.warning }}>
                {t('couldHaveSaved')} $18.40
              </div>
              <div className="text-xs mt-1" style={{ color: theme.textSecondary }}>
                {language === 'es' 
                  ? 'Usando Wise en lugar de Western Union en tus últimos envíos.'
                  : 'Using Wise instead of Western Union on your recent transfers.'
                }
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Period Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {[
          { id: 'all', label: language === 'es' ? 'Todo' : 'All' },
          { id: '30d', label: language === 'es' ? '30 días' : '30 days' },
          { id: '90d', label: language === 'es' ? '90 días' : '90 days' },
          { id: '1y', label: language === 'es' ? '1 año' : '1 year' },
        ].map((period) => (
          <button
            key={period.id}
            onClick={() => setFilterPeriod(period.id as any)}
            className="px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all"
            style={{
              background: filterPeriod === period.id ? theme.primaryGradient : theme.surface,
              color: filterPeriod === period.id 
                ? (theme.id === 'dark' || theme.id === 'midnight' ? '#000' : '#fff')
                : theme.textSecondary,
              border: `1px solid ${filterPeriod === period.id ? 'transparent' : theme.surfaceBorder}`,
            }}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Transaction History Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-semibold" style={{ color: theme.textSecondary }}>
          {t('transactionHistory')}
        </div>
        <button 
          className="p-2 rounded-lg"
          style={{ background: theme.surface, color: theme.textMuted }}
        >
          <Filter size={14} />
        </button>
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        {mockTransactions.map((tx) => {
          const country = countries.find(c => c.code === tx.country);
          const isHighFee = (tx.fee / tx.amount) * 100 > 2;
          
          return (
            <div 
              key={tx.id}
              className="rounded-xl p-4"
              style={{ 
                background: theme.surface,
                border: `1px solid ${theme.surfaceBorder}`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: theme.cardHighlight }}
                  >
                    {country?.flag}
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: theme.text }}>
                      ${tx.amount} → {country?.name[language]}
                    </div>
                    <div className="text-xs" style={{ color: theme.textMuted }}>
                      {tx.service} • {tx.date}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div 
                    className="font-bold text-sm"
                    style={{ color: isHighFee ? theme.danger : theme.success }}
                  >
                    -${tx.fee.toFixed(2)}
                  </div>
                  <div className="text-[10px]" style={{ color: theme.textMuted }}>
                    {((tx.fee / tx.amount) * 100).toFixed(2)}% {t('fee')}
                  </div>
                </div>
              </div>
              
              {/* Transaction Details */}
              <div 
                className="mt-3 pt-3 flex justify-between text-xs"
                style={{ borderTop: `1px solid ${theme.surfaceBorder}` }}
              >
                <div>
                  <span style={{ color: theme.textMuted }}>
                    {language === 'es' ? 'Recibieron' : 'Received'}:
                  </span>
                  <span className="ml-1 font-mono" style={{ color: theme.text }}>
                    {tx.received.toLocaleString()} {country?.currency}
                  </span>
                </div>
                <div>
                  <span style={{ color: theme.textMuted }}>
                    {language === 'es' ? 'Tasa' : 'Rate'}:
                  </span>
                  <span className="ml-1 font-mono" style={{ color: theme.text }}>
                    {tx.rate}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Summary */}
      <div 
        className="rounded-xl p-4 mt-5"
        style={{ 
          background: theme.surface,
          border: `1px solid ${theme.surfaceBorder}`,
        }}
      >
        <div className="text-xs font-semibold mb-3" style={{ color: theme.textSecondary }}>
          📊 {language === 'es' ? 'Resumen por servicio' : 'Summary by service'}
        </div>
        <div className="space-y-2">
          {[
            { name: 'Wise', count: 2, total: 900, avgFee: 0.9 },
            { name: 'Remitly', count: 2, total: 650, avgFee: 1.2 },
            { name: 'Western Union', count: 1, total: 500, avgFee: 3.6 },
            { name: 'Others', count: 3, total: 1300, avgFee: 1.5 },
          ].map((service, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ 
                    background: i === 0 ? theme.success : i === 2 ? theme.danger : theme.primary 
                  }}
                />
                <span className="text-xs" style={{ color: theme.text }}>{service.name}</span>
              </div>
              <div className="text-xs" style={{ color: theme.textMuted }}>
                {service.count}x • ${service.total} • {service.avgFee}% avg
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
