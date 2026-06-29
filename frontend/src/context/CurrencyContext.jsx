import React, { createContext, useContext, useState } from 'react';

const CurrencyContext = createContext();

const exchangeRates = {
  USD: { rate: 1, symbol: '$' },
  EUR: { rate: 0.93, symbol: '€' },
  GBP: { rate: 0.79, symbol: '£' },
  CAD: { rate: 1.35, symbol: 'CA$' }
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD');

  const formatPrice = (usdPrice) => {
    if (!usdPrice) return "0.00";
    const converted = usdPrice * exchangeRates[currency].rate;
    return `${exchangeRates[currency].symbol}${converted.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, currencies: Object.keys(exchangeRates) }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
