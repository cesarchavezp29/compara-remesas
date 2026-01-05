// Types for the remittance comparison app

export interface Country {
  code: string;
  name: {
    es: string;
    en: string;
  };
  flag: string;
  currency: string;
}

export interface RemittanceService {
  id: string;
  name: string;
  logo: string;
  color: string;
  fees: {
    fixed: number;
    percent: number;
  };
  spreadPercent: number;
  speed: {
    es: string;
    en: string;
  };
  deliveryMethods: string[];
  cashbackPercent: number;
  affiliateUrl?: string;
  onlyCountries?: string[];
}

export interface TransferResult {
  service: RemittanceService;
  fee: number;
  rate: number;
  received: number;
  costUSD: number;
  costPercent: number;
  cashback: number;
  toSend?: number;
}

export interface ExchangeRate {
  currency: string;
  midMarketRate: number;
  lastUpdated: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  preferredLanguage: 'es' | 'en';
  preferredTheme: 'dark' | 'light' | 'midnight' | 'nature';
  originCountry: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  destinationCountry: string;
  serviceUsed: string;
  fee: number;
  exchangeRate: number;
  amountReceived: number;
  createdAt: string;
}

export interface FamilyGroup {
  id: string;
  name: string;
  destinationCountry: string;
  monthlyGoal: number;
  members: FamilyMember[];
  createdAt: string;
}

export interface FamilyMember {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  role: 'admin' | 'member';
  joinedAt: string;
}

export interface Alert {
  id: string;
  userId: string;
  type: 'rate' | 'reminder' | 'promo';
  currency?: string;
  targetRate?: number;
  reminderDate?: string;
  message: string;
  active: boolean;
  createdAt: string;
}

export interface Feedback {
  id: string;
  userId?: string;
  category: 'bug' | 'feature' | 'general';
  rating: number;
  message: string;
  createdAt: string;
}

export type Theme = 'dark' | 'light' | 'midnight' | 'nature';
export type Language = 'es' | 'en';
