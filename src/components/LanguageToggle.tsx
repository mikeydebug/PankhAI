"use client";

import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Language } from '@/lib/i18n/translations';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const options: { value: Language; label: string }[] = [
    { value: 'en', label: 'EN' },
    { value: 'hi', label: 'हिंदी' },
    { value: 'hinglish', label: 'Hinglish' },
  ];

  return (
    <div className="flex bg-gray-200/50 dark:bg-gray-800/50 p-1 rounded-full border border-gray-200 dark:border-gray-700">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setLanguage(opt.value)}
          className={`px-3 py-1 text-xs md:text-sm rounded-full transition-all duration-300 font-medium ${
            language === opt.value
              ? 'bg-white dark:bg-slate-700 shadow text-primary dark:text-accent'
              : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
