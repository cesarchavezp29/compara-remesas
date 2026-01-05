'use client';

import React from 'react';
import { useTheme, useTranslation } from '@/lib/context';

interface NavItem {
  id: string;
  icon: string;
  labelKey: 'tabCompare' | 'tabFamily' | 'tabHistory' | 'tabAlerts' | 'tabCashback';
}

const navItems: NavItem[] = [
  { id: 'compare', icon: '🔍', labelKey: 'tabCompare' },
  { id: 'family', icon: '👨‍👩‍👧', labelKey: 'tabFamily' },
  { id: 'history', icon: '📊', labelKey: 'tabHistory' },
  { id: 'alerts', icon: '🔔', labelKey: 'tabAlerts' },
  { id: 'cashback', icon: '💰', labelKey: 'tabCashback' },
];

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <nav 
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md glass safe-area-bottom"
      style={{
        background: theme.navBg,
        borderTop: `1px solid ${theme.surfaceBorder}`,
      }}
    >
      <div className="flex justify-around py-2 px-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all"
            style={{
              color: activeTab === item.id ? theme.primary : theme.textMuted,
            }}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[9px] font-semibold">{t(item.labelKey)}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
