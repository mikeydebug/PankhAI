"use client";

import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-border transition-colors duration-300">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary overflow-hidden">
             {/* Subtly animated wing/feather motif */}
             <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent opacity-80" />
             <svg className="w-5 h-5 text-white relative z-10 transform group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
               <line x1="16" y1="8" x2="2" y2="22"/>
               <line x1="17.5" y1="15" x2="9" y2="15"/>
             </svg>
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-primary dark:text-white transition-colors duration-300">
            Pankh<span className="text-accent">AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-3 md:gap-4">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
