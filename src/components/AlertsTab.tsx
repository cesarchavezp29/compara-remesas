'use client';

import React, { useState } from 'react';
import { useTheme, useTranslation } from '@/lib/context';
import { countries } from '@/lib/data';
import { Bell, BellRing, Calendar, TrendingUp, Trash2, Plus, Clock } from 'lucide-react';

interface Alert {
  id: number;
  type: 'rate' | 'reminder' | 'promo';
  currency?: string;
  targetRate?: number;
  currentRate?: number;
  message: { es: string; en: string };
  time: string;
  active: boolean;
}

interface ScheduledTransfer {
  id: number;
  recipient: string;
  amount: number;
  country: string;
  frequency: string;
  nextDate: string;
  active: boolean;
}

const mockAlerts: Alert[] = [
  { 
    id: 1, 
    type: 'rate', 
    currency: 'MXN',
    targetRate: 17.50,
    currentRate: 17.15,
    message: { es: 'MXN llegue a 17.50', en: 'MXN reaches 17.50' }, 
    time: '2h', 
    active: true 
  },
  { 
    id: 2, 
    type: 'rate', 
    currency: 'PEN',
    targetRate: 3.65,
    currentRate: 3.72,
    message: { es: 'PEN baje a 3.65', en: 'PEN drops to 3.65' }, 
    time: '1d', 
    active: true 
  },
  { 
    id: 3, 
    type: 'promo', 
    message: { es: 'Remitly: 0% comisión este fin de semana', en: 'Remitly: 0% fee this weekend' }, 
    time: '3d', 
    active: true 
  },
];

const mockScheduled: ScheduledTransfer[] = [
  { 
    id: 1, 
    recipient: 'Mamá',
    amount: 500,
    country: 'MX',
    frequency: 'biweekly',
    nextDate: '2025-01-15',
    active: true,
  },
  { 
    id: 2, 
    recipient: 'Abuela',
    amount: 200,
    country: 'PE',
    frequency: 'monthly',
    nextDate: '2025-01-20',
    active: true,
  },
];

