"use client";

import { useState, useEffect } from 'react';

import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Heart, HandHeart, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';

export default function DonationCalculator() {
  const { language } = useLanguage();
  const [amount, setAmount] = useState<number>(500);
  const [aiResponse, setAiResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Debounced API call
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchImpactExplanation(amount);
    }, 800);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, language]);

  const fetchImpactExplanation = async (val: number) => {
    setIsTyping(true);
    setAiResponse('');
    try {
      const prompt = `A user is considering donating ₹${val}. Explain the tangible impact of this donation using NayePankh's real programs (e.g., sanitary napkins cost ~₹50, a meal costs ~₹20). Keep it to 2-3 sentences. Also briefly mention the 80G tax benefit (50% relief).`;

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, sessionId: 'donate_1', language, history: [] })
      });

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let completeResponse = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const text = decoder.decode(value);
          const lines = text.split('\\n\\n');
          for (const line of lines) {
            if (line.startsWith('event: message')) {
              try {
                const data = JSON.parse(line.split('\\n')[1].replace('data: ', ''));
                completeResponse += data;
                setAiResponse(completeResponse);
              } catch {}
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
      setAiResponse('Your donation will create a meaningful impact in our community. Thank you for your support!');
    } finally {
      setIsTyping(false);
    }
  };

  const meals = Math.floor(amount / 20);
  const pads = Math.floor(amount / 50);

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
        
        {/* Left side: Calculator */}
        <div className="bg-gray-50 dark:bg-slate-800 rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
              <HandHeart className="w-6 h-6 text-rose-600" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold dark:text-white">Impact Calculator</h2>
              <p className="text-sm text-gray-500">Powered by Aasha</p>
            </div>
          </div>

          <div className="mb-12">
            <div className="flex justify-between text-lg font-medium text-gray-700 dark:text-gray-300 mb-6">
              <span>Donation Amount</span>
              <span className="text-3xl font-display font-bold text-primary dark:text-blue-400">₹{amount.toLocaleString()}</span>
            </div>
            
            <input 
              type="range" 
              min="100" 
              max="10000" 
              step="100" 
              value={amount} 
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-3 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>₹100</span>
              <span>₹10,000</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 text-center">
              <div className="text-4xl mb-2">🍛</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{meals}</div>
              <div className="text-sm text-gray-500">Meals Provided</div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 text-center">
              <div className="text-4xl mb-2">🩸</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{pads}</div>
              <div className="text-sm text-gray-500">Sanitary Pads</div>
            </div>
          </div>

          <button className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-800 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
            Donate ₹{amount.toLocaleString()} <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Right side: AI Explanation */}
        <div className="p-4 md:p-8 relative">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Heart className="w-64 h-64 text-rose-500" />
          </div>
          
          <h3 className="text-4xl font-display font-bold text-gray-900 dark:text-white leading-tight mb-8">
            See the difference <span className="text-rose-500">you</span> make.
          </h3>
          
          <div className="bg-rose-50 dark:bg-rose-900/10 rounded-2xl p-6 border border-rose-100 dark:border-rose-900/30 relative">
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm">
              <HandHeart className="w-4 h-4 text-rose-500" />
            </div>
            
            {isTyping && !aiResponse ? (
              <div className="flex items-center gap-2 text-rose-400">
                <Loader2 className="w-5 h-5 animate-spin" /> Aasha is calculating...
              </div>
            ) : (
              <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed min-h-[100px]">
                {aiResponse}
              </p>
            )}
          </div>

          <div className="mt-8 flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
            <CheckCircle className="w-6 h-6 text-blue-500 flex-shrink-0" />
            <p className="text-sm text-blue-900 dark:text-blue-200">
              NayePankh Foundation is 80G certified. Your donation of ₹{amount.toLocaleString()} is eligible for a 50% tax deduction (₹{(amount/2).toLocaleString()} relief).
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
