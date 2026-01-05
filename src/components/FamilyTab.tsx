'use client';

import React, { useState } from 'react';
import { useTheme, useTranslation } from '@/lib/context';
import { countries } from '@/lib/data';
import { UserPlus, Users, TrendingUp, Copy, Check } from 'lucide-react';

interface FamilyMember {
  id: number;
  name: string;
  avatar: string;
  lastSent: string;
  amount: number;
}

const mockFamilyMembers: FamilyMember[] = [
  { id: 1, name: 'Carlos', avatar: '👨', lastSent: '2025-01-03', amount: 500 },
  { id: 2, name: 'María', avatar: '👩', lastSent: '2025-01-01', amount: 300 },
  { id: 3, name: 'Pedro', avatar: '👦', lastSent: '2024-12-28', amount: 200 },
];

export default function FamilyTab() {
  const { theme } = useTheme();
  const { t, language } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  
  const totalThisMonth = mockFamilyMembers.reduce((sum, m) => sum + m.amount, 0);
  const monthlyGoal = 1500;
  const progressPercent = (totalThisMonth / monthlyGoal) * 100;
  const inviteCode = 'FAM-GRC-2025';

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (showCreateGroup) {
    return (
      <CreateGroupForm 
        onBack={() => setShowCreateGroup(false)} 
        theme={theme}
        language={language}
        t={t}
      />
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Family Group Header */}
      <div 
        className="rounded-2xl p-5 mb-5"
        style={{ background: theme.secondaryGradient }}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-xs opacity-80 text-white">{t('familyGroup')}</div>
            <div className="text-xl font-bold mt-1 text-white">
              {language === 'es' ? 'Familia García' : 'García Family'} 👨‍👩‍👧‍👦
            </div>
            <div className="text-xs opacity-80 mt-1 text-white">
              {t('destination')}: 🇲🇽 {language === 'es' ? 'Mamá en Guadalajara' : 'Mom in Guadalajara'}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] opacity-70 text-white">{t('thisMonth')}</div>
            <div className="text-2xl font-bold font-mono text-white">${totalThisMonth}</div>
            <div className="text-[10px] opacity-70 text-white">
              {language === 'es' ? 'de' : 'of'} ${monthlyGoal} {t('goal')}
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-white/70">
          <span>{progressPercent.toFixed(0)}% {language === 'es' ? 'completado' : 'complete'}</span>
          <span>${monthlyGoal - totalThisMonth} {language === 'es' ? 'restante' : 'remaining'}</span>
        </div>
      </div>

      {/* Invite Code Card */}
      <div 
        className="rounded-xl p-4 mb-5 flex items-center justify-between"
        style={{ 
          background: theme.cardHighlight,
          border: `1px solid ${theme.primary}40`,
        }}
      >
        <div>
          <div className="text-xs" style={{ color: theme.textMuted }}>
            {language === 'es' ? 'Código de invitación' : 'Invite code'}
          </div>
          <div className="font-mono font-bold" style={{ color: theme.primary }}>
            {inviteCode}
          </div>
        </div>
        <button
          onClick={handleCopyCode}
          className="p-2 rounded-lg transition-all"
          style={{ 
            background: theme.primary,
            color: theme.id === 'dark' || theme.id === 'midnight' ? '#000' : '#fff',
          }}
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      </div>

      {/* Group Members */}
      <div className="mb-4">
        <div className="text-xs font-semibold mb-3" style={{ color: theme.textSecondary }}>
          {t('groupMembers')} ({mockFamilyMembers.length})
        </div>
        <div className="space-y-2">
          {mockFamilyMembers.map((member, index) => (
            <div 
              key={member.id}
              className="rounded-xl p-4 flex items-center justify-between"
              style={{ 
                background: theme.surface,
                border: `1px solid ${theme.surfaceBorder}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{ background: theme.cardHighlight }}
                >
                  {member.avatar}
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: theme.text }}>
                    {member.name}
                    {index === 0 && (
                      <span 
                        className="ml-2 text-[9px] px-2 py-0.5 rounded-full"
                        style={{ background: theme.primary + '30', color: theme.primary }}
                      >
                        Admin
                      </span>
                    )}
                  </div>
                  <div className="text-xs" style={{ color: theme.textMuted }}>
                    {t('lastSent')}: {member.lastSent}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold" style={{ color: theme.success }}>
                  ${member.amount}
                </div>
                <div className="text-[10px]" style={{ color: theme.textMuted }}>
                  {t('thisMonth').toLowerCase()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Button */}
      <button
        className="w-full py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mb-5"
        style={{
          border: `2px dashed ${theme.surfaceBorder}`,
          background: 'transparent',
          color: theme.textMuted,
        }}
      >
        <UserPlus size={18} />
        {t('inviteFamily')}
      </button>

      {/* Suggestion Card */}
      <div 
        className="rounded-xl p-4"
        style={{ 
          background: theme.cardHighlight,
          border: `1px solid ${theme.primary}30`,
        }}
      >
        <div className="flex items-start gap-3">
          <div className="text-xl">💡</div>
          <div>
            <div className="text-xs font-semibold mb-1" style={{ color: theme.primary }}>
              {t('suggestion')}
            </div>
            <div className="text-xs" style={{ color: theme.textSecondary }}>
              {t('familySuggestion')}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mt-5">
        {[
          { 
            icon: '📅', 
            value: '15', 
            label: language === 'es' ? 'Envíos este año' : 'Sends this year' 
          },
          { 
            icon: '💰', 
            value: '$89', 
            label: language === 'es' ? 'Ahorrado juntos' : 'Saved together' 
          },
          { 
            icon: '⭐', 
            value: '4.8', 
            label: language === 'es' ? 'Tasa promedio' : 'Avg. rate' 
          },
        ].map((stat, i) => (
          <div 
            key={i}
            className="rounded-xl p-3 text-center"
            style={{ 
              background: theme.surface,
              border: `1px solid ${theme.surfaceBorder}`,
            }}
          >
            <div className="text-lg mb-1">{stat.icon}</div>
            <div className="font-bold text-sm" style={{ color: theme.text }}>{stat.value}</div>
            <div className="text-[9px]" style={{ color: theme.textMuted }}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Create Group Form Component
function CreateGroupForm({ onBack, theme, language, t }: { 
  onBack: () => void; 
  theme: any; 
  language: 'es' | 'en'; 
  t: any;
}) {
  const [groupName, setGroupName] = useState('');
  const [destination, setDestination] = useState('MX');

  return (
    <div className="animate-fade-in">
      <button 
        onClick={onBack}
        className="flex items-center gap-1 mb-4 text-sm"
        style={{ color: theme.primary }}
      >
        ← {language === 'es' ? 'Volver' : 'Back'}
      </button>

      <h2 className="text-xl font-bold mb-6" style={{ color: theme.text }}>
        👨‍👩‍👧 {t('createGroup')}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-xs mb-2" style={{ color: theme.textMuted }}>
            {language === 'es' ? 'Nombre del grupo' : 'Group name'}
          </label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder={language === 'es' ? 'Ej: Familia García' : 'Ex: García Family'}
            className="w-full p-4 rounded-xl text-sm"
            style={{
              background: theme.inputBg,
              border: `2px solid ${theme.inputBorder}`,
              color: theme.text,
            }}
          />
        </div>

        <div>
          <label className="block text-xs mb-2" style={{ color: theme.textMuted }}>
            {t('destinationCountry')}
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full p-4 rounded-xl text-sm"
            style={{
              background: theme.inputBg,
              border: `2px solid ${theme.inputBorder}`,
              color: theme.text,
            }}
          >
            {countries.map(country => (
              <option key={country.code} value={country.code}>
                {country.flag} {country.name[language]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs mb-2" style={{ color: theme.textMuted }}>
            {language === 'es' ? 'Meta mensual (USD)' : 'Monthly goal (USD)'}
          </label>
          <input
            type="number"
            placeholder="1500"
            className="w-full p-4 rounded-xl text-sm"
            style={{
              background: theme.inputBg,
              border: `2px solid ${theme.inputBorder}`,
              color: theme.text,
            }}
          />
        </div>

        <button
          className="w-full py-4 rounded-xl font-bold text-sm mt-4"
          style={{
            background: theme.primaryGradient,
            color: theme.id === 'dark' || theme.id === 'midnight' ? '#000' : '#fff',
          }}
        >
          {t('createGroup')}
        </button>
      </div>
    </div>
  );
}
