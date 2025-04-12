import { useState, useEffect } from 'react';
import { getRandomQuote } from '@/utils/quotes';

export function useQuotes(interval = 10000) {
  const [quote, setQuote] = useState(getRandomQuote());

  useEffect(() => {
    const timer = setInterval(() => {
      setQuote(getRandomQuote());
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return quote;
} 