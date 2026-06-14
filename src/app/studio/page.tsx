"use client";

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Copy, Download, Heart, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import * as htmlToImage from 'html-to-image';
import toast from 'react-hot-toast';

export default function CampaignStudio() {
  const { language } = useLanguage();
  const [goal, setGoal] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [tone, setTone] = useState('Friendly & Inspiring');
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<string[]>([]);
  const postRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!goal.trim()) return;

    setIsGenerating(true);
    setGeneratedPosts([]);

    try {
      const prompt = `Create 3 distinct variations of a social media post for ${platform}.
      Goal: ${goal}
      Tone: ${tone}
      
      Output exactly 3 variations, separated by "---". Include relevant emojis and a few hashtags at the end of each. Do not number them.`;

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, sessionId: 'studio_1', language: selectedLanguage, history: [] })
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
              const dataStr = line.split('\\n')[1].replace('data: ', '');
              try {
                const data = JSON.parse(dataStr);
                completeResponse += data;
                setGeneratedPosts(completeResponse.split('---').map(p => p.trim()).filter(Boolean));
              } catch {}
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate posts');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleExport = async (index: number) => {
    const el = postRefs.current[index];
    if (!el) return;
    try {
      const dataUrl = await htmlToImage.toPng(el, { quality: 1, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `NayePankh_Campaign_${index + 1}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Exported as image');
    } catch (err) {
      console.error('Failed to export image', err);
      toast.error('Failed to export image');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[calc(100vh-4rem)]">
      {/* Controls Sidebar */}
      <div className="w-full lg:w-96 p-6 border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
            <Heart className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl dark:text-white">Awaaz Studio</h1>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Campaign Creator</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Campaign Goal</label>
            <textarea
              value={goal}
              onChange={e => setGoal(e.target.value)}
              placeholder="e.g. Sanitary pad distribution drive in Kanpur slums next week..."
              className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 bg-transparent dark:text-white h-32 resize-none focus:ring-2 focus:ring-accent outline-none transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Platform</label>
            <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 bg-transparent dark:text-white focus:ring-2 focus:ring-accent outline-none appearance-none cursor-pointer">
              <option value="Instagram">Instagram</option>
              <option value="Twitter">Twitter / X</option>
              <option value="WhatsApp">WhatsApp Broadcast</option>
              <option value="LinkedIn">LinkedIn</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tone</label>
            <select value={tone} onChange={e => setTone(e.target.value)} className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 bg-transparent dark:text-white focus:ring-2 focus:ring-accent outline-none appearance-none cursor-pointer">
              <option value="Friendly & Inspiring">Friendly & Inspiring</option>
              <option value="Formal & Professional">Formal & Professional</option>
              <option value="Urgent Call to Action">Urgent Call to Action</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Language Style</label>
            <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value as "en" | "hi" | "hinglish")} className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 bg-transparent dark:text-white focus:ring-2 focus:ring-accent outline-none appearance-none cursor-pointer">
              <option value="en">English</option>
              <option value="hi">Hindi (हिंदी)</option>
              <option value="hinglish">Hinglish</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!goal.trim() || isGenerating}
            className="w-full bg-accent text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-orange-600 transition-colors shadow-md"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {isGenerating ? 'Generating...' : 'Generate Posts'}
          </button>
        </form>
      </div>

      {/* Output Area */}
      <div className="flex-1 p-6 md:p-12 bg-gray-50 dark:bg-slate-900/50 overflow-y-auto">
        {!isGenerating && generatedPosts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
            <p>Fill out the campaign details and click Generate.</p>
          </div>
        ) : (
          <div className="space-y-8 max-w-3xl mx-auto">
            {generatedPosts.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden"
              >
                {/* Exportable Post Card */}
                <div 
                  ref={el => { postRefs.current[index] = el }}
                  className="p-8 bg-white dark:bg-slate-900 relative"
                >
                  {/* Watermark / Branding for Export */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center rotate-45">
                        <div className="w-4 h-4 border-t-2 border-r-2 border-white -rotate-45" />
                      </div>
                      <div>
                        <div className="font-display font-bold text-gray-900 dark:text-white leading-none">NayePankh Foundation</div>
                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Giving Wings</div>
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-lg leading-relaxed">
                    {post}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="px-8 py-4 bg-gray-50 dark:bg-slate-800/80 border-t border-gray-100 dark:border-slate-700 flex justify-end gap-3">
                  <button onClick={() => copyToClipboard(post)} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700">
                    <Copy className="w-4 h-4" /> Copy Text
                  </button>
                  <button onClick={() => handleExport(index)} className="flex items-center gap-2 text-sm text-primary hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30">
                    <Download className="w-4 h-4" /> Export Image
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
