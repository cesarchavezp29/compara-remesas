'use client';

import React, { useState } from 'react';
import { useApp, useTheme, useTranslation } from '@/lib/context';
import { themes, ThemeId } from '@/lib/themes';
import { X, ChevronLeft } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'main' | 'appearance' | 'feedback';

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, themeId, setThemeId } = useTheme();
  const { t, language, setLanguage } = useTranslation();
  const [activeTab, setActiveTab] = useState<SettingsTab>('main');
  const [feedbackData, setFeedbackData] = useState({ category: 'general', rating: 5, message: '' });
  const [feedbackSent, setFeedbackSent] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setActiveTab('main');
    setFeedbackSent(false);
    onClose();
  };

  const renderMainMenu = () => (
    <>
      <h3 className="text-lg font-bold mb-5" style={{ color: theme.text }}>
        ⚙️ {t('settings')}
      </h3>

      <div className="space-y-2">
        {[
          { id: 'appearance', icon: '🎨', label: t('appearance'), desc: `${t('theme')} & ${t('language')}` },
          { id: 'feedback', icon: '💬', label: t('feedback'), desc: t('feedbackDesc') },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as SettingsTab)}
            className="w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all hover:opacity-80"
            style={{
              background: theme.surface,
              border: `1px solid ${theme.surfaceBorder}`,
              color: theme.text,
            }}
          >
            <span className="text-xl">{item.icon}</span>
            <div className="flex-1">
              <div className="font-semibold text-sm">{item.label}</div>
              <div className="text-xs" style={{ color: theme.textMuted }}>{item.desc}</div>
            </div>
            <span style={{ color: theme.textMuted }}>›</span>
          </button>
        ))}
      </div>

      <div className="text-center mt-6 text-xs" style={{ color: theme.textMuted }}>
        {t('version')} 1.0.0
      </div>
    </>
  );

  const renderAppearance = () => (
    <>
      <button 
        onClick={() => setActiveTab('main')}
        className="flex items-center gap-1 mb-4 text-sm"
        style={{ color: theme.primary }}
      >
        <ChevronLeft size={16} /> {t('settings')}
      </button>
      
      <h3 className="text-lg font-bold mb-5" style={{ color: theme.text }}>
        🎨 {t('appearance')}
      </h3>

      {/* Language */}
      <div className="mb-6">
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: theme.textMuted }}>
          {t('language')}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { code: 'es' as const, label: 'Español', flag: '🇪🇸' },
            { code: 'en' as const, label: 'English', flag: '🇺🇸' },
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className="p-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              style={{
                background: language === lang.code ? theme.cardHighlight : theme.surface,
                border: `2px solid ${language === lang.code ? theme.primary : theme.surfaceBorder}`,
                color: theme.text,
              }}
            >
              <span>{lang.flag}</span> {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div className="text-xs uppercase tracking-wider mb-3" style={{ color: theme.textMuted }}>
        {t('theme')}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Object.values(themes).map((t) => (
          <button
            key={t.id}
            onClick={() => setThemeId(t.id as ThemeId)}
            className="p-4 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all"
            style={{
              background: themeId === t.id ? theme.cardHighlight : theme.surface,
              border: `2px solid ${themeId === t.id ? theme.primary : theme.surfaceBorder}`,
              color: theme.text,
            }}
          >
            <span className="text-xl">{t.icon}</span>
            <span>{t.name[language]}</span>
          </button>
        ))}
      </div>
    </>
  );

  const renderFeedback = () => (
    <>
      <button 
        onClick={() => setActiveTab('main')}
        className="flex items-center gap-1 mb-4 text-sm"
        style={{ color: theme.primary }}
      >
        <ChevronLeft size={16} /> {t('settings')}
      </button>
      
      <h3 className="text-lg font-bold mb-5" style={{ color: theme.text }}>
        💬 {t('feedback')}
      </h3>

      {feedbackSent ? (
        <div className="text-center py-10">
          <div className="text-5xl mb-4">🎉</div>
          <div className="text-lg font-bold mb-2" style={{ color: theme.text }}>
            {t('feedbackThanks')}
          </div>
          <div className="text-sm" style={{ color: theme.textMuted }}>
            {language === 'es' ? 'Tu opinión nos ayuda a mejorar.' : 'Your feedback helps us improve.'}
          </div>
        </div>
      ) : (
        <>
          {/* Rating */}
          <div className="mb-5">
            <label className="block text-xs mb-2" style={{ color: theme.textMuted }}>
              {t('feedbackRating')}
            </label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                  className="text-3xl transition-all hover:scale-110"
                  style={{ opacity: star <= feedbackData.rating ? 1 : 0.3 }}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="mb-5">
            <label className="block text-xs mb-2" style={{ color: theme.textMuted }}>
              {t('feedbackCategory')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'bug', icon: '🐛', label: t('feedbackBug') },
                { id: 'feature', icon: '💡', label: t('feedbackFeature') },
                { id: 'general', icon: '💬', label: t('feedbackGeneral') },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFeedbackData({ ...feedbackData, category: cat.id })}
                  className="p-3 rounded-xl text-center text-xs transition-all"
                  style={{
                    background: feedbackData.category === cat.id ? theme.cardHighlight : theme.surface,
                    border: `2px solid ${feedbackData.category === cat.id ? theme.primary : theme.surfaceBorder}`,
                    color: theme.text,
                  }}
                >
                  <div className="text-lg mb-1">{cat.icon}</div>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div className="mb-5">
            <textarea
              placeholder={t('feedbackPlaceholder')}
              value={feedbackData.message}
              onChange={(e) => setFeedbackData({ ...feedbackData, message: e.target.value })}
              className="w-full h-28 p-4 rounded-xl text-sm resize-none"
              style={{
                background: theme.inputBg,
                border: `2px solid ${theme.inputBorder}`,
                color: theme.text,
              }}
            />
          </div>

          {/* Submit */}
          <button
            onClick={() => setFeedbackSent(true)}
            className="w-full py-4 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{
              background: theme.primaryGradient,
              color: theme.id === 'dark' || theme.id === 'midnight' ? '#000' : '#fff',
            }}
          >
            {t('submitFeedback')}
          </button>
        </>
      )}
    </>
  );

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-md rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto animate-slide-up"
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
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-all hover:opacity-70"
          style={{ color: theme.textMuted }}
        >
          <X size={20} />
        </button>

        {activeTab === 'main' && renderMainMenu()}
        {activeTab === 'appearance' && renderAppearance()}
        {activeTab === 'feedback' && renderFeedback()}
      </div>
    </div>
  );
}
