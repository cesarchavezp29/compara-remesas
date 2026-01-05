'use client';

import React, { useState } from 'react';
import { useTheme } from '@/lib/context';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import CompareTab from '@/components/CompareTab';
import FamilyTab from '@/components/FamilyTab';
import HistoryTab from '@/components/HistoryTab';
import AlertsTab from '@/components/AlertsTab';
import CashbackTab from '@/components/CashbackTab';
import SettingsModal from '@/components/SettingsModal';
import InstallBanner from '@/components/InstallBanner';

export default function Home() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('compare');
  const [showSettings, setShowSettings] = useState(false);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'compare':
        return <CompareTab />;
      case 'family':
        return <FamilyTab />;
      case 'history':
        return <HistoryTab />;
      case 'alerts':
        return <AlertsTab />;
      case 'cashback':
        return <CashbackTab />;
      default:
        return <CompareTab />;
    }
  };

  return (
    <div 
      className="min-h-screen max-w-md mx-auto relative"
      style={{ background: theme.background }}
    >
      <Header onSettingsClick={() => setShowSettings(true)} />
      
      <main className="px-4 py-5 pb-24">
        {renderTabContent()}
      </main>
      
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
      
      <InstallBanner />
    </div>
  );
}
