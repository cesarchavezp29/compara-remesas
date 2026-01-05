'use client';

import React from 'react';
import { useTheme, useTranslation } from '@/lib/context';
import { Settings } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
}

export default function Header({ onSettingsClick }: HeaderProps) {
  const { theme } = useTheme();
  const { language } = useTranslation();

  return (
    <header 
      className="sticky top-0 z-50 px-4 py-3 flex justify-between items-center glass safe-area-top"
      style={{
        background: theme.navBg,
        borderBottom: `1px solid ${theme.surfaceBorder}`,
      }}
    >
      <div className="flex items-center gap-2.5">
        <div 
          className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
          style={{ background: theme.primaryGradient }}
        >
          💸
        </div>
        <span className="font-mono text-sm font-bold" style={{ color: theme.text }}>
          {language === 'es' ? 'Compara' : 'Compare'}
          <span style={{ color: theme.primary }}>
            {language === 'es' ? 'Remesas' : 'Remit'}
          </span>
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onSettingsClick}
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-80"
          style={{
            background: theme.surface,
            border: `1px solid ${theme.surfaceBorder}`,
            color: theme.text,
          }}
        >
          <Settings size={18} />
        </button>
        <div 
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ background: theme.secondaryGradient }}
        >
          CG
        </div>
      </div>
    </header>
  );
}
