'use client';

import React, { useState, useMemo } from 'react';
import { useTheme, useTranslation } from '@/lib/context';
import { countries, services } from '@/lib/data';
import { compareServices, formatCurrency, calculateSavings } from '@/lib/calculations';
import { Country } from '@/types';

export default function CompareTab() {
  const { theme } = useTheme();
  const { t, language } = useTranslation();
  
  const [amount, setAmount] = useState(500);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [inverseMode, setInverseMode] = useState(false);
  
  const results = useMemo(() => {
    return compareServices(amount, selectedCountry, services, inverseMode);
  }, [amount, selectedCountry, inverseMode]);
  
  const savings = useMemo(() => calculateSavings(results), [results]);

  return (
    <div className="animate-fade-in">
      {/* Quick Convert Widget */}
      <div 
        className="rounded-2xl p-4 mb-5"
        style={{ 
          background: theme.surface, 
          border: `1px solid ${theme.surfaceBorder}` 
        }}
      >
        <div className="text-xs mb-3" style={{ color: theme.textMuted }}>
          {t('quickConvert')} - {t('todayRate')}
        </div>
        <div className="flex justify-between items-center">
          {[
            { flag: '🇲🇽', rate: '17.15', currency: 'MXN' },
            { flag: '🇨🇴', rate: '4,150', currency: 'COP' },
            { flag: '🇵🇪', rate: '3.72', currency: 'PEN' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-xl mb-1">{item.flag}</div>
              <div className="text-sm font-bold" style={{ color: theme.text }}>{item.rate}</div>
              <div className="text-xs" style={{ color: theme.textMuted }}>{item.currency}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mode Toggle */}
      <div 
        className="flex rounded-xl p-1 mb-5"
        style={{ 
          background: theme.surface, 
          border: `1px solid ${theme.surfaceBorder}` 
        }}
      >
        <button
          onClick={() => setInverseMode(false)}
          className="flex-1 py-3 rounded-lg font-semibold text-sm transition-all"
          style={{
            background: !inverseMode ? theme.primaryGradient : 'transparent',
            color: !inverseMode 
              ? (theme.id === 'dark' || theme.id === 'midnight' ? '#000' : '#fff') 
              : theme.textSecondary,
          }}
        >
          💵 {t('wantToSend')}
        </button>
        <button
          onClick={() => setInverseMode(true)}
          className="flex-1 py-3 rounded-lg font-semibold text-sm transition-all"
          style={{
            background: inverseMode ? theme.primaryGradient : 'transparent',
            color: inverseMode 
              ? (theme.id === 'dark' || theme.id === 'midnight' ? '#000' : '#fff') 
              : theme.textSecondary,
          }}
        >
          🎯 {t('needToReceive')}
        </button>
      </div>

      {/* Input Section */}
      <div 
        className="rounded-2xl p-5 mb-5"
        style={{ 
          background: theme.surface, 
          border: `1px solid ${theme.surfaceBorder}` 
        }}
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label 
              className="block text-[10px] uppercase tracking-wider mb-2"
              style={{ color: theme.textMuted }}
            >
              {inverseMode 
                ? `${t('amountToReceive')} (${selectedCountry.currency})` 
                : `${t('amountToSend')} (USD)`
              }
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
              className="w-full p-4 text-xl font-bold rounded-xl font-mono"
              style={{
                background: theme.inputBg,
                border: `2px solid ${theme.inputBorder}`,
                color: theme.text,
              }}
            />
          </div>
          <div>
            <label 
              className="block text-[10px] uppercase tracking-wider mb-2"
              style={{ color: theme.textMuted }}
            >
              {t('destinationCountry')}
            </label>
            <select
              value={selectedCountry.code}
              onChange={(e) => setSelectedCountry(countries.find(c => c.code === e.target.value)!)}
              className="w-full p-4 text-sm rounded-xl cursor-pointer"
              style={{
                background: theme.inputBg,
                border: `2px solid ${theme.inputBorder}`,
                color: theme.text,
              }}
            >
              {countries.map(country => (
                <option 
                  key={country.code} 
                  value={country.code}
                  style={{ background: theme.id === 'light' || theme.id === 'nature' ? '#fff' : '#1a1f35' }}
                >
                  {country.flag} {country.name[language]}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Savings indicator */}
        {savings > 1 && (
          <div 
            className="mt-4 p-3 rounded-xl text-sm"
            style={{ 
              background: `${theme.warning}20`,
              border: `1px solid ${theme.warning}40`,
              color: theme.warning,
            }}
          >
            💡 {t('couldHaveSaved')} <strong>${formatCurrency(savings)}</strong> {language === 'es' ? 'eligiendo la mejor opción' : 'by choosing the best option'}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-3">
        {results.map((result, index) => (
          <div
            key={result.service.id}
            className="rounded-2xl p-4 relative card-hover"
            style={{
              background: theme.surface,
              border: `1px solid ${theme.surfaceBorder}`,
              borderLeft: index === 0 ? `4px solid ${theme.primary}` : `4px solid transparent`,
            }}
          >
            {index === 0 && (
              <div 
                className="absolute -top-2 right-4 px-3 py-1 rounded-full text-[9px] font-bold uppercase"
                style={{
                  background: theme.primaryGradient,
                  color: theme.id === 'dark' || theme.id === 'midnight' ? '#000' : '#fff',
                }}
              >
                {t('bestOption')}
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                  style={{ background: result.service.color }}
                >
                  {result.service.logo}
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: theme.text }}>
                    {result.service.name}
                  </div>
                  <div className="text-xs" style={{ color: theme.textMuted }}>
                    {result.service.speed[language]} • {result.costPercent.toFixed(2)}% {t('cost')}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-[10px]" style={{ color: theme.textMuted }}>
                  {inverseMode ? t('youMustSend') : t('theyReceive')}
                </div>
                <div 
                  className="text-lg font-bold font-mono"
                  style={{ color: index === 0 ? theme.primary : theme.text }}
                >
                  {inverseMode 
                    ? `$${formatCurrency(result.toSend || 0)}` 
                    : `${formatCurrency(result.received, selectedCountry.currency)}`
                  }
                  {!inverseMode && (
                    <span className="text-[10px] opacity-60 ml-1">
                      {selectedCountry.currency}
                    </span>
                  )}
                </div>
                {result.cashback > 0.01 && (
                  <div className="text-[9px] mt-0.5" style={{ color: theme.warning }}>
                    💰 +${result.cashback.toFixed(2)} {t('cashback')}
                  </div>
                )}
              </div>
            </div>
            
            {/* Send Now Button */}
            {result.service.affiliateUrl && (
              <a
                href={result.service.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-3 py-2 rounded-lg text-center text-xs font-semibold transition-all hover:opacity-80"
                style={{
                  background: index === 0 ? theme.primaryGradient : theme.surface,
                  color: index === 0 
                    ? (theme.id === 'dark' || theme.id === 'midnight' ? '#000' : '#fff')
                    : theme.primary,
                  border: index === 0 ? 'none' : `1px solid ${theme.primary}`,
                }}
              >
                {t('sendNow')} →
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
