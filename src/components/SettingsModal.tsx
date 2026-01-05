'use client';

import React, { useState } from 'react';
import { useTheme, useTranslation } from '@/lib/context';
import { themes, ThemeId } from '@/lib/themes';
import { 
  X, ChevronLeft, ChevronRight, Bell, Shield, User, Wrench, 
  HelpCircle, Star, Share2, FileText, Mail, Calculator,
  Calendar, TrendingUp, AlertTriangle, BookOpen
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SettingsTab = 'main' | 'appearance' | 'notifications' | 'security' | 'profile' | 'tools' | 'feedback' | 'support';

// Mock user data
const userData = {
  name: 'Carlos García',
  email: 'carlos@email.com',
  avatar: 'CG',
  memberSince: 'Enero 2025',
  totalSent: 8450,
  totalSaved: 127,
  level: 'silver',
  achievements: [
    { id: 1, icon: '🚀', name: { es: 'Primera transferencia', en: 'First transfer' }, unlocked: true },
    { id: 2, icon: '💯', name: { es: '$1,000 enviados', en: '$1,000 sent' }, unlocked: true },
    { id: 3, icon: '🏆', name: { es: '$5,000 enviados', en: '$5,000 sent' }, unlocked: true },
    { id: 4, icon: '👨‍👩‍👧', name: { es: 'Grupo familiar', en: 'Family group' }, unlocked: true },
    { id: 5, icon: '💎', name: { es: '$10,000 enviados', en: '$10,000 sent' }, unlocked: false },
    { id: 6, icon: '🌟', name: { es: 'Super ahorrador', en: 'Super saver' }, unlocked: false },
  ],
};

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, themeId, setThemeId } = useTheme();
  const { t, language, setLanguage } = useTranslation();
  const [activeTab, setActiveTab] = useState<SettingsTab>('main');
  
  // Notifications state
  const [notifications, setNotifications] = useState({
    rateAlerts: true,
    reminders: true,
    promos: false,
  });
  
  // Security state
  const [security, setSecurity] = useState({
    faceId: false,
    pin: false,
  });
  
  // Feedback state
  const [feedbackData, setFeedbackData] = useState({ category: 'general', rating: 5, message: '' });
  const [feedbackSent, setFeedbackSent] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setActiveTab('main');
    setFeedbackSent(false);
    onClose();
  };

  const menuItems = [
    { id: 'appearance', icon: '🎨', label: t('appearance'), desc: `${t('theme')} & ${t('language')}` },
    { id: 'notifications', icon: '🔔', label: t('notifications'), desc: t('notificationsDesc') },
    { id: 'security', icon: '🔒', label: t('security'), desc: t('securityDesc') },
    { id: 'profile', icon: '👤', label: t('profile'), desc: `${t('userLevel')} & ${t('achievements')}` },
    { id: 'tools', icon: '🛠️', label: t('tools'), desc: language === 'es' ? 'Calculadoras y más' : 'Calculators and more' },
    { id: 'feedback', icon: '💬', label: t('feedback'), desc: t('feedbackDesc') },
    { id: 'support', icon: '❓', label: t('support'), desc: language === 'es' ? 'Ayuda y contacto' : 'Help and contact' },
  ];

  const getLevelInfo = () => {
    const levels = {
      bronze: { name: t('levelBronze'), color: '#CD7F32', next: 1000 },
      silver: { name: t('levelSilver'), color: '#C0C0C0', next: 5000 },
      gold: { name: t('levelGold'), color: '#FFD700', next: 10000 },
      platinum: { name: t('levelPlatinum'), color: '#E5E4E2', next: null },
    };
    return levels[userData.level as keyof typeof levels];
  };

  // Render functions for each tab
  const renderMainMenu = () => (
    <>
      <h3 className="text-lg font-bold mb-5" style={{ color: theme.text }}>
        ⚙️ {t('settings')}
      </h3>

      <div className="space-y-2">
        {menuItems.map((item) => (
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
            <ChevronRight size={16} style={{ color: theme.textMuted }} />
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
              <span className="text-xl">{lang.flag}</span> {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Theme */}
      <div className="text-xs uppercase tracking-wider mb-3" style={{ color: theme.textMuted }}>
        {t('theme')}
      </div>
      <div className="grid grid-cols-2 gap-3">
        {Object.values(themes).map((themeOption) => (
          <button
            key={themeOption.id}
            onClick={() => setThemeId(themeOption.id as ThemeId)}
            className="p-4 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all"
            style={{
              background: themeId === themeOption.id ? theme.cardHighlight : theme.surface,
              border: `2px solid ${themeId === themeOption.id ? theme.primary : theme.surfaceBorder}`,
              color: theme.text,
            }}
          >
            <span className="text-xl">{themeOption.icon}</span>
            <span>{themeOption.name[language]}</span>
          </button>
        ))}
      </div>
    </>
  );

  const renderNotifications = () => (
    <>
      <button 
        onClick={() => setActiveTab('main')}
        className="flex items-center gap-1 mb-4 text-sm"
        style={{ color: theme.primary }}
      >
        <ChevronLeft size={16} /> {t('settings')}
      </button>
      
      <h3 className="text-lg font-bold mb-5" style={{ color: theme.text }}>
        🔔 {t('notifications')}
      </h3>

      <div className="space-y-3">
        {[
          { 
            id: 'rateAlerts', 
            icon: <TrendingUp size={18} />,
            title: language === 'es' ? 'Alertas de tipo de cambio' : 'Exchange rate alerts',
            desc: language === 'es' ? 'Notificarte cuando la tasa te convenga' : 'Notify when rate is favorable',
          },
          { 
            id: 'reminders', 
            icon: <Calendar size={18} />,
            title: language === 'es' ? 'Recordatorios de envío' : 'Transfer reminders',
            desc: language === 'es' ? 'Recordar envíos programados' : 'Remind scheduled transfers',
          },
          { 
            id: 'promos', 
            icon: <Star size={18} />,
            title: language === 'es' ? 'Ofertas promocionales' : 'Promotional offers',
            desc: language === 'es' ? 'Descuentos y promociones' : 'Discounts and promotions',
          },
        ].map((item) => (
          <div 
            key={item.id}
            className="flex items-center justify-between p-4 rounded-xl"
            style={{
              background: theme.surface,
              border: `1px solid ${theme.surfaceBorder}`,
            }}
          >
            <div className="flex items-center gap-3">
              <div style={{ color: theme.primary }}>{item.icon}</div>
              <div>
                <div className="font-semibold text-sm" style={{ color: theme.text }}>{item.title}</div>
                <div className="text-xs" style={{ color: theme.textMuted }}>{item.desc}</div>
              </div>
            </div>
            <button
              onClick={() => setNotifications({ ...notifications, [item.id]: !notifications[item.id as keyof typeof notifications] })}
              className="w-12 h-7 rounded-full relative transition-all"
              style={{
                background: notifications[item.id as keyof typeof notifications] ? theme.primary : theme.inputBorder,
              }}
            >
              <div 
                className="w-5 h-5 rounded-full bg-white absolute top-1 transition-all"
                style={{ left: notifications[item.id as keyof typeof notifications] ? '26px' : '4px' }}
              />
            </button>
          </div>
        ))}
      </div>
    </>
  );

  const renderSecurity = () => (
    <>
      <button 
        onClick={() => setActiveTab('main')}
        className="flex items-center gap-1 mb-4 text-sm"
        style={{ color: theme.primary }}
      >
        <ChevronLeft size={16} /> {t('settings')}
      </button>
      
      <h3 className="text-lg font-bold mb-5" style={{ color: theme.text }}>
        🔒 {t('security')}
      </h3>

      <div className="space-y-3">
        {[
          { 
            id: 'faceId', 
            icon: '👤',
            title: 'Face ID / Touch ID',
            desc: language === 'es' ? 'Desbloquear con biometría' : 'Unlock with biometrics',
          },
          { 
            id: 'pin', 
            icon: '🔢',
            title: language === 'es' ? 'Código PIN' : 'PIN Code',
            desc: language === 'es' ? 'Proteger con 4 dígitos' : 'Protect with 4 digits',
          },
        ].map((item) => (
          <div 
            key={item.id}
            className="flex items-center justify-between p-4 rounded-xl"
            style={{
              background: theme.surface,
              border: `1px solid ${theme.surfaceBorder}`,
            }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{item.icon}</span>
              <div>
                <div className="font-semibold text-sm" style={{ color: theme.text }}>{item.title}</div>
                <div className="text-xs" style={{ color: theme.textMuted }}>{item.desc}</div>
              </div>
            </div>
            <button
              onClick={() => setSecurity({ ...security, [item.id]: !security[item.id as keyof typeof security] })}
              className="w-12 h-7 rounded-full relative transition-all"
              style={{
                background: security[item.id as keyof typeof security] ? theme.primary : theme.inputBorder,
              }}
            >
              <div 
                className="w-5 h-5 rounded-full bg-white absolute top-1 transition-all"
                style={{ left: security[item.id as keyof typeof security] ? '26px' : '4px' }}
              />
            </button>
          </div>
        ))}
      </div>

      <div 
        className="mt-4 p-4 rounded-xl"
        style={{
          background: `${theme.warning}15`,
          border: `1px solid ${theme.warning}30`,
        }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle size={18} style={{ color: theme.warning }} />
          <div className="text-xs" style={{ color: theme.textSecondary }}>
            {language === 'es' 
              ? 'La seguridad biométrica requiere que tu dispositivo tenga Face ID o Touch ID configurado.'
              : 'Biometric security requires your device to have Face ID or Touch ID set up.'
            }
          </div>
        </div>
      </div>
    </>
  );

  const renderProfile = () => {
    const levelInfo = getLevelInfo();
    const progress = (userData.totalSent / (levelInfo.next || userData.totalSent)) * 100;

    return (
      <>
        <button 
          onClick={() => setActiveTab('main')}
          className="flex items-center gap-1 mb-4 text-sm"
          style={{ color: theme.primary }}
        >
          <ChevronLeft size={16} /> {t('settings')}
        </button>
        
        <h3 className="text-lg font-bold mb-5" style={{ color: theme.text }}>
          👤 {t('profile')}
        </h3>

        {/* User Card */}
        <div 
          className="rounded-xl p-4 mb-4"
          style={{
            background: theme.secondaryGradient,
          }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white"
              style={{ background: 'rgba(255,255,255,0.2)' }}
            >
              {userData.avatar}
            </div>
            <div className="text-white">
              <div className="font-bold">{userData.name}</div>
              <div className="text-xs opacity-80">{t('memberSince')} {userData.memberSince}</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div 
            className="rounded-xl p-3 text-center"
            style={{ background: theme.surface, border: `1px solid ${theme.surfaceBorder}` }}
          >
            <div className="text-lg font-bold" style={{ color: theme.primary }}>
              ${userData.totalSent.toLocaleString()}
            </div>
            <div className="text-xs" style={{ color: theme.textMuted }}>{t('totalSent')}</div>
          </div>
          <div 
            className="rounded-xl p-3 text-center"
            style={{ background: theme.surface, border: `1px solid ${theme.surfaceBorder}` }}
          >
            <div className="text-lg font-bold" style={{ color: theme.success }}>
              ${userData.totalSaved}
            </div>
            <div className="text-xs" style={{ color: theme.textMuted }}>{t('totalSaved')}</div>
          </div>
        </div>

        {/* Level */}
        <div 
          className="rounded-xl p-4 mb-4"
          style={{ background: theme.surface, border: `1px solid ${theme.surfaceBorder}` }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">🏅</span>
              <span className="font-semibold text-sm" style={{ color: theme.text }}>
                {t('userLevel')}: {levelInfo.name}
              </span>
            </div>
            <div 
              className="px-2 py-1 rounded-full text-xs font-bold"
              style={{ background: levelInfo.color, color: '#000' }}
            >
              {levelInfo.name.toUpperCase()}
            </div>
          </div>
          {levelInfo.next && (
            <>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all"
                  style={{ width: `${Math.min(progress, 100)}%`, background: levelInfo.color }}
                />
              </div>
              <div className="text-xs mt-2" style={{ color: theme.textMuted }}>
                ${userData.totalSent.toLocaleString()} / ${levelInfo.next.toLocaleString()} {language === 'es' ? 'para siguiente nivel' : 'to next level'}
              </div>
            </>
          )}
        </div>

        {/* Achievements */}
        <div className="text-xs uppercase tracking-wider mb-3" style={{ color: theme.textMuted }}>
          {t('achievements')}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {userData.achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className="rounded-xl p-3 text-center"
              style={{ 
                background: theme.surface, 
                border: `1px solid ${theme.surfaceBorder}`,
                opacity: achievement.unlocked ? 1 : 0.4,
              }}
            >
              <div className="text-2xl mb-1">{achievement.icon}</div>
              <div className="text-[9px]" style={{ color: theme.textMuted }}>
                {achievement.name[language]}
              </div>
              {achievement.unlocked && (
                <div className="text-[8px] mt-1" style={{ color: theme.success }}>✓</div>
              )}
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderTools = () => (
    <>
      <button 
        onClick={() => setActiveTab('main')}
        className="flex items-center gap-1 mb-4 text-sm"
        style={{ color: theme.primary }}
      >
        <ChevronLeft size={16} /> {t('settings')}
      </button>
      
      <h3 className="text-lg font-bold mb-5" style={{ color: theme.text }}>
        🛠️ {t('tools')}
      </h3>

      <div className="space-y-2">
        {[
          { icon: '🧮', label: t('tipCalculator'), desc: language === 'es' ? 'Calcular propinas' : 'Calculate tips' },
          { icon: '📅', label: t('bankHolidays'), desc: language === 'es' ? 'Días festivos bancarios' : 'Bank holidays' },
          { icon: '📈', label: t('rateHistory'), desc: language === 'es' ? 'Gráficos históricos' : 'Historical charts' },
          { icon: '🛡️', label: t('scamChecker'), desc: language === 'es' ? 'Verificar estafas' : 'Check for scams' },
          { icon: '📖', label: t('glossary'), desc: language === 'es' ? 'Términos de remesas' : 'Remittance terms' },
        ].map((tool, i) => (
          <button
            key={i}
            className="w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all hover:opacity-80"
            style={{
              background: theme.surface,
              border: `1px solid ${theme.surfaceBorder}`,
              color: theme.text,
            }}
          >
            <span className="text-xl">{tool.icon}</span>
            <div className="flex-1">
              <div className="font-semibold text-sm">{tool.label}</div>
              <div className="text-xs" style={{ color: theme.textMuted }}>{tool.desc}</div>
            </div>
            <ChevronRight size={16} style={{ color: theme.textMuted }} />
          </button>
        ))}
      </div>

      <div 
        className="mt-4 p-4 rounded-xl text-center"
        style={{
          background: theme.cardHighlight,
          border: `1px solid ${theme.primary}30`,
        }}
      >
        <div className="text-2xl mb-2">🚧</div>
        <div className="text-xs" style={{ color: theme.textSecondary }}>
          {language === 'es' 
            ? 'Estas herramientas estarán disponibles pronto'
            : 'These tools will be available soon'
          }
        </div>
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

  const renderSupport = () => (
    <>
      <button 
        onClick={() => setActiveTab('main')}
        className="flex items-center gap-1 mb-4 text-sm"
        style={{ color: theme.primary }}
      >
        <ChevronLeft size={16} /> {t('settings')}
      </button>
      
      <h3 className="text-lg font-bold mb-5" style={{ color: theme.text }}>
        ❓ {t('support')}
      </h3>

      <div className="space-y-2">
        {[
          { icon: <HelpCircle size={18} />, label: t('helpCenter'), action: 'help' },
          { icon: <Mail size={18} />, label: t('contactUs'), action: 'contact' },
          { icon: <Star size={18} />, label: t('rateApp'), action: 'rate' },
          { icon: <Share2 size={18} />, label: t('shareApp'), action: 'share' },
        ].map((item, i) => (
          <button
            key={i}
            className="w-full flex items-center gap-3 p-4 rounded-xl text-left transition-all hover:opacity-80"
            style={{
              background: theme.surface,
              border: `1px solid ${theme.surfaceBorder}`,
              color: theme.text,
            }}
          >
            <div style={{ color: theme.primary }}>{item.icon}</div>
            <div className="flex-1 font-semibold text-sm">{item.label}</div>
            <ChevronRight size={16} style={{ color: theme.textMuted }} />
          </button>
        ))}
      </div>

      <div className="mt-6 pt-4" style={{ borderTop: `1px solid ${theme.surfaceBorder}` }}>
        <div className="space-y-2">
          {[
            { label: t('privacyPolicy'), icon: <FileText size={16} /> },
            { label: t('termsOfService'), icon: <FileText size={16} /> },
          ].map((item, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-left text-sm transition-all hover:opacity-80"
              style={{ color: theme.textMuted }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="text-center mt-6">
        <div className="text-xs" style={{ color: theme.textMuted }}>
          {t('version')} 1.0.0
        </div>
        <div className="text-[10px] mt-1" style={{ color: theme.textMuted }}>
          Made with ❤️ for LATAM families
        </div>
      </div>
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'main': return renderMainMenu();
      case 'appearance': return renderAppearance();
      case 'notifications': return renderNotifications();
      case 'security': return renderSecurity();
      case 'profile': return renderProfile();
      case 'tools': return renderTools();
      case 'feedback': return renderFeedback();
      case 'support': return renderSupport();
      default: return renderMainMenu();
    }
  };

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

        {renderContent()}
      </div>
    </div>
  );
}
