import { Country, RemittanceService, TransferResult } from '@/types';
import { defaultRates } from './data';

// Get exchange rate for a currency (will be enhanced with real-time API)
export function getExchangeRate(currency: string, rates?: Record<string, number>): number {
  const rateData = rates || defaultRates;
  return rateData[currency] || 1;
}

// Calculate transfer details for normal mode (sending X USD)
export function calculateTransfer(
  amount: number,
  country: Country,
  service: RemittanceService,
  rates?: Record<string, number>
): TransferResult {
  const midRate = getExchangeRate(country.currency, rates);
  
  // Calculate fees
  const fixedFee = service.fees.fixed;
  const percentFee = (amount * service.fees.percent) / 100;
  const totalFee = fixedFee + percentFee;
  
  // Amount after fees
  const amountAfterFees = amount - totalFee;
  
  // Apply spread to exchange rate
  const serviceRate = midRate * (1 - service.spreadPercent / 100);
  
  // Calculate received amount
  const received = amountAfterFees * serviceRate;
  
  // Calculate true cost (vs mid-market)
  const idealReceived = amount * midRate;
  const costInDestCurrency = idealReceived - received;
  const costInUSD = costInDestCurrency / midRate;
  const costPercent = (costInUSD / amount) * 100;
  
  // Calculate cashback
  const cashback = (costInUSD * service.cashbackPercent) / 100;
  
  return {
    service,
    fee: totalFee,
    rate: serviceRate,
    received,
    costUSD: costInUSD,
    costPercent,
    cashback,
  };
}

// Calculate transfer details for inverse mode (recipient needs X local currency)
export function calculateInverseTransfer(
  targetAmount: number,
  country: Country,
  service: RemittanceService,
  rates?: Record<string, number>
): TransferResult {
  const midRate = getExchangeRate(country.currency, rates);
  
  // Service exchange rate with spread
  const serviceRate = midRate * (1 - service.spreadPercent / 100);
  
  // Amount needed before fees
  const amountBeforeFees = targetAmount / serviceRate;
  
  // Calculate fees
  const fixedFee = service.fees.fixed;
  const percentFee = (amountBeforeFees * service.fees.percent) / 100;
  const totalFee = fixedFee + percentFee;
  
  // Total to send
  const totalToSend = amountBeforeFees + totalFee;
  
  // Calculate true cost
  const idealAmount = targetAmount / midRate;
  const costInUSD = totalToSend - idealAmount;
  const costPercent = (costInUSD / totalToSend) * 100;
  
  // Calculate cashback
  const cashback = (costInUSD * service.cashbackPercent) / 100;
  
  return {
    service,
    fee: totalFee,
    rate: serviceRate,
    received: targetAmount,
    costUSD: costInUSD,
    costPercent,
    cashback,
    toSend: totalToSend,
  };
}

// Compare all services and sort by best option
export function compareServices(
  amount: number,
  country: Country,
  services: RemittanceService[],
  inverseMode: boolean = false,
  rates?: Record<string, number>
): TransferResult[] {
  // Filter services available for this country
  const availableServices = services.filter(
    s => !s.onlyCountries || s.onlyCountries.includes(country.code)
  );
  
  // Calculate for each service
  const results = availableServices.map(service => 
    inverseMode 
      ? calculateInverseTransfer(amount, country, service, rates)
      : calculateTransfer(amount, country, service, rates)
  );
  
  // Sort by best option
  return results.sort((a, b) => {
    if (inverseMode) {
      // For inverse mode, lower toSend is better
      return (a.toSend || 0) - (b.toSend || 0);
    }
    // For normal mode, higher received is better
    return b.received - a.received;
  });
}

// Format currency for display
export function formatCurrency(
  value: number, 
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  if (currency === 'COP' || currency === 'ARS') {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Calculate potential savings
export function calculateSavings(results: TransferResult[]): number {
  if (results.length < 2) return 0;
  const best = results[0];
  const worst = results[results.length - 1];
  return worst.costUSD - best.costUSD;
}
