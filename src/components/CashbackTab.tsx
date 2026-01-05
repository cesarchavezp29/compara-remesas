'use client';

import React, { useState } from 'react';
import { useTheme, useTranslation } from '@/lib/context';
import { services } from '@/lib/data';
import { Gift, Copy, Check, Users, Wallet, TrendingUp, ChevronRight } from 'lucide-react';

interface CashbackTransaction {
  id: number;
  date: string;
  service: string;
  amount: number;
  cashback: number;
  status: 'completed' | 'pending';
}

const mockCashbackHistory: CashbackTransaction[] = [
  { id: 1, date: '2025-01-03', service: 'Wise', amount: 500, cashback: 1.00, status: 'completed' },
  { id: 2, date: '2025-01-01', service: 'Remitly', amount: 300, cashback: 0.72, status: 'completed' },
  { id: 3, date: '2024-12-28', service: 'DolarApp', amount: 200, cashback: 0.40, status: 'completed' },
  { id: 4, date: '2024-12-15', service: 'Pangea', amount: 500, cashback: 0.99, status: 'pending' },
];

export default function CashbackTab() {
  const { theme } = useTheme();
  const { t, language } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const referralCode = 'CARLOS2025';
  const availableBalance = 23.45;
  const pendingBalance = 4.20;
  const totalEarned = 67.85;
  const referralCount = 3;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      {/* Main Balance Card */}
      <div 
        className="rounded-2xl p-6 mb-5 text-center relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${theme.warning}30 0%, ${theme.warning}10 100%)`,
          border: `1px solid ${theme.warning}50`,
        }}
      >
        {/* Background decoration */}
        <div 
          className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20"
          style={{ background: theme.warning }}
        />
        <div 
          className="absolute -left-8 -bottom-8 w-24 h-24 rounded-full opacity-10"
          style={{ background: theme.warning }}
        />
        
        <div className="relative z-10">
          <div className="text-sm mb-2" style={{ color: theme.textSecondary }}>
            {t('yourCashback')}
          </div>
          <div 
            className="text-5xl font-bold font-mono mb-2"
            style={{ color: theme.warning }}
          >
            ${availableBalance.toFixed(2)}
          </div>
          <div className="text-xs mb-4" style={{ color: theme.textMuted }}>
            +${pendingBalance.toFixed(2)} {t('pending')}
          </div>
          <button
            onClick={() => setShowWithdrawModal(true)}
            className="px-8 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{ background: theme.warning, color: '#000' }}
          >
            {t('withdrawTo')}
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div 
          className="rounded-xl p-3 text-center"
          style={{ 
            background: theme.surface,
            border: `1px solid ${theme.surfaceBorder}`,
          }}
        >
          <Wallet size={18} className="mx-auto mb-1" style={{ color: theme.success }} />
          <div className="font-bold text-sm" style={{ color: theme.text }}>
            ${totalEarned.toFixed(2)}
          </div>
          <div className="text-[9px]" style={{ color: theme.textMuted }}>
            {language === 'es' ? 'Total ganado' : 'Total earned'}
          </div>
        </div>
        <div 
          className="rounded-xl p-3 text-center"
          style={{ 
            background: theme.surface,
            border: `1px solid ${theme.surfaceBorder}`,
          }}
        >
          <Users size={18} className="mx-auto mb-1" style={{ color: theme.secondary }} />
          <div className="font-bold text-sm" style={{ color: theme.text }}>
            {referralCount}
          </div>
          <div className="text-[9px]" style={{ color: theme.textMuted }}>
            {language === 'es' ? 'Referidos' : 'Referrals'}
          </div>
        </div>
        <div 
          className="rounded-xl p-3 text-center"
          style={{ 
            background: theme.surface,
            border: `1px solid ${theme.surfaceBorder}`,
          }}
        >
          <TrendingUp size={18} className="mx-auto mb-1" style={{ color: theme.primary }} />
          <div className="font-bold text-sm" style={{ color: theme.text }}>
            18%
          </div>
          <div className="text-[9px]" style={{ color: theme.textMuted }}>
            {language === 'es' ? 'Promedio' : 'Average'}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div 
        className="rounded-xl p-4 mb-5"
        style={{ 
          background: theme.surface,
          border: `1px solid ${theme.surfaceBorder}`,
        }}
      >
        <div className="font-bold text-sm mb-4" style={{ color: theme.text }}>
          💰 {t('howItWorks')}
        </div>
        <div className="space-y-3">
          {[
            { num: '1️⃣', text: t('step1') },
            { num: '2️⃣', text: t('step2') },
            { num: '3️⃣', text: t('step3') },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-lg">{step.num}</span>
              <span className="text-xs" style={{ color: theme.textSecondary }}>{step.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cashback by Service */}
      <div className="mb-5">
        <div className="text-xs font-semibold mb-3" style={{ color: theme.textSecondary }}>
          {t('cashbackByService')}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {services.slice(0, 6).map((service) => (
            <div 
              key={service.id}
              className="rounded-xl p-3 flex items-center gap-3"
              style={{ 
                background: theme.surface,
                border: `1px solid ${theme.surfaceBorder}`,
              }}
            >
              <div 
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm"
                style={{ background: service.color }}
              >
                {service.logo}
              </div>
              <div>
                <div className="text-xs font-semibold" style={{ color: theme.text }}>
                  {service.name}
                </div>
                <div className="text-lg font-bold" style={{ color: theme.warning }}>
                  {service.cashbackPercent}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Referral Section */}
      <div 
        className="rounded-xl p-4 mb-5"
        style={{ 
          background: theme.secondaryGradient,
        }}
      >
        <div className="flex items-start gap-3">
          <div className="text-2xl">🎁</div>
          <div className="flex-1">
            <div className="font-bold text-sm text-white mb-1">
              {t('inviteFriends')}
            </div>
            <div className="text-xs text-white/80 mb-3">
              {t('earnPerFriend')}
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="flex-1 px-4 py-2 rounded-lg font-mono text-sm bg-white/20 text-white"
              >
                {referralCode}
              </div>
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-1 bg-white text-purple-600"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? (language === 'es' ? '¡Copiado!' : 'Copied!') : t('copy')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Cashback History */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold" style={{ color: theme.textSecondary }}>
            {language === 'es' ? 'Historial de cashback' : 'Cashback history'}
          </div>
          <button 
            className="text-xs flex items-center gap-1"
            style={{ color: theme.primary }}
          >
            {language === 'es' ? 'Ver todo' : 'View all'}
            <ChevronRight size={14} />
          </button>
        </div>
        
        <div className="space-y-2">
          {mockCashbackHistory.map((tx) => (
            <div 
              key={tx.id}
              className="rounded-xl p-3 flex items-center justify-between"
              style={{ 
                background: theme.surface,
                border: `1px solid ${theme.surfaceBorder}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                  style={{ background: theme.cardHighlight }}
                >
                  💰
                </div>
                <div>
                  <div className="text-xs font-semibold" style={{ color: theme.text }}>
                    {tx.service} • ${tx.amount}
                  </div>
                  <div className="text-[10px]" style={{ color: theme.textMuted }}>
                    {tx.date}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div 
                  className="font-bold text-sm"
                  style={{ color: tx.status === 'completed' ? theme.success : theme.warning }}
                >
                  +${tx.cashback.toFixed(2)}
                </div>
                <div className="text-[9px]" style={{ color: theme.textMuted }}>
                  {tx.status === 'pending' ? t('pending') : '✓'}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <WithdrawModal 
          balance={availableBalance}
          onClose={() => setShowWithdrawModal(false)}
          theme={theme}
          language={language}
        />
      )}
    </div>
  );
}

// Withdraw Modal Component
function WithdrawModal({ balance, onClose, theme, language }: any) {
  const [withdrawAmount, setWithdrawAmount] = useState(balance.toString());
  const [withdrawMethod, setWithdrawMethod] = useState('paypal');

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md rounded-t-3xl p-6 pb-10 animate-slide-up"
        style={{
          background: theme.id === 'light' || theme.id === 'nature' ? '#fff' : '#1a1f35',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div 
          className="w-10 h-1 rounded-full mx-auto mb-5"
          style={{ background: theme.textMuted }}
        />

        <h3 className="text-lg font-bold mb-5" style={{ color: theme.text }}>
          💸 {language === 'es' ? 'Retirar cashback' : 'Withdraw cashback'}
        </h3>

        {/* Amount */}
        <div className="mb-4">
          <label className="block text-xs mb-2" style={{ color: theme.textMuted }}>
            {language === 'es' ? 'Monto a retirar' : 'Amount to withdraw'}
          </label>
          <input
            type="number"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            max={balance}
            className="w-full p-4 rounded-xl text-xl font-bold font-mono"
            style={{
              background: theme.inputBg,
              border: `2px solid ${theme.inputBorder}`,
              color: theme.text,
            }}
          />
          <div className="text-xs mt-2" style={{ color: theme.textMuted }}>
            {language === 'es' ? 'Disponible' : 'Available'}: ${balance.toFixed(2)}
          </div>
        </div>

        {/* Method */}
        <div className="mb-6">
          <label className="block text-xs mb-2" style={{ color: theme.textMuted }}>
            {language === 'es' ? 'Método de retiro' : 'Withdraw method'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'paypal', icon: '🅿️', label: 'PayPal' },
              { id: 'bank', icon: '🏦', label: language === 'es' ? 'Banco' : 'Bank' },
            ].map((method) => (
              <button
                key={method.id}
                onClick={() => setWithdrawMethod(method.id)}
                className="p-4 rounded-xl flex items-center gap-3"
                style={{
                  background: withdrawMethod === method.id ? theme.cardHighlight : theme.surface,
                  border: `2px solid ${withdrawMethod === method.id ? theme.primary : theme.surfaceBorder}`,
                  color: theme.text,
                }}
              >
                <span className="text-xl">{method.icon}</span>
                <span className="font-semibold text-sm">{method.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-4 rounded-xl font-semibold text-sm"
            style={{
              background: theme.surface,
              border: `1px solid ${theme.surfaceBorder}`,
              color: theme.textSecondary,
            }}
          >
            {language === 'es' ? 'Cancelar' : 'Cancel'}
          </button>
          <button
            className="flex-1 py-4 rounded-xl font-bold text-sm"
            style={{
              background: theme.primaryGradient,
              color: theme.id === 'dark' || theme.id === 'midnight' ? '#000' : '#fff',
            }}
          >
            {language === 'es' ? 'Retirar' : 'Withdraw'}
          </button>
        </div>
      </div>
    </div>
  );
}
