"use client";

import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from '@/lib/contexts/LanguageContext';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <LanguageProvider>
        {children}
        <Toaster position="top-right" />
      </LanguageProvider>
    </ThemeProvider>
  );
}
