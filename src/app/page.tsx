'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    console.log('Page mounted');
  }, []);

  return (
    // ... your existing code ...
  );
}