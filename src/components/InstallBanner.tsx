'use client';

import React, { useState, useEffect } from 'react';
import { useTheme, useTranslation } from '@/lib/context';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { X, Download, Share } from 'lucide-react';

export default function InstallBanner() {
  const { theme } = useTheme();
  const { language } = useTranslation();
  const { canInstall, isInstalled, isIOS, install } = usePWAInstall();
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user has dismissed before
    const wasDismissed = localStorage.getItem('pwa-banner-dismissed');
    if (wasDismissed) {
      setDismissed(true);
      return;
    }

    // Show banner after 5 seconds if can install or is iOS
    const timer = setTimeout(() => {
      if ((canInstall || isIOS) && !isInstalled) {
        setShowBanner(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [canInstall, isIOS, isInstalled]);

  const handleDismiss = () => {
    setShowBanner(false);
    setDismissed(true);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      setShowBanner(false);
    }
  };

  if (!showBanner || dismissed || isInstalled) return null;

  return (
    <div 
      className="fixed bottom-20 left-4 right-4 z-[100] rounded-2xl p-4 shadow-xl animate-slide-up"
      style={{ 
        background: theme.surface,
        border: `1px solid ${theme.primary}50`,
      }}
    >
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 p-1 rounded-full"
        style={{ color: theme.textMuted }}
      >
        <X size={18} />
      </button>

      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: theme.primaryGradient }}
        >
          <span className="text-2xl">💸</span>
        </div>
        
        <div className="flex-1">
          <div className="font-bold text-sm" style={{ color: theme.text }}>
            {language === 'es' ? 'Instalar ComparaRemesas' : 'Install ComparaRemesas'}
          </div>
          <div className="text-xs mt-1" style={{ color: theme.textMuted }}>
            {isIOS 
              ? (language === 'es' 
                  ? 'Toca compartir y "Agregar a inicio"' 
                  : 'Tap share and "Add to Home Screen"')
              : (language === 'es' 
                  ? 'Accede más rápido desde tu pantalla' 
                  : 'Access faster from your home screen')
            }
          </div>
        </div>

        {isIOS ? (
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: theme.cardHighlight }}
          >
            <Share size={18} style={{ color: theme.primary }} />
          </div>
        ) : (
          <button
            onClick={handleInstall}
            className="px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2"
            style={{ 
              background: theme.primaryGradient,
              color: theme.id === 'dark' || theme.id === 'midnight' ? '#000' : '#fff',
            }}
          >
            <Download size={16} />
            {language === 'es' ? 'Instalar' : 'Install'}
          </button>
        )}
      </div>
    </div>
  );
}