export default function AlertsTab() {
  const { theme } = useTheme();
  const { t, language } = useTranslation();
  const [showCreateAlert, setShowCreateAlert] = useState(false);
  const [showCreateSchedule, setShowCreateSchedule] = useState(false);
  const [alerts, setAlerts] = useState(mockAlerts);
  const [scheduled, setScheduled] = useState(mockScheduled);

  // New alert form state
  const [newAlert, setNewAlert] = useState({
    currency: 'MXN',
    targetRate: '',
    direction: 'above', // 'above' or 'below'
  });

  const handleCreateAlert = () => {
    if (!newAlert.targetRate) return;
    
    const alert: Alert = {
      id: Date.now(),
      type: 'rate',
      currency: newAlert.currency,
      targetRate: parseFloat(newAlert.targetRate),
      currentRate: newAlert.currency === 'MXN' ? 17.15 : 3.72,
      message: {
        es: `${newAlert.currency} ${newAlert.direction === 'above' ? 'llegue a' : 'baje a'} ${newAlert.targetRate}`,
        en: `${newAlert.currency} ${newAlert.direction === 'above' ? 'reaches' : 'drops to'} ${newAlert.targetRate}`,
      },
      time: language === 'es' ? 'ahora' : 'now',
      active: true,
    };
    
    setAlerts([alert, ...alerts]);
    setShowCreateAlert(false);
    setNewAlert({ currency: 'MXN', targetRate: '', direction: 'above' });
  };

  const toggleAlert = (id: number) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const deleteAlert = (id: number) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  return (
    <div className="animate-fade-in">
      {/* Create Rate Alert Card */}
      <div 
        className="rounded-2xl p-5 mb-5"
        style={{ 
          background: theme.surface,
          border: `1px solid ${theme.surfaceBorder}`,
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BellRing size={18} style={{ color: theme.primary }} />
          <span className="font-bold text-sm" style={{ color: theme.text }}>
            {t('createRateAlert')}
          </span>
        </div>

        {showCreateAlert ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] uppercase mb-2" style={{ color: theme.textMuted }}>
                  {t('country')}
                </label>
                <select
                  value={newAlert.currency}
                  onChange={(e) => setNewAlert({ ...newAlert, currency: e.target.value })}
                  className="w-full p-3 rounded-xl text-sm"
                  style={{
                    background: theme.inputBg,
                    border: `2px solid ${theme.inputBorder}`,
                    color: theme.text,
                  }}
                >
                  {countries.filter(c => c.currency !== 'USD').map(c => (
                    <option key={c.code} value={c.currency}>
                      {c.flag} {c.currency}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase mb-2" style={{ color: theme.textMuted }}>
                  {t('alertWhenReaches')}
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder={newAlert.currency === 'MXN' ? '17.50' : '3.65'}
                  value={newAlert.targetRate}
                  onChange={(e) => setNewAlert({ ...newAlert, targetRate: e.target.value })}
                  className="w-full p-3 rounded-xl text-sm"
                  style={{
                    background: theme.inputBg,
                    border: `2px solid ${theme.inputBorder}`,
                    color: theme.text,
                  }}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateAlert(false)}
                className="flex-1 py-3 rounded-xl font-semibold text-sm"
                style={{
                  background: theme.surface,
                  border: `1px solid ${theme.surfaceBorder}`,
                  color: theme.textSecondary,
                }}
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleCreateAlert}
                className="flex-1 py-3 rounded-xl font-semibold text-sm"
                style={{
                  background: theme.primaryGradient,
                  color: theme.id === 'dark' || theme.id === 'midnight' ? '#000' : '#fff',
                }}
              >
                {t('createAlert')}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[10px] uppercase mb-2" style={{ color: theme.textMuted }}>
                  {t('country')}
                </label>
                <select
                  className="w-full p-3 rounded-xl text-sm"
                  style={{
                    background: theme.inputBg,
                    border: `2px solid ${theme.inputBorder}`,
                    color: theme.text,
                  }}
                >
                  {countries.filter(c => c.currency !== 'USD').map(c => (
                    <option key={c.code} value={c.currency}>
                      {c.flag} {c.currency}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase mb-2" style={{ color: theme.textMuted }}>
                  {t('alertWhenReaches')}
                </label>
                <input
                  type="number"
                  placeholder={`${t('example')}: 17.50`}
                  className="w-full p-3 rounded-xl text-sm"
                  style={{
                    background: theme.inputBg,
                    border: `2px solid ${theme.inputBorder}`,
                    color: theme.text,
                  }}
                />
              </div>
            </div>
            <button
              onClick={() => setShowCreateAlert(true)}
              className="w-full py-3 rounded-xl font-semibold text-sm"
              style={{
                background: theme.primaryGradient,
                color: theme.id === 'dark' || theme.id === 'midnight' ? '#000' : '#fff',
              }}
            >
              {t('createAlert')}
            </button>
          </div>
        )}
      </div>

      {/* Scheduled Transfers */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar size={14} style={{ color: theme.textSecondary }} />
            <span className="text-xs font-semibold" style={{ color: theme.textSecondary }}>
              {t('scheduledSends')}
            </span>
          </div>
          <button 
            className="text-xs font-semibold flex items-center gap-1"
            style={{ color: theme.primary }}
          >
            <Plus size={14} /> {t('new')}
          </button>
        </div>

        <div className="space-y-2">
          {scheduled.map((item) => {
            const country = countries.find(c => c.code === item.country);
            return (
              <div 
                key={item.id}
                className="rounded-xl p-4"
                style={{ 
                  background: theme.surface,
                  border: `1px solid ${theme.surfaceBorder}`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: theme.secondaryGradient }}
                    >
                      <Clock size={18} className="text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: theme.text }}>
                        ${item.amount} → {item.recipient} {country?.flag}
                      </div>
                      <div className="text-xs" style={{ color: theme.textMuted }}>
                        {item.frequency === 'biweekly' 
                          ? (language === 'es' ? 'Cada 15 días' : 'Every 2 weeks')
                          : (language === 'es' ? 'Mensual' : 'Monthly')
                        }
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold" style={{ color: theme.primary }}>
                      {t('next')}
                    </div>
                    <div className="text-xs" style={{ color: theme.textMuted }}>
                      {item.nextDate}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Alerts */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Bell size={14} style={{ color: theme.textSecondary }} />
          <span className="text-xs font-semibold" style={{ color: theme.textSecondary }}>
            {t('activeAlerts')} ({alerts.filter(a => a.active).length})
          </span>
        </div>

        {alerts.length === 0 ? (
          <div 
            className="rounded-xl p-8 text-center"
            style={{ 
              background: theme.surface,
              border: `1px solid ${theme.surfaceBorder}`,
            }}
          >
            <div className="text-3xl mb-2">🔔</div>
            <div className="text-sm" style={{ color: theme.textMuted }}>
              {t('noAlerts')}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className="rounded-xl p-4 flex items-center gap-3"
                style={{ 
                  background: theme.surface,
                  border: `1px solid ${theme.surfaceBorder}`,
                  opacity: alert.active ? 1 : 0.5,
                }}
              >
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ 
                    background: alert.type === 'rate' 
                      ? `${theme.success}20` 
                      : alert.type === 'promo'
                      ? `${theme.warning}20`
                      : `${theme.secondary}20`,
                  }}
                >
                  {alert.type === 'rate' ? '📈' : alert.type === 'promo' ? '🎁' : '⏰'}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm" style={{ color: theme.text }}>
                    {alert.message[language]}
                  </div>
                  <div className="text-xs" style={{ color: theme.textMuted }}>
                    {alert.type === 'rate' && alert.currentRate && (
                      <span>
                        {language === 'es' ? 'Actual' : 'Current'}: {alert.currentRate} • 
                      </span>
                    )}
                    {' '}{t('ago')} {alert.time}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {/* Toggle */}
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className="w-11 h-6 rounded-full relative transition-all"
                    style={{
                      background: alert.active ? theme.primary : theme.inputBorder,
                    }}
                  >
                    <div 
                      className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all"
                      style={{ left: alert.active ? '22px' : '2px' }}
                    />
                  </button>
                  {/* Delete */}
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-2 rounded-lg transition-all hover:opacity-70"
                    style={{ color: theme.danger }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rate Trend Info */}
      <div 
        className="rounded-xl p-4 mt-5"
        style={{ 
          background: theme.cardHighlight,
          border: `1px solid ${theme.primary}30`,
        }}
      >
        <div className="flex items-start gap-3">
          <TrendingUp size={18} style={{ color: theme.primary }} />
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: theme.primary }}>
              {language === 'es' ? 'Tendencia actual' : 'Current trend'}
            </div>
            <div className="text-xs" style={{ color: theme.textSecondary }}>
              {language === 'es' 
                ? 'El peso mexicano se ha fortalecido 2% esta semana. Buen momento para enviar.'
                : 'Mexican peso has strengthened 2% this week. Good time to send.'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
