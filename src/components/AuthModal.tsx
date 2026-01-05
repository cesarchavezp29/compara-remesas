'use client';

import React, { useState } from 'react';
import { useTheme, useTranslation, useAuth } from '@/lib/context';
import { supabase } from '@/lib/supabase';
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'login' | 'register' | 'forgot';

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { theme } = useTheme();
  const { t, language } = useTranslation();
  const { setUser } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError(null);
    setSuccess(null);
    setMode('login');
    onClose();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        handleClose();
      }
    } catch (err: any) {
      setError(
        err.message === 'Invalid login credentials'
          ? (language === 'es' ? 'Email o contraseña incorrectos' : 'Invalid email or password')
          : err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) throw error;

      setSuccess(
        language === 'es'
          ? '¡Cuenta creada! Revisa tu email para confirmar.'
          : 'Account created! Check your email to confirm.'
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccess(
        language === 'es'
          ? 'Te enviamos un email para restablecer tu contraseña.'
          : 'We sent you an email to reset your password.'
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`,
        },
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={handleClose}
    >
      <div 
        className="w-full max-w-md rounded-2xl p-6 animate-fade-in"
        style={{
          background: theme.id === 'light' || theme.id === 'nature' ? '#fff' : '#1a1f35',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-all hover:opacity-70"
          style={{ color: theme.textMuted }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">💸</div>
          <h2 className="text-xl font-bold" style={{ color: theme.text }}>
            {mode === 'login' && (language === 'es' ? 'Iniciar Sesión' : 'Sign In')}
            {mode === 'register' && (language === 'es' ? 'Crear Cuenta' : 'Create Account')}
            {mode === 'forgot' && (language === 'es' ? 'Recuperar Contraseña' : 'Reset Password')}
          </h2>
          <p className="text-sm mt-1" style={{ color: theme.textMuted }}>
            {mode === 'login' && (language === 'es' ? 'Bienvenido de vuelta' : 'Welcome back')}
            {mode === 'register' && (language === 'es' ? 'Únete a ComparaRemesas' : 'Join ComparaRemesas')}
            {mode === 'forgot' && (language === 'es' ? 'Te enviaremos un email' : "We'll send you an email")}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div 
            className="mb-4 p-3 rounded-xl text-sm text-center"
            style={{
              background: `${theme.success}20`,
              border: `1px solid ${theme.success}`,
              color: theme.success,
            }}
          >
            ✓ {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div 
            className="mb-4 p-3 rounded-xl text-sm text-center"
            style={{
              background: `${theme.danger}20`,
              border: `1px solid ${theme.danger}`,
              color: theme.danger,
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {!success && (
          <>
            {/* Form */}
            <form onSubmit={
              mode === 'login' ? handleLogin :
              mode === 'register' ? handleRegister :
              handleForgotPassword
            }>
              {/* Name field (only for register) */}
              {mode === 'register' && (
                <div className="mb-4">
                  <label className="block text-xs mb-2" style={{ color: theme.textMuted }}>
                    {language === 'es' ? 'Nombre' : 'Name'}
                  </label>
                  <div className="relative">
                    <User 
                      size={18} 
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ color: theme.textMuted }}
                    />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={language === 'es' ? 'Tu nombre' : 'Your name'}
                      required
                      className="w-full pl-12 pr-4 py-3 rounded-xl text-sm"
                      style={{
                        background: theme.inputBg,
                        border: `2px solid ${theme.inputBorder}`,
                        color: theme.text,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Email field */}
              <div className="mb-4">
                <label className="block text-xs mb-2" style={{ color: theme.textMuted }}>
                  Email
                </label>
                <div className="relative">
                  <Mail 
                    size={18} 
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: theme.textMuted }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="w-full pl-12 pr-4 py-3 rounded-xl text-sm"
                    style={{
                      background: theme.inputBg,
                      border: `2px solid ${theme.inputBorder}`,
                      color: theme.text,
                    }}
                  />
                </div>
              </div>

              {/* Password field (not for forgot) */}
              {mode !== 'forgot' && (
                <div className="mb-4">
                  <label className="block text-xs mb-2" style={{ color: theme.textMuted }}>
                    {language === 'es' ? 'Contraseña' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock 
                      size={18} 
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ color: theme.textMuted }}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full pl-12 pr-12 py-3 rounded-xl text-sm"
                      style={{
                        background: theme.inputBg,
                        border: `2px solid ${theme.inputBorder}`,
                        color: theme.text,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      style={{ color: theme.textMuted }}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot password link */}
              {mode === 'login' && (
                <div className="text-right mb-4">
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-xs"
                    style={{ color: theme.primary }}
                  >
                    {language === 'es' ? '¿Olvidaste tu contraseña?' : 'Forgot password?'}
                  </button>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
                style={{
                  background: theme.primaryGradient,
                  color: theme.id === 'dark' || theme.id === 'midnight' ? '#000' : '#fff',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {mode === 'login' && (language === 'es' ? 'Iniciar Sesión' : 'Sign In')}
                {mode === 'register' && (language === 'es' ? 'Crear Cuenta' : 'Create Account')}
                {mode === 'forgot' && (language === 'es' ? 'Enviar Email' : 'Send Email')}
              </button>
            </form>

            {/* Divider */}
            {mode !== 'forgot' && (
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px" style={{ background: theme.surfaceBorder }} />
                <span className="text-xs" style={{ color: theme.textMuted }}>
                  {language === 'es' ? 'o continúa con' : 'or continue with'}
                </span>
                <div className="flex-1 h-px" style={{ background: theme.surfaceBorder }} />
              </div>
            )}

            {/* Social login */}
            {mode !== 'forgot' && (
              <button
                onClick={handleGoogleLogin}
                className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-3 transition-all hover:opacity-80"
                style={{
                  background: theme.surface,
                  border: `1px solid ${theme.surfaceBorder}`,
                  color: theme.text,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
            )}

            {/* Switch mode */}
            <div className="text-center mt-6">
              {mode === 'login' && (
                <p className="text-sm" style={{ color: theme.textMuted }}>
                  {language === 'es' ? '¿No tienes cuenta?' : "Don't have an account?"}{' '}
                  <button
                    onClick={() => { setMode('register'); setError(null); }}
                    className="font-semibold"
                    style={{ color: theme.primary }}
                  >
                    {language === 'es' ? 'Regístrate' : 'Sign up'}
                  </button>
                </p>
              )}
              {mode === 'register' && (
                <p className="text-sm" style={{ color: theme.textMuted }}>
                  {language === 'es' ? '¿Ya tienes cuenta?' : 'Already have an account?'}{' '}
                  <button
                    onClick={() => { setMode('login'); setError(null); }}
                    className="font-semibold"
                    style={{ color: theme.primary }}
                  >
                    {language === 'es' ? 'Inicia sesión' : 'Sign in'}
                  </button>
                </p>
              )}
              {mode === 'forgot' && (
                <button
                  onClick={() => { setMode('login'); setError(null); setSuccess(null); }}
                  className="text-sm font-semibold"
                  style={{ color: theme.primary }}
                >
                  ← {language === 'es' ? 'Volver al inicio de sesión' : 'Back to sign in'}
                </button>
              )}
            </div>
          </>
        )}

        {/* Success state - back to login */}
        {success && (
          <button
            onClick={() => { setMode('login'); setSuccess(null); }}
            className="w-full py-4 rounded-xl font-bold text-sm transition-all hover:opacity-90"
            style={{
              background: theme.primaryGradient,
              color: theme.id === 'dark' || theme.id === 'midnight' ? '#000' : '#fff',
            }}
          >
            {language === 'es' ? 'Ir a Iniciar Sesión' : 'Go to Sign In'}
          </button>
        )}
      </div>
    </div>
  );
}
