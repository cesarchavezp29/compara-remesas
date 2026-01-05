import { NextRequest, NextResponse } from 'next/server';

const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY;
const EXCHANGE_RATE_API_URL = `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/USD`;

// Cache para no hacer demasiadas requests
let cachedRates: { rates: Record<string, number>; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora en milliseconds

export async function GET(request: NextRequest) {
  try {
    // Verificar si tenemos cache válido
    const now = Date.now();
    if (cachedRates && (now - cachedRates.timestamp) < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        rates: cachedRates.rates,
        cached: true,
        lastUpdated: new Date(cachedRates.timestamp).toISOString(),
      });
    }

    // Si no hay API key, usar tasas por defecto
    if (!EXCHANGE_RATE_API_KEY) {
      console.warn('No EXCHANGE_RATE_API_KEY found, using default rates');
      return NextResponse.json({
        success: true,
        rates: getDefaultRates(),
        cached: false,
        lastUpdated: new Date().toISOString(),
        warning: 'Using default rates - API key not configured',
      });
    }

    // Hacer request a la API
    const response = await fetch(EXCHANGE_RATE_API_URL);
    const data = await response.json();

    if (data.result === 'success') {
      // Filtrar solo las monedas que nos interesan
      const relevantCurrencies = ['MXN', 'GTQ', 'COP', 'DOP', 'PEN', 'HNL', 'BRL', 'ARS', 'EUR', 'GBP', 'CAD'];
      const filteredRates: Record<string, number> = {};
      
      relevantCurrencies.forEach(currency => {
        if (data.conversion_rates[currency]) {
          filteredRates[currency] = data.conversion_rates[currency];
        }
      });

      // Guardar en cache
      cachedRates = {
        rates: filteredRates,
        timestamp: now,
      };

      return NextResponse.json({
        success: true,
        rates: filteredRates,
        cached: false,
        lastUpdated: new Date().toISOString(),
      });
    } else {
      throw new Error(data['error-type'] || 'API Error');
    }
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    // Si hay error, devolver tasas por defecto
    return NextResponse.json({
      success: true,
      rates: getDefaultRates(),
      cached: false,
      lastUpdated: new Date().toISOString(),
      warning: 'Using default rates due to API error',
    });
  }
}

function getDefaultRates(): Record<string, number> {
  return {
    MXN: 17.15,
    GTQ: 7.78,
    COP: 4150,
    DOP: 58.50,
    PEN: 3.72,
    HNL: 24.85,
    BRL: 5.05,
    ARS: 875.00,
    EUR: 0.92,
    GBP: 0.79,
    CAD: 1.36,
  };
}
