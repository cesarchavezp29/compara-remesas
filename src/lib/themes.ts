export interface ThemeColors {
  id: string;
  name: {
    es: string;
    en: string;
  };
  icon: string;
  background: string;
  surface: string;
  surfaceBorder: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryGradient: string;
  secondary: string;
  secondaryGradient: string;
  danger: string;
  warning: string;
  success: string;
  inputBg: string;
  inputBorder: string;
  navBg: string;
  cardHighlight: string;
}

export const themes: Record<string, ThemeColors> = {
  dark: {
    id: 'dark',
    name: { es: 'Oscuro', en: 'Dark' },
    icon: '🌙',
    background: 'linear-gradient(135deg, #0a0f1c 0%, #1a1f35 50%, #0d1a2d 100%)',
    surface: 'rgba(255, 255, 255, 0.03)',
    surfaceBorder: 'rgba(255, 255, 255, 0.08)',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    textMuted: 'rgba(255, 255, 255, 0.4)',
    primary: '#00ff88',
    primaryGradient: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)',
    secondary: '#6366f1',
    secondaryGradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    danger: '#ff6b6b',
    warning: '#ffc800',
    success: '#00ff88',
    inputBg: 'rgba(0, 0, 0, 0.3)',
    inputBorder: 'rgba(255, 255, 255, 0.1)',
    navBg: 'rgba(10, 15, 28, 0.98)',
    cardHighlight: 'rgba(0, 255, 136, 0.1)',
  },
  light: {
    id: 'light',
    name: { es: 'Claro', en: 'Light' },
    icon: '☀️',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%)',
    surface: 'rgba(255, 255, 255, 0.8)',
    surfaceBorder: 'rgba(0, 0, 0, 0.08)',
    text: '#1e293b',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    primary: '#00b85e',
    primaryGradient: 'linear-gradient(135deg, #00c853 0%, #00a846 100%)',
    secondary: '#6366f1',
    secondaryGradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    danger: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    inputBg: 'rgba(255, 255, 255, 0.9)',
    inputBorder: 'rgba(0, 0, 0, 0.12)',
    navBg: 'rgba(255, 255, 255, 0.95)',
    cardHighlight: 'rgba(0, 200, 106, 0.1)',
  },
  midnight: {
    id: 'midnight',
    name: { es: 'Medianoche', en: 'Midnight' },
    icon: '🌌',
    background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
    surface: 'rgba(255, 255, 255, 0.04)',
    surfaceBorder: 'rgba(99, 102, 241, 0.15)',
    text: '#e2e8f0',
    textSecondary: '#a5b4fc',
    textMuted: 'rgba(165, 180, 252, 0.5)',
    primary: '#818cf8',
    primaryGradient: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
    secondary: '#f472b6',
    secondaryGradient: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
    danger: '#f87171',
    warning: '#fbbf24',
    success: '#34d399',
    inputBg: 'rgba(0, 0, 0, 0.4)',
    inputBorder: 'rgba(99, 102, 241, 0.2)',
    navBg: 'rgba(15, 15, 26, 0.98)',
    cardHighlight: 'rgba(99, 102, 241, 0.15)',
  },
  nature: {
    id: 'nature',
    name: { es: 'Naturaleza', en: 'Nature' },
    icon: '🌿',
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #d1fae5 100%)',
    surface: 'rgba(255, 255, 255, 0.85)',
    surfaceBorder: 'rgba(34, 197, 94, 0.15)',
    text: '#14532d',
    textSecondary: '#166534',
    textMuted: '#6b7280',
    primary: '#16a34a',
    primaryGradient: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    secondary: '#0d9488',
    secondaryGradient: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
    danger: '#dc2626',
    warning: '#d97706',
    success: '#16a34a',
    inputBg: 'rgba(255, 255, 255, 0.95)',
    inputBorder: 'rgba(34, 197, 94, 0.2)',
    navBg: 'rgba(240, 253, 244, 0.98)',
    cardHighlight: 'rgba(34, 197, 94, 0.12)',
  },
};

export type ThemeId = keyof typeof themes;
