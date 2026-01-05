'use client';

import React, { useState } from 'react';
import { useTheme, useTranslation, useAuth } from '@/lib/context';
import { Settings, LogOut, User } from 'lucide-react';
import AuthModal from './AuthModal';

interface HeaderProps {
  onSettingsClick: () => void;
}

export default function Header({ onSettingsClick }: HeaderProps) {
  const { theme } = useTheme();
  const { t, language } = useTranslation();
  const { user, loading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getUserInitials = () => {
    if (!user) return '?';
    const name = user.user_metadata?.name || user.email || '';
    if (user.user_metadata?.name) {
      return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  return (
    <>
      <header 
        className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
        style={{ 
          background: theme.background,
          borderBottom: `1px solid ${theme.surfaceBorder}`,
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div 
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: theme.primaryGradient }}
          >
            <span className="text-lg">💸</span>
          </div>
          <div>
            <span className="font-bold" style={{ color: theme.primary }}>Compara</span>
            <span className="font-bold" style={{ color: theme.text }}>Remesas</span>
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Settings */}
          <button 
            onClick={onSettingsClick}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-80"
            style={{ 
              background: theme.surface,
              border: `1px solid ${theme.surfaceBorder}`,
            }}
          >
            <Settings size={18} style={{ color: theme.textMuted }} />
          </button>
          
          {/* User Avatar / Login Button */}
          {loading ? (
            <div 
              className="w-9 h-9 rounded-full animate-pulse"
              style={{ background: theme.surface }}
            />
          ) : user ? (
            <div className="relative">
              <button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all hover:opacity-80"
                style={{ 
                  background: theme.secondaryGradient,
                  color: '#fff',
                }}
              >
                {getUserInitials()}
              </button>
              
              {/* User Menu Dropdown */}
              {showUserMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                  />
                  <div 
                    className="absolute right-0 top-12 w-56 rounded-xl overflow-hidden z-50 shadow-xl"
                    style={{ 
                      background: theme.surface,
                      border: `1px solid ${theme.surfaceBorder}`,
                    }}
                  >
                    {/* User Info */}
                    <div 
                      className="p-4 border-b"
                      style={{ borderColor: theme.surfaceBorder }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ 
                            background: theme.secondaryGradient,
                            color: '#fff',
                          }}
                        >
                          {getUserInitials()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div 
                            className="font-semibold text-sm truncate"
                            style={{ color: theme.text }}
                          >
                            {user.user_metadata?.name || language === 'es' ? 'Usuario' : 'User'}
                          </div>
                          <div 
                            className="text-xs truncate"
                            style={{ color: theme.textMuted }}
                          >
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onSettingsClick();
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-all hover:opacity-80"
                        style={{ color: theme.text }}
                      >
                        <User size={16} style={{ color: theme.textMuted }} />
                        {language === 'es' ? 'Mi Perfil' : 'My Profile'}
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-all hover:opacity-80"
                        style={{ color: theme.danger }}
                      >
                        <LogOut size={16} />
                        {language === 'es' ? 'Cerrar Sesión' : 'Sign Out'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90"
              style={{ 
                background: theme.primaryGradient,
                color: theme.id === 'dark' || theme.id === 'midnight' ? '#000' : '#fff',
              }}
            >
              {language === 'es' ? 'Entrar' : 'Sign In'}
            </button>
          )}
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  );
}
