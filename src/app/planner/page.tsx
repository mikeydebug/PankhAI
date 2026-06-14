"use client";

import { useState, useRef } from 'react';
import { useLanguage } from '@/lib/contexts/LanguageContext';
import { Calendar, Loader2, Sparkles, Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import toast from 'react-hot-toast';

export default function EventPlanner() {
  const { language } = useLanguage();
  const [eventType, setEventType] = useState('Education Awareness Camp');
  const [goal, setGoal] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState('');
  
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'NayePankh_Event_Plan',
  });

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!goal.trim()) return;

    setIsGenerating(true);
    setPlan('');

    try {
      const prompt = `Create a structured event plan for a "${eventType}". Goal: ${goal}.
      Provide the output in clean Markdown with the following sections:
      - **Theme & Tagline**
      - **Activity Timeline**
      - **Volunteer Roles Needed**
      - **Preparation Checklist**`;

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt, sessionId: 'planner_1', language, history: [] })
      });

      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let completeResponse = '';
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          const text = decoder.decode(value);
          const lines = text.split('\n\n');
          for (const line of lines) {
            if (line.startsWith('event: message')) {
              try {
                const data = JSON.parse(line.split('\n')[1].replace('data: ', ''));
                completeResponse += data;
                setPlan(completeResponse);
              } catch {}
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate plan');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-96 p-6 border-r border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl dark:text-white">Udaan Planner</h1>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Event & Drive Planner</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Event Type</label>
            <select value={eventType} onChange={e => setEventType(e.target.value)} className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 bg-transparent dark:text-white focus:ring-2 focus:ring-primary outline-none">
              <option value="Education Awareness Camp">Education Awareness Camp</option>
              <option value="Food Distribution Drive">Food Distribution Drive</option>
              <option value="Sanitary Pad Drive">Sanitary Pad Drive</option>
              <option value="Clothes Donation Camp">Clothes Donation Camp</option>
              <option value="Stray Animal Feeding">Stray Animal Feeding</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rough Goal / Details</label>
            <textarea
              value={goal}
              onChange={e => setGoal(e.target.value)}
              placeholder="e.g. Reach 50 kids in the slum area..."
              className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-4 py-3 bg-transparent dark:text-white h-32 resize-none focus:ring-2 focus:ring-primary outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!goal.trim() || isGenerating}
            className="w-full bg-sky-600 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-sky-700 transition-colors shadow-md"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {isGenerating ? 'Drafting Plan...' : 'Generate Plan'}
          </button>
        </form>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-50 dark:bg-slate-900/50 p-6 md:p-12 overflow-y-auto relative">
        {!isGenerating && !plan ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <Calendar className="w-16 h-16 mb-4 opacity-50" />
            <p>Select an event type and generate a comprehensive plan.</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {plan && (
              <div className="flex justify-end mb-4">
                <button onClick={handlePrint} className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                  <Printer className="w-4 h-4" /> Print / Save PDF
                </button>
              </div>
            )}
            
            {/* Printable Content */}
            <div 
              ref={componentRef}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 p-8 md:p-12 print:shadow-none print:border-none print:p-0"
            >
              <div className="hidden print:flex items-center justify-between border-b-2 border-primary pb-6 mb-8">
                <div>
                  <h1 className="text-3xl font-display font-bold text-gray-900">NayePankh Foundation</h1>
                  <p className="text-gray-500 mt-1">Official Event Plan</p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-800">{eventType}</div>
                  <div className="text-sm text-gray-500">{new Date().toLocaleDateString()}</div>
                </div>
              </div>
              
              <div className="prose prose-sky dark:prose-invert max-w-none print:text-black">
                {plan.split('\n').map((line, i) => {
                  if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-6 mb-3">{line.replace('### ', '')}</h3>;
                  if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-8 mb-4 border-b pb-2">{line.replace('## ', '')}</h2>;
                  if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold mt-4 mb-6">{line.replace('# ', '')}</h1>;
                  if (line.startsWith('- ')) return <li key={i} className="ml-4 mb-1">{line.replace('- ', '').replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')}</li>;
                  if (line.trim() === '') return <br key={i} />;
                  return <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: line.replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>') }} />;
                })}
              </div>
              
              <div className="hidden print:block mt-16 pt-8 border-t text-center text-sm text-gray-500">
                Generated by Udaan AI Planner • NayePankh Foundation (80G & 12A Certified)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
